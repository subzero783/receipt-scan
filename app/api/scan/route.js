import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from 'openai';
// Needs updates so each Receipt information with the User information is updated in the MongoDB database. 

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
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return new NextResponse('No file uploaded', { status: 400 });
        }

        // --- A. Upload to Cloudinary ---
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

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

        // --- B. Send to OpenAI GPT-4o ---
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a receipt scanning assistant. Extract data from the image and return ONLY a valid JSON object with no markdown formatting. Keys: 'merchant_name' (string), 'total_amount' (number), 'date' (YYYY-MM-DD), 'category' (string: e.g., 'Food', 'Transport', 'Supplies'). If a field is missing, use null."
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

        // --- C. Parse & Return Data ---
        const aiContent = response.choices[0].message.content;

        // Clean up potential markdown code blocks (```json ... ```)
        const cleanJson = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
        const receiptData = JSON.parse(cleanJson);

        return NextResponse.json(
            {
                message: 'Scan successful',
                url: imageUrl,
                data: receiptData
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Scan Error:', error);
        return new NextResponse('Server Error Processing Receipt', { status: 500 });
    }
};