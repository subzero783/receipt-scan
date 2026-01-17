import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions'; // Ensure path is correct
import connectDB from '@/config/database';
import User from '@/models/User';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (request) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        // Create Stripe Session
        const stripeSession = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID_PRO, // From your .env
                    quantity: 1,
                },
            ],
            customer_email: user.email, // Pre-fill user email
            metadata: {
                userId: user._id.toString(), // Important: Pass DB ID to Webhook
            },
            success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/pricing?canceled=true`,
        });

        return NextResponse.json({ url: stripeSession.url });

    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
};