import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from 'openai';
import connectDB from '@/config/database';
import Receipt from '@/models/Receipt';
import { getSessionUser } from '@/utils/getSessionUser';
import User from '@/models/User';

// 1. Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Config OpenAI
const openai = new OpenAI({
  apiKey: process.env.NEXT_OPENAI_API_KEY,
});

// --- POST: Upload and Scan (Existing Logic) ---
export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

    const userId = sessionUser.userId;

    // Check User Subscription and Receipt Count
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    if (user.planType === 'free' || !user.isPro) {
      const receiptCount = await Receipt.countDocuments({ user: userId });
      if (receiptCount >= 10) {
        return new NextResponse(JSON.stringify({ message: 'Free plan limit reached. You can only upload 10 receipts. Please upgrade to Pro.' }), { status: 403 });
      }
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new NextResponse(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'receipt-scan-app',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const imageUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;

    // Send to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a receipt scanning assistant. Extract data from the image and return ONLY a valid JSON object with no markdown formatting. Keys: 'merchant_name' (string), 'total_amount' (number), 'date' (YYYY-MM-DD), 'category' (string: e.g., 'Food', 'Transport', 'Supplies', 'Utilities', 'Other'). If a field is missing, use reasonable defaults or null."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this receipt." },
            {
              type: "image_url",
              image_url: {
                "url": imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const aiContent = response.choices[0].message.content;
    const cleanJson = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const extractedData = JSON.parse(cleanJson);

    // Save to MongoDB
    const newReceipt = new Receipt({
      user: userId,
      imageUrl: imageUrl,
      publicId: publicId,
      merchantName: extractedData.merchant_name || 'Unknown',
      totalAmount: extractedData.total_amount || 0,
      transactionDate: extractedData.date ? new Date(extractedData.date) : new Date(),
      category: extractedData.category || 'Uncategorized',
    });

    await newReceipt.save();

    return NextResponse.json(
      {
        message: 'Scan successful',
        data: {
          id: newReceipt._id,
          merchant_name: newReceipt.merchantName,
          total_amount: newReceipt.totalAmount,
          date: newReceipt.transactionDate,
          category: newReceipt.category,
          imageUrl: newReceipt.imageUrl
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Scan Error:', error);
    return new NextResponse(JSON.stringify({ message: 'Server Error Processing Receipt' }), { status: 500 });
  }
};

// --- PUT: Update Receipts (Batch or Single) ---
export const PUT = async (request) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

    const { receipts } = await request.json(); // Expects { receipts: [...] }

    if (!receipts || !Array.isArray(receipts)) {
      return new NextResponse('Invalid data format', { status: 400 });
    }

    // Process updates in parallel
    const updatePromises = receipts.map(async (receiptData) => {
      // Map frontend keys (from OpenAI) to Database keys
      // Frontend: merchant_name, total_amount, date
      // DB: merchantName, totalAmount, transactionDate

      return Receipt.findOneAndUpdate(
        { _id: receiptData.id, user: sessionUser.userId }, // Ensure user owns the receipt
        {
          merchantName: receiptData.merchant_name || receiptData.merchantName,
          totalAmount: receiptData.total_amount || receiptData.totalAmount,
          transactionDate: receiptData.date || receiptData.transactionDate,
          category: receiptData.category
        },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Receipts updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Update Error:', error);
    return new NextResponse('Server Error Updating Receipts', { status: 500 });
  }
};

// --- DELETE: Delete Receipts (Batch or Single) ---
export const DELETE = async (request) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

    const { ids } = await request.json(); // Expects { ids: [id1, id2] }

    if (!ids || !Array.isArray(ids)) {
      return new NextResponse('Invalid data format', { status: 400 });
    }

    // 1. Find receipts to get their Cloudinary Public IDs
    const receiptsToDelete = await Receipt.find({
      _id: { $in: ids },
      user: sessionUser.userId
    });

    if (receiptsToDelete.length === 0) {
      return new NextResponse('No receipts found to delete', { status: 404 });
    }

    // 2. Delete images from Cloudinary
    const cloudinaryPromises = receiptsToDelete
      .filter(r => r.publicId) // Only if they have a publicId
      .map(r => cloudinary.uploader.destroy(r.publicId));

    await Promise.all(cloudinaryPromises);

    // 3. Delete from MongoDB
    await Receipt.deleteMany({
      _id: { $in: ids },
      user: sessionUser.userId
    });

    return NextResponse.json({ message: 'Receipts deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Delete Error:', error);
    return new NextResponse('Server Error Deleting Receipts', { status: 500 });
  }
};