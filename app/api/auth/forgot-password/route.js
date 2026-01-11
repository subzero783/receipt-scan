import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User from '@/models/User';
import sendEmail from '@/utils/sendEmail';
import crypto from 'crypto';

export const POST = async (request) => {
  try {
    await connectDB();
    // This line is not working properly
    const { email } = await request.json();

    const user = await User.findOne({ email });

    if (!user) {
      // Security best practice: Don't reveal if user exists or not
      // But for dev/MVP, returning 404 is okay if you prefer
      return new NextResponse(JSON.stringify({ message: 'If that email exists, a reset link has been sent.' }), { status: 200 });
    }

    if (!user.password) {
        return new NextResponse(JSON.stringify({ message: 'This account uses Google Sign In. Please login with Google.' }), { status: 400 });
    }

    // 1. Generate Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. Hash token and save to DB
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Expires in 10 minutes
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // 3. Create URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

    const message = `
      You have requested a password reset. 
      Please click the link below to reset your password: 
      \n\n ${resetUrl} \n\n
      This link expires in 10 minutes.
    `;

    // 4. Send via Resend
    try {
      await sendEmail({
        email: user.email,
        subject: 'Receipt AI - Password Reset Request',
        message,
      });

      return new NextResponse(JSON.stringify({ message: 'Email sent' }), { status: 200 });
    } catch (error) {
      // Rollback if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      
      return new NextResponse(JSON.stringify({ message: 'Email could not be sent' }), { status: 500 });
    }

  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
};