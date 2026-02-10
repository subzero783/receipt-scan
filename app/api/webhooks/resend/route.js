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

import { Resend } from 'resend';

// ... other imports ...
// 2. Config OpenAI
const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY, // Ensure this matches your env variable name
});

const resendClient = new Resend(process.env.RESEND_API_KEY);

export const POST = async (request) => {
    try {
        // 1. Parse Resend Payload
        console.log("Webhook received");
        const data = await request.json();
        const payload = data.data || data; // Handle both wrapped and unwrapped payloads, just in case

        // Resend sends the email object inside the payload
        // Structure: https://resend.com/docs/dashboard/webhooks/event-types
        // The payload usually contains 'email_id' but not the content.
        const { to, email_id } = payload;

        console.log("to: ", to);
        console.log("email_id: ", email_id);
        console.log("Webhook payload: ", payload);

        // Safety check: Ensure there is a recipient and email_id
        if (!to || !to.length || !email_id) {
            return new NextResponse('No recipient or email_id found', { status: 200 }); // Return 200 to stop Resend from retrying
        }

        await connectDB();

        // 2. Identify the User
        // The 'to' field is an array. We need to find the one matching our domain.
        // Example to[0] (string or object)
        let recipientsList = to;
        // If 'to' is an array of objects ({ email: '...' }), map it. If strings, keep it.
        // User payload showed: to: [ 'estark3923@reermi.resend.app' ] (strings)

        let targetUser = null;

        for (const recipient of recipientsList) {
            const emailAddress = typeof recipient === 'string' ? recipient : recipient.email;
            const handle = emailAddress.split('@')[0]; // "a4882786"

            // Find user by this handle
            const user = await User.findOne({ inboundHandle: handle });
            if (user) {
                targetUser = user;
                break;
            }
        }

        if (!targetUser) {
            console.error('Inbound Email: No matching user found for recipients:', recipientsList);
            return new NextResponse('User not found', { status: 200 });
        }

        // 3. Process Attachments - FETCH CONTENT
        // Fetch list of attachments from Resend to ensure we have the correct IDs
        console.log(`Listing attachments for email ID: ${email_id}`);
        // Correct SDK Path: resend.emails.receiving.attachments.list
        const { data: attachmentsList, error: listError } = await resendClient.emails.receiving.attachments.list({
            emailId: email_id,
        });

        const dataAttachments = attachmentsList.data;

        console.log("dataAttachments: ", dataAttachments);
        console.log("listError: ", listError);

        if (listError) {
            console.error('Error listing attachments:', listError);
            return new NextResponse('Failed to list attachments', { status: 500 });
        }

        const attachments = dataAttachments || [];
        console.log(`Found ${attachments.length} attachments from Resend API.`);

        const processedReceipts = [];

        for (const attachment of attachments) {
            // Skip non-images/pdfs
            const supportedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp'];
            if (!supportedTypes.includes(attachment.content_type)) {
                console.log(`Skipping unsupported type: ${attachment.content_type}`);
                continue;
            }

            console.log('attachment ID: ', attachment.id);

            // Check for download_url
            if (!attachment.download_url) {
                console.log(`Attachment ${attachment.id} has no download_url.`);
                continue;
            }

            console.log(`Fetching content from URL: ${attachment.download_url}`);

            let buffer;
            try {
                const response = await fetch(attachment.download_url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch attachment content: ${response.statusText}`);
                }
                const arrayBuffer = await response.arrayBuffer();
                buffer = Buffer.from(arrayBuffer);
            } catch (err) {
                console.error(`Error downloading attachment ${attachment.id}:`, err);
                continue;
            }

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