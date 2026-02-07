import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import connectDB from '@/config/database';
import Receipt from '@/models/Receipt';
import { getSessionUser } from '@/utils/getSessionUser';
import User from '@/models/User';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (request) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();

        if (!sessionUser || !sessionUser.user || !sessionUser.user.email) {
            return new NextResponse('Unauthorized or Email not found', { status: 401 });
        }

        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return new NextResponse('Invalid selection', { status: 400 });
        }

        // Fetch receipts ensuring they belong to the user
        const receipts = await Receipt.find({
            _id: { $in: ids },
            user: sessionUser.userId
        });

        if (receipts.length === 0) {
            return new NextResponse('No receipts found', { status: 404 });
        }

        // Generate HTML Table
        const tableRows = receipts.map(r => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date(r.transactionDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${r.merchantName}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${r.category}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${r.totalAmount.toFixed(2)}</td>
      </tr>
    `).join('');

        const totalSum = receipts.reduce((acc, r) => acc + r.totalAmount, 0).toFixed(2);

        const emailHtml = `
      <h1>Your Selected Receipts</h1>
      <p>Here are the details for the ${receipts.length} receipt(s) you selected.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Date</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Merchant</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Category</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
        <tfoot>
            <tr style="font-weight: bold; background-color: #f9f9f9;">
                <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">$${totalSum}</td>
            </tr>
        </tfoot>
      </table>
      
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a>
      </p>
    `;

        // Send Email
        const data = await resend.emails.send({
            from: 'Receipt Scan <noreply@receiptscan.app>', // Update this if you have a verified domain
            to: [sessionUser.user.email],
            subject: `Your Selected Receipts Report - ${new Date().toLocaleDateString()}`,
            html: emailHtml,
        });

        return NextResponse.json({ message: 'Email sent successfully', data });

    } catch (error) {
        console.error('Email Error:', error);
        return new NextResponse('Failed to send email', { status: 500 });
    }
};
