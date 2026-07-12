import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const POST = async (request) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new NextResponse(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    await connectDB();

    let user = await User.findOne({ email }).select('+password');
    if (!user) {
      user = await PendingUser.findOne({ email });
      if (!user) {
        return new NextResponse(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new NextResponse(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.username,
        email: user.email,
        image: user.image,
        isPro: user.isPro,
        planType: user.planType,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Mobile login error:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
};
