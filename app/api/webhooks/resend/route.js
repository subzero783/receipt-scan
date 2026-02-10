import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User from '@/models/User';
import Receipt from '@/models/Receipt';
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from 'openai';

// 1. Config Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Config OpenAI
const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY, // Ensure this matches your env variable name
});

export const POST = async (request) => {
    try {
        // 1. Parse Resend Payload
        const payload = await request.json();

        // Resend sends the email object inside the payload
        // Structure: https://resend.com/docs/dashboard/webhooks/event-types
        const { to, attachments } = payload;

        // Safety check: Ensure there is a recipient and attachments
        if (!to || !to.length || !attachments || !attachments.length) {
            return new NextResponse('No recipient or attachments found', { status: 200 }); // Return 200 to stop Resend from retrying
        }

        await connectDB();

        // 2. Identify the User
        // The 'to' field is an array. We need to find the one matching our domain.
        // Example to[0].email = "a4882786@reermi.resend.app"

        let targetUser = null;

        for (const recipient of to) {
            const emailAddress = recipient.email; // "a4882786@reermi.resend.app"
            const handle = emailAddress.split('@')[0]; // "a4882786"

            // Find user by this handle
            const user = await User.findOne({ inboundHandle: handle });
            if (user) {
                targetUser = user;
                break;
            }
        }

        if (!targetUser) {
            console.error('Inbound Email: No matching user found for handles:', to.map(t => t.email));
            return new NextResponse('User not found', { status: 200 });
        }

        // 3. Process Attachments
        const processedReceipts = [];

        for (const attachment of attachments) {
            // Resend provides 'content' as a buffer array or base64? 
            // Resend Webhooks usually provide content as a Buffer array (integers).

            // Skip non-images/pdfs
            const supportedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp'];
            if (!supportedTypes.includes(attachment.content_type)) continue;

            // Convert Buffer array to Base64 for Cloudinary
            const buffer = Buffer.from(attachment.content);

            // --- A. Upload to Cloudinary ---
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'receipt-scan-app/email-uploads' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });

            const imageUrl = uploadResult.secure_url;
            const publicId = uploadResult.public_id;

            // --- B. Scan with OpenAI ---
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are a receipt scanning assistant. Extract data from the image and return ONLY a valid JSON object. Keys: 'merchant_name', 'total_amount', 'date', 'category'."
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Analyze this receipt." },
                            { type: "image_url", image_url: { "url": imageUrl } },
                        ],
                    },
                ],
                max_tokens: 300,
            });

            const aiContent = response.choices[0].message.content;
            const cleanJson = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
            const extractedData = JSON.parse(cleanJson);

            // --- C. Save to DB ---
            const newReceipt = new Receipt({
                user: targetUser._id,
                imageUrl: imageUrl,
                publicId: publicId,
                merchantName: extractedData.merchant_name || 'Unknown',
                totalAmount: extractedData.total_amount || 0,
                transactionDate: extractedData.date ? new Date(extractedData.date) : new Date(),
                category: extractedData.category || 'Uncategorized',
            });

            await newReceipt.save();
            processedReceipts.push(newReceipt._id);
        }

        console.log(`Processed ${processedReceipts.length} receipts for user ${targetUser.email}`);
        return NextResponse.json({ success: true, count: processedReceipts.length }, { status: 200 });

    } catch (error) {
        console.error('Webhook Error:', error);
        // Important: Return 200 even on error to prevent Resend from retrying infinitely if it's a logic error
        return new NextResponse('Internal Error', { status: 500 });
    }
};