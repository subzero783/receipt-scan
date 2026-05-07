// app/api/upload-blog-image/route.js
import { v2 as cloudinary } from 'cloudinary';
import { getSessionUser } from "@/utils/getSessionUser";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (request) => {
    try {
        // Security Check: Only allow admins to upload blog images
        const sessionUser = await getSessionUser();
        const isAdmin = sessionUser?.user?.email === "contact@receiptscan.org" || sessionUser?.user?.role === "admin";

        if (!isAdmin) {
            return new Response("Unauthorized to upload blog images", { status: 401 });
        }

        // Extract the file from the FormData
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return new Response("No file provided", { status: 400 });
        }

        // Convert the File object to a Base64 string for Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        const fileUri = `data:${file.type};base64,${base64Data}`;

        // Upload to Cloudinary into the specific folder
        const uploadResult = await cloudinary.uploader.upload(fileUri, {
            folder: "receipt-scan-app/blog-posts-images",
            // Blog images should be public so readers can see them
            type: "upload",
        });

        // Return the secure URL to the frontend
        return new Response(JSON.stringify({ secure_url: uploadResult.secure_url }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Blog image upload failed:", error);
        return new Response("Failed to upload image", { status: 500 });
    }
};