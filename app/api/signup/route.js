// app/api/signup/route.js
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import User from "@/models/User";
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

    // 2. Hash password and create user in MongoDB (They are NOT logged in yet)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      // isPro: false (or however your schema defaults)
    });
    await newUser.save();

    // 3. IMMEDIATELY generate the Stripe Checkout Session
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
        trial_period_days: 14, // Force the free trial
      },
      customer_email: newUser.email, // Pre-fill their email in Stripe
      metadata: {
        userId: newUser._id.toString(), // Crucial for your webhook!
      },
      // 4. Redirect them to LOGIN upon success so they can officially create their session
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/login?trial_started=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/signup?canceled=true`,
    });

    // 5. Send the Stripe URL directly back to the frontend
    return NextResponse.json({ url: stripeSession.url }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};