import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { encryptBuffer } from '@/utils/encryption';
import { getSessionUser } from '@/utils/getSessionUser';
import User from '@/models/User';
import Receipt from '@/models/Receipt';
import connectDB from '@/config/database';

// Config Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (request) => {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

        await connectDB();
        const user = await User.findById(sessionUser.userId);
        if (!user) return new NextResponse('User not found', { status: 404 });
        
        if (user.planType === 'free' || !user.isPro) {
            if (user.lifetimeReceipts === undefined || user.lifetimeReceipts === 0) {
                user.lifetimeReceipts = await Receipt.countDocuments({ user: sessionUser.userId });
                await user.save();
            }
            if (user.lifetimeReceipts >= 10) {
                return new NextResponse(JSON.stringify({ message: 'Free plan limit reached. You can only upload 10 receipts. Please upgrade to Pro.' }), { status: 403 });
            }
        }

        const formData = await request.formData();
        const file = formData.get('file');
        // Check if file is missing OR if it was passed as a string
        if (!file || typeof file === 'string') {
            return new NextResponse("No valid image file provided", { status: 400 });
        }

        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
            return new NextResponse(JSON.stringify({ message: 'File exceeds 5MB limit' }), { status: 413 });
        }

        const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
        if (!validMimeTypes.includes(file.type)) {
            return new NextResponse(JSON.stringify({ message: 'Invalid file type. Only images are allowed.' }), { status: 415 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const originalBuffer = Buffer.from(arrayBuffer);

        // 1. Encrypt the file
        const encryptedBuffer = encryptBuffer(originalBuffer);

        // 2. Upload to Cloudinary securely
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'receipt-scan-app/receipts',
                    resource_type: 'raw',
                    type: 'authenticated'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(encryptedBuffer);
        });

        return NextResponse.json({
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            mime_type: file.type || "image/jpeg"
        }, { status: 200 });

    } catch (error) {
        console.error("Upload failed:", error);
        return new NextResponse("Upload failed", { status: 500 });
    }
};
