import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User from '@/models/User';
import sendEmail from '@/utils/sendEmail';

export const GET = async (request) => {
    // Security check for Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        await connectDB();

        // Warning target: users whose trial will end in 1 day.
        // Free users have a 7-day trial. They should receive warning at day 6 (between 6 and 7 days old).
        const oneDayMs = 24 * 60 * 60 * 1000;
        const sixDaysAgo = new Date(Date.now() - 6 * oneDayMs);
        const sevenDaysAgo = new Date(Date.now() - 7 * oneDayMs);

        const usersToWarn = await User.find({
            isPro: false,
            createdAt: { $gt: sevenDaysAgo, $lte: sixDaysAgo },
            trialWarningSent: { $ne: true }
        });

        console.log(`Found ${usersToWarn.length} user(s) for trial warning notification.`);

        for (const user of usersToWarn) {
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Action Required: Your Receipt Scan free trial ends tomorrow!',
                    message: `Hi ${user.username},

This is a quick reminder that your Receipt Scan 7-day free trial will end tomorrow.

To ensure uninterrupted access to the following features, please upgrade to a Pro subscription:
- Uploading receipts (automatic and manual)
- Emailing selected receipts
- Generating invoices
- Exporting ZIP archives
- Exporting CSV spreadsheets
- Generating AI Insights

If you do not upgrade, these features will be locked.

Upgrade now: ${process.env.NEXT_PUBLIC_DOMAIN || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/pricing

Thank you,
The Receipt Scan Team`
                });

                user.trialWarningSent = true;
                await user.save();
                console.log(`Sent trial warning to ${user.email}`);
            } catch (err) {
                console.error(`Failed to send trial warning to ${user.email}:`, err);
            }
        }

        return NextResponse.json({ success: true, count: usersToWarn.length });

    } catch (error) {
        console.error('Trial Warning Cron Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};
