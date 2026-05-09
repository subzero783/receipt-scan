import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';

export const POST = async (request) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

        const user = await User.findById(sessionUser.userId);
        if (!user) return new NextResponse('User not found', { status: 404 });

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const lastResetDate = user.monthlyUsage?.invoices?.lastReset || new Date();
        
        // Reset if it's a new month
        if (lastResetDate.getMonth() !== currentMonth || lastResetDate.getFullYear() !== currentYear) {
            user.monthlyUsage = user.monthlyUsage || {};
            user.monthlyUsage.invoices = { count: 0, lastReset: new Date() };
        }

        // Limit Check
        if (user.planType === 'free' || !user.isPro) {
            if (user.monthlyUsage.invoices.count >= 2) {
                return new NextResponse(JSON.stringify({ message: 'Free plan limit reached. You can only generate 2 invoices per month. Please upgrade to Pro.' }), { status: 403 });
            }
        }

        // Increment usage count
        if (user.planType === 'free' || !user.isPro) {
            user.monthlyUsage.invoices.count += 1;
            await user.save();
        }

        return NextResponse.json({ success: true, count: user.monthlyUsage?.invoices?.count || 0 });

    } catch (error) {
        console.error('Invoice Track Error:', error);
        return new NextResponse('Server Error', { status: 500 });
    }
};
