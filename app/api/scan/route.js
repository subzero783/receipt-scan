import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { GoogleGenAI } from "@google/genai";
import connectDB from '@/config/database';
import Receipt from '@/models/Receipt';
import { getSessionUser } from '@/utils/getSessionUser';
import User from '@/models/User';
import { encryptBuffer } from '@/utils/encryption'; // <-- IMPORT ENCRYPTION

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_GEMINI_API_KEY,
});

// --- POST: Upload, Scan, and Encrypt ---
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
      if (user.lifetimeReceipts === undefined || user.lifetimeReceipts === 0) {
        user.lifetimeReceipts = await Receipt.countDocuments({ user: userId });
        await user.save();
      }

      if (user.lifetimeReceipts >= 10) {
        return new NextResponse(JSON.stringify({ message: 'Free plan limit reached. You can only upload 10 receipts. Please upgrade to Pro.' }), { status: 403 });
      }
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new NextResponse(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size > MAX_FILE_SIZE) {
      return new NextResponse(JSON.stringify({ message: 'File exceeds 5MB limit' }), { status: 413 });
    }

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!validMimeTypes.includes(file.type)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid file type. Only images are allowed.' }), { status: 415 });
    }

    const bytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(bytes);

    // 1. SCAN WITH GEMINI (Must happen BEFORE encryption)
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: "You are a receipt scanning assistant. Extract data from the image and return ONLY a valid JSON object. Keys: 'merchant_name', 'total_amount', 'date', 'category'." },
            {
              inlineData: {
                mimeType: file.type || "image/jpeg",
                data: originalBuffer.toString("base64")
              }
            }
          ],
        },
      ],
    });

    const aiContent = response.text;
    const cleanJson = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
    let extractedData = {};
    try {
      extractedData = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse Gemini JSON", cleanJson);
      return new NextResponse(JSON.stringify({ message: 'AI failed to extract readable data' }), { status: 500 });
    }

    // 2. ENCRYPT THE RECEIPT (Zero-Knowledge)
    const encryptedBuffer = encryptBuffer(originalBuffer);

    // 3. UPLOAD ENCRYPTED DATA TO CLOUDINARY
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'receipt-scan-app/receipts',
          resource_type: 'raw', // CRITICAL: Cloudinary handles this as locked data, not an image
          type: 'authenticated'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(encryptedBuffer); // Send the scrambled buffer
    });

    // 4. SAVE TO MONGODB
    // Note: Do not save a 1-hour signed URL to DB, or the image breaks tomorrow
    // Save the permanent secure_url. The frontend will decrypt it on the fly.
    const newReceipt = new Receipt({
      user: userId,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      merchantName: extractedData.merchant_name || 'Unknown',
      totalAmount: extractedData.total_amount || 0,
      transactionDate: extractedData.date ? new Date(extractedData.date) : new Date(),
      category: extractedData.category || 'Uncategorized',
    });

    await newReceipt.save();

    // Increment lifetime receipts
    user.lifetimeReceipts = (user.lifetimeReceipts || 0) + 1;
    await user.save();

    return NextResponse.json(
      {
        message: 'Scan successful',
        data: {
          id: newReceipt._id,
          merchant_name: newReceipt.merchantName,
          total_amount: newReceipt.totalAmount,
          date: newReceipt.transactionDate,
          category: newReceipt.category,
          imageUrl: newReceipt.imageUrl,
          publicId: newReceipt.publicId
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Scan Error:', error);
    return new NextResponse(JSON.stringify({ message: 'Server Error Processing Receipt' }), { status: 500 });
  }
};

// --- PUT: Update Receipts (Existing Logic) ---
export const PUT = async (request) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

    const { receipts } = await request.json();

    if (!receipts || !Array.isArray(receipts)) {
      return new NextResponse('Invalid data format', { status: 400 });
    }

    const updatePromises = receipts.map(async (receiptData) => {
      return Receipt.findOneAndUpdate(
        { _id: receiptData.id, user: sessionUser.userId },
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

// --- DELETE: Delete Receipts (Updated for Encryption) ---
export const DELETE = async (request) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids)) {
      return new NextResponse('Invalid data format', { status: 400 });
    }

    const receiptsToDelete = await Receipt.find({
      _id: { $in: ids },
      user: sessionUser.userId
    });

    if (receiptsToDelete.length === 0) {
      return new NextResponse('No receipts found to delete', { status: 404 });
    }

    // UPDATED: Must specify resource_type: 'raw' to delete encrypted files
    const cloudinaryPromises = receiptsToDelete
      .filter(r => r.publicId)
      .map(r => cloudinary.uploader.destroy(r.publicId, { resource_type: 'raw' }));

    await Promise.all(cloudinaryPromises);

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