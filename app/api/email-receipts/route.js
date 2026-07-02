import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import connectDB from '@/config/database';
import Receipt from '@/models/Receipt';
import User from '@/models/User';
import { getSessionUser } from '@/utils/getSessionUser';
import { generateCsv, generateZip } from '@/utils/exportHelpers';
import { isTrialExpired } from '@/utils/userStatus';

const resend = new Resend(process.env.RESEND_API_KEY);

const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

export const POST = async (request) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user || !sessionUser.user.email) {
      return new NextResponse('Unauthorized or Email not found', { status: 401 });
    }

    const { ids, message, toEmail, includeZip, includeCsv } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new NextResponse('Invalid selection', { status: 400 });
    }

    // --- CHECK EMAIL LIMIT ---
    const user = await User.findById(sessionUser.userId);
    if (!user) return new NextResponse('User not found', { status: 404 });

    if (isTrialExpired(user)) {
        return new NextResponse(JSON.stringify({ message: 'Trial expired. Please upgrade to Pro to continue emailing receipts.' }), { status: 403 });
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastResetDate = user.monthlyUsage?.emails?.lastReset || new Date();
    
    // Reset if it's a new month
    if (lastResetDate.getMonth() !== currentMonth || lastResetDate.getFullYear() !== currentYear) {
        user.monthlyUsage = user.monthlyUsage || {};
        user.monthlyUsage.emails = { count: 0, lastReset: new Date() };
    }

    if (user.planType === 'free' || !user.isPro) {
        if (user.monthlyUsage.emails.count >= 5) {
            return new NextResponse(JSON.stringify({ message: 'Free plan limit reached. You can only send 5 emails per month. Please upgrade to Pro.' }), { status: 403 });
        }
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

    const messageHtml = message ? `<p style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; border-left: 4px solid #0070f3; margin-bottom: 20px;"><strong>Note:</strong> ${message.replace(/\n/g, '<br>')}</p>` : '';

    const emailHtml = `
      <h1>Your Selected Receipts</h1>
      ${messageHtml}
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

    // Prepare Attachments
    const attachments = [];

    if (includeCsv) {
      const csvString = generateCsv(receipts);
      attachments.push({
        filename: 'receipts.csv',
        content: Buffer.from(csvString)
      });
    }

    if (includeZip) {
      const zipStream = await generateZip(receipts);
      const zipBuffer = await streamToBuffer(zipStream);
      attachments.push({
        filename: 'receipts.zip',
        content: zipBuffer
      });
    }

    // Send Email
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: [toEmail || sessionUser.user.email],
      subject: `Your Selected Receipts Report - ${new Date().toLocaleDateString()}`,
      html: emailHtml,
      attachments: attachments.length > 0 ? attachments : undefined
    });

    // Update usage count
    if (user.planType === 'free' || !user.isPro) {
        user.monthlyUsage.emails.count += 1;
        await user.save();
    }

    return NextResponse.json({ message: 'Email sent successfully', data });

  } catch (error) {
    console.error('Email Error:', error);
    return new NextResponse('Failed to send email', { status: 500 });
  }
};
