import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSessionUser } from '@/utils/getSessionUser';

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

        return NextResponse.json({
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id
        }, { status: 200 });

    } catch (error) {
        console.error('Image Upload Error:', error);
        return new NextResponse('Server Error Uploading Image', { status: 500 });
    }
};
