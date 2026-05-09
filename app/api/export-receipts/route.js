import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Receipt from '@/models/Receipt';
import { getSessionUser } from '@/utils/getSessionUser';
import User from '@/models/User';
import { generateCsv, generateZip } from '@/utils/exportHelpers';

export const POST = async (request) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

        const { ids, type = 'zip' } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return new NextResponse('No receipts selected', { status: 400 });
        }

        // Fetch receipts
        const receipts = await Receipt.find({
            _id: { $in: ids },
            user: sessionUser.userId
        });

        if (receipts.length === 0) {
            return new NextResponse('No receipts found', { status: 404 });
        }

        // Check user plan and limits
        const user = await User.findById(sessionUser.userId);
        if (!user) return new NextResponse('User not found', { status: 404 });

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const usageKey = type === 'csv' ? 'csvDownloads' : 'zipDownloads';
        const limitTypeLabel = type === 'csv' ? 'CSV' : 'ZIP folder';
        
        user.monthlyUsage = user.monthlyUsage || {};
        const lastResetDate = user.monthlyUsage[usageKey]?.lastReset || new Date();

        if (lastResetDate.getMonth() !== currentMonth || lastResetDate.getFullYear() !== currentYear) {
            user.monthlyUsage[usageKey] = { count: 0, lastReset: new Date() };
        }

        if (user.planType === 'free' || !user.isPro) {
            if (user.monthlyUsage[usageKey]?.count >= 2) {
                return new NextResponse(JSON.stringify({ message: `Free plan limit reached. You can only download 2 ${limitTypeLabel}s per month. Please upgrade to Pro.` }), { status: 403 });
            }
            
            // Increment count
            user.monthlyUsage[usageKey].count = (user.monthlyUsage[usageKey]?.count || 0) + 1;
            await user.save();
        }

        if (type === 'csv') {
            const csvString = generateCsv(receipts);

            return new NextResponse(csvString, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename="receipts.csv"'
                }
            });
        }

        const stream = await generateZip(receipts);

        // Return the stream
        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="receipts.zip"'
            }
        });

    } catch (error) {
        console.error('Export Error:', error);
        return new NextResponse('Server Error', { status: 500 });
    }
};
