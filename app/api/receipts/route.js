import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Receipt from '@/models/Receipt';
import { getSessionUser } from '@/utils/getSessionUser';
import User from '@/models/User';
import { v2 as cloudinary } from 'cloudinary';

// Config Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch paginated receipts
export const GET = async (request) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        // Extract Filters
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const merchant = searchParams.get('merchant');
        const category = searchParams.get('category');
        const minTotal = searchParams.get('minTotal');
        const maxTotal = searchParams.get('maxTotal');

        // Build Query
        const query = { user: sessionUser.userId };

        if (merchant) {
            query.merchantName = { $regex: merchant, $options: 'i' };
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        if (startDate || endDate) {
            query.transactionDate = {};
            if (startDate) query.transactionDate.$gte = new Date(startDate);
            if (endDate) query.transactionDate.$lte = new Date(endDate);
        }

        if (minTotal || maxTotal) {
            query.totalAmount = {};
            if (minTotal) query.totalAmount.$gte = Number(minTotal);
            if (maxTotal) query.totalAmount.$lte = Number(maxTotal);
        }

        // Get Receipts
        const receipts = await Receipt.find(query)
            .sort({ transactionDate: -1 }) // Newest first
            .skip(skip)
            .limit(limit);

        // Get Total Count (for pagination - filtered)
        const total = await Receipt.countDocuments(query);

        // Get User Status & Total Usage (Unfiltered for Limit Check)
        const user = await User.findById(sessionUser.userId);
        const totalReceipts = await Receipt.countDocuments({ user: sessionUser.userId });

        return NextResponse.json({
            receipts,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalReceipts,
            isPro: user ? user.isPro : false
        });

    } catch (error) {
        console.error('Fetch Error:', error);
        return new NextResponse('Server Error', { status: 500 });
    }
};
// POST: Create a new receipt manually
export const POST = async (request) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

        const data = await request.json();

        // Limit Check
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

        // Validate required fields
        if (!data.merchantName || data.totalAmount === undefined || data.totalAmount === '') {
            return new NextResponse('Merchant name and total amount are required', { status: 400 });
        }

        const newReceipt = await Receipt.create({
            user: sessionUser.userId,
            merchantName: data.merchantName,
            totalAmount: data.totalAmount,
            transactionDate: data.transactionDate || new Date(),
            category: data.category || 'Other',
            imageUrl: data.imageUrl || null, // Optional
            isProcessed: true
        });

        // Increment lifetime receipts
        user.lifetimeReceipts = (user.lifetimeReceipts || 0) + 1;
        await user.save();

        return NextResponse.json(newReceipt, { status: 201 });

    } catch (error) {
        console.error('Create Receipt Error:', error);
        return new NextResponse('Server Error', { status: 500 });
    }
};

// PUT: Update a specific receipt
export const PUT = async (request) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

        const { id, ...data } = await request.json();

        const receipt = await Receipt.findById(id);

        if (!receipt) return new NextResponse('Receipt not found', { status: 404 });
        if (receipt.user.toString() !== sessionUser.userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Update fields
        const updatedReceipt = await Receipt.findByIdAndUpdate(
            id,
            {
                merchantName: data.merchantName,
                totalAmount: data.totalAmount,
                transactionDate: data.transactionDate,
                category: data.category
            },
            { new: true }
        );

        return NextResponse.json(updatedReceipt);

    } catch (error) {
        console.error('Update Error:', error);
        return new NextResponse('Server Error', { status: 500 });
    }
};

// DELETE: Remove receipts (Single or Batch)
export const DELETE = async (request) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

        const { ids } = await request.json(); // Expects { ids: [id1, id2] }

        if (!ids || !Array.isArray(ids)) {
            return new NextResponse('Invalid data format', { status: 400 });
        }

        // 1. Find receipts to delete (to get publicIds)
        const receiptsToDelete = await Receipt.find({
            _id: { $in: ids },
            user: sessionUser.userId
        });

        if (receiptsToDelete.length === 0) {
            return new NextResponse('No receipts found to delete', { status: 404 });
        }

        const cloudinaryPromises = receiptsToDelete
            .filter(r => r.publicId) // Only process receipts that have an image attached
            .map(r => cloudinary.uploader.destroy(r.publicId, { resource_type: 'raw' }));

        await Promise.all(cloudinaryPromises);

        // 3. Delete from MongoDB
        await Receipt.deleteMany({
            _id: { $in: ids },
            user: sessionUser.userId
        });

        return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('Delete Error:', error);
        return new NextResponse('Server Error', { status: 500 });
    }
};