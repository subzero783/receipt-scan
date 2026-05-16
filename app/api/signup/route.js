// app/api/signup/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";
import bcrypt from "bcryptjs"; // assuming you use bcryptjs based on standard NextAuth setups
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (request) => {
  try {
    await connectDB();
    const { username, email, password } = await request.json();

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Save them to PendingUser (If they tried before and canceled, just update their pending record)
    let pendingUser = await PendingUser.findOne({ email });
    if (pendingUser) {
      pendingUser.username = username;
      pendingUser.password = hashedPassword;
      await pendingUser.save();
    } else {
      pendingUser = new PendingUser({
        username,
        email,
        password: hashedPassword,
      });
      await pendingUser.save();
    }

    // 3. Generate the Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_PRO,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14,
      },
      customer_email: pendingUser.email,
      metadata: {
        // PASS THE PENDING ID SO THE WEBHOOK CAN FIND THEM LATER
        pendingUserId: pendingUser._id.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/login?trial_started=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/signup?canceled=true`,
    });

    return NextResponse.json({ url: stripeSession.url }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};