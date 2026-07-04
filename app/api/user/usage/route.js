import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import connectDB from '@/config/database';
import User from '@/models/User';
import Receipt from '@/models/Receipt';

export async function GET(request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        // Fetch counts from the DB or fallback to monthlyUsage schema defaults
        let receiptCount = user.lifetimeReceipts || 0;
        if (receiptCount === 0) {
            receiptCount = await Receipt.countDocuments({ user: user._id });
        }

        const invoicesCount = user.monthlyUsage?.invoices?.count || 0;
        const csvDownloadsCount = user.monthlyUsage?.csvDownloads?.count || 0;
        const zipDownloadsCount = user.monthlyUsage?.zipDownloads?.count || 0;
        const emailsCount = user.monthlyUsage?.emails?.count || 0;

        return NextResponse.json({
            isPro: user.isPro || false,
            planType: user.planType || 'free',
            lifetimeReceipts: receiptCount,
            monthlyUsage: {
                invoices: invoicesCount,
                csvDownloads: csvDownloadsCount,
                zipDownloads: zipDownloadsCount,
                emails: emailsCount,
            }
        });
    } catch (error) {
        console.error('Error fetching usage metrics:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
