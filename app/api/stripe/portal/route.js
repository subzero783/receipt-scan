import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import User from '@/models/User';
import connectDB from '@/config/database';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new Response('Unauthorized', { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });

        if (!user || !user.stripeCustomerId) {
            return new Response('No Stripe customer associated with this user', { status: 400 });
        }

        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.NEXTAUTH_URL}/settings`,
        });

        return NextResponse.json({ url: stripeSession.url });

    } catch (error) {
        console.error('Stripe Portal Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
