import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Receipt from '@/models/Receipt';
import { getSessionUser } from '@/utils/getSessionUser';

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

        // Get Receipts
        const receipts = await Receipt.find({ user: sessionUser.userId })
            .sort({ transactionDate: -1 }) // Newest first
            .skip(skip)
            .limit(limit);

        // Get Total Count (for pagination)
        const total = await Receipt.countDocuments({ user: sessionUser.userId });

        return NextResponse.json({
            receipts,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });

    } catch (error) {
        console.error('Fetch Error:', error);
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

// DELETE: Remove a receipt
export const DELETE = async (request) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        const { id } = await request.json();

        await Receipt.findByIdAndDelete(id);
        return new NextResponse('Deleted', { status: 200 });
    } catch (error) {
        return new NextResponse('Error', { status: 500 });
    }
};