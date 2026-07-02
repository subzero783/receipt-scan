// app/api/signup/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import sendEmail from "@/utils/sendEmail";

// Simple in-memory rate limit store
const rateLimitMap = new Map();

async function generateUniqueInboundHandle(email) {
  let baseHandle = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!baseHandle) baseHandle = `user${Math.floor(Math.random() * 10000)}`;

  let finalHandle = baseHandle;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    const existing = await User.findOne({ inboundHandle: finalHandle });
    if (!existing) {
      isUnique = true;
    } else {
      attempts++;
      finalHandle = `${baseHandle}${Math.floor(Math.random() * 10000)}`;
    }
  }

  if (!isUnique) finalHandle = `${baseHandle}${Date.now()}`;

  return finalHandle;
}

export const POST = async (request) => {
  try {
    // Basic IP Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    const limit = 5; // Max requests per window
    const windowMs = 60 * 1000; // 1 minute

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, timer: setTimeout(() => rateLimitMap.delete(ip), windowMs) });
    } else {
      const data = rateLimitMap.get(ip);
      if (data.count >= limit) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
      data.count++;
    }

    await connectDB();
    const { username, email, password } = await request.json();

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const inboundHandle = await generateUniqueInboundHandle(email);

    // 2. Directly create the official User
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      inboundHandle,
      isPro: false,
      planType: 'free'
    });
    await newUser.save();

    // 3. Send welcome/upgrade email
    try {
      await sendEmail({
        email: newUser.email,
        subject: 'Welcome to Receipt Scan - Start Your 7-Day Free Trial!',
        message: `Hi ${newUser.username},

Welcome to Receipt Scan! Your account has been successfully created.

You have 7 days of free access to all our features. After 7 days, you will need to add a credit card and upgrade to a Pro subscription to continue using the app, otherwise you will not be able to:
- Upload more receipts (automatic and manual)
- Email selected receipts
- Generate invoices
- Export ZIP archives
- Export CSV spreadsheets
- Generate AI Insights

Please upgrade to a Pro subscription to ensure uninterrupted access.

Upgrade here: ${process.env.NEXT_PUBLIC_DOMAIN || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/pricing

Thanks,
The Receipt Scan Team`
      });
    } catch (emailError) {
      console.error("Welcome email failed to send:", emailError);
    }

    return NextResponse.json({ success: true, message: "User registered successfully" }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    return new NextResponse('Server error', { status: 500 });
  }
};