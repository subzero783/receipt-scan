import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
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

        let targetEmail = session.user.email;
        let finalMetadata = {};

        // Detect if they are an official user or a pending Google user
        if (session.user.isPending) {
            finalMetadata = { pendingUserId: session.user.id, isGoogleAuth: 'true' };
        } else {
            const user = await User.findOne({ email: session.user.email });
            if (!user) {
                return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
            }
            finalMetadata = { userId: user._id.toString() };
        }

        const { searchParams } = new URL(request.url);
        const isNewGoogleUser = searchParams.get('isNewGoogleUser') === 'true';

        // Set dynamic URLs based on where the user came from
        const successUrl = isNewGoogleUser
            ? `${process.env.NEXT_PUBLIC_DOMAIN}/login?trial_started=true`
            : `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?success=true`;

        const cancelUrl = isNewGoogleUser
            ? `${process.env.NEXT_PUBLIC_DOMAIN}/signup?canceled=true`
            : `${process.env.NEXT_PUBLIC_DOMAIN}/pricing?canceled=true`;

        // Create Stripe Session
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
            customer_email: targetEmail,
            metadata: finalMetadata,
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        return NextResponse.json({ url: stripeSession.url });

    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
};