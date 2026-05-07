import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSessionUser } from "@/utils/getSessionUser";
import { decryptBuffer } from '@/utils/encryption';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const GET = async (request) => {
    try {
        // 1. Security Check: Only logged-in users can request image decryptions
        const sessionUser = await getSessionUser();
        if (!sessionUser) return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(request.url);
        const rawPublicId = searchParams.get("publicId");
        const url = searchParams.get("url"); // Fallback if publicId isn't available
        const mimeType = searchParams.get("mimeType") || "image/jpeg";

        const publicId = (rawPublicId === "undefined" || rawPublicId === "null") ? null : rawPublicId;

        if (!publicId && !url) {
            return new NextResponse("Missing image reference", { status: 400 });
        }

        let fetchUrl = url;

        // 2. Since the file is "authenticated", we must generate a cryptographically signed URL 
        // to fetch it from Cloudinary servers into our Node server.
        if (publicId) {
            fetchUrl = cloudinary.url(publicId, {
                resource_type: 'raw',   // We uploaded it as a raw scrambled file
                type: 'authenticated',  // It is a private file
                sign_url: true,         // Sign it with our API Secret
                secure: true,
            });
        }

        // 3. Fetch the scrambled raw file from Cloudinary
        const response = await fetch(fetchUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image from storage: ${response.statusText}`);
        }

        // 4. Convert to Buffer
        const arrayBuffer = await response.arrayBuffer();
        const encryptedBuffer = Buffer.from(arrayBuffer);

        // 5. Decrypt the file back into an image (Zero-Knowledge)
        const decryptedBuffer = decryptBuffer(encryptedBuffer);

        // 6. Serve the decrypted image buffer directly to the browser
        return new NextResponse(decryptedBuffer, {
            status: 200,
            headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'private, max-age=3600', // Cache in the user's browser for 1 hour to save bandwidth
            },
        });

    } catch (error) {
        console.error("Failed to decrypt image:", error);
        return new NextResponse("Failed to load image", { status: 500 });
    }
};