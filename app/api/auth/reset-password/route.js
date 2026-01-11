import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User from '@/models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const POST = async (request) => {
  try {
    await connectDB();
    const { password, token } = await request.json();

    // Re-create the hash from the raw token provided by the user
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with that valid token and ensure it hasn't expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'Invalid or expired token' }), { status: 400 });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return new NextResponse(JSON.stringify({ message: 'Password updated successfully' }), { status: 200 });

  } catch (error) {
    return new NextResponse(JSON.stringify({ message: error.message }), { status: 500 });
  }
};