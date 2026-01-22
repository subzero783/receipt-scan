import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from 'openai';
import connectDB from '@/config/database';
import Receipt from '@/models/Receipt';
import { getSessionUser } from '@/utils/getSessionUser';
import User from '@/models/User'; // Import User model

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

export const POST = async (request) => {
  try {
    await connectDB();

    // --- A. Authenticate User ---
    const sessionUser = await getSessionUser();

    if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

    // --- NEW: CHECK SUBSCRIPTION STATUS ---
    const userId = await User.findById(sessionUser.userId);

    // Option A: Hard Gate (Must be Pro)
    // if (!user.isPro) {
    //   return new NextResponse(JSON.stringify({
    //     message: 'Subscription Required',
    //     requiresUpgrade: true
    //   }), { status: 403 });
    // }

    // --- B. Handle File Upload ---
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new NextResponse(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
    }

    // Convert to Buffer
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

    // --- C. Send to OpenAI GPT-4o ---
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

    // Parse AI Response
    const aiContent = response.choices[0].message.content;
    const cleanJson = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const extractedData = JSON.parse(cleanJson);

    // --- D. Save to MongoDB ---
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
          // Return the MongoDB document structure so the UI can use the ID if needed
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