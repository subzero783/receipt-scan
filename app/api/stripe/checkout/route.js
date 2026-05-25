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
        let stripeCustomerId = null;
        let isEligibleForTrial = true; // Default to true for new users

        // Detect if they are a pending Google user OR an official user
        if (session.user.isPending) {
            finalMetadata = { pendingUserId: session.user.id, isGoogleAuth: 'true' };
        } else {
            const user = await User.findOne({ email: session.user.email });
            if (!user) {
                return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
            }
            finalMetadata = { userId: user._id.toString() };
            stripeCustomerId = user.stripeCustomerId; // Grab their existing Stripe ID
            isEligibleForTrial = false; // Existing official users DO NOT get another free trial!
        }

        // Store from what page the user came from
        let comeFrom = "";
        const referer = request.headers.get('referer');

        if (referer) {
            comeFrom = referer;
        }

        const { searchParams } = new URL(request.url);
        const isNewGoogleUser = searchParams.get('isNewGoogleUser') === 'true';
        const interval = searchParams.get('interval') || 'monthly';

        var successUrl = isNewGoogleUser
            ? `${process.env.NEXT_PUBLIC_DOMAIN}/login?trial_started=true`
            : `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?success=true`;

        var cancelUrl = isNewGoogleUser
            ? `${process.env.NEXT_PUBLIC_DOMAIN}/signup?canceled=true`
            : `${process.env.NEXT_PUBLIC_DOMAIN}/pricing?canceled=true`;

        // If the user comes from the settings page, redirect them back to the settings page after subscription
        if (comeFrom.includes('/settings')) {
            successUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/settings?success=true`;
            cancelUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/settings?canceled=true`;
        }

        // If the user comes from the pricing page, redirect them to the dashboard page after subscription
        if (comeFrom.includes('/pricing')) {
            successUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?success=true`;
            cancelUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/pricing?canceled=true`;
        }

        const priceId = interval === 'yearly'
            ? (process.env.STRIPE_PRICE_ID_PRO_YEARLY)
            : (process.env.STRIPE_PRICE_ID_PRO);

        // 1. Build the base configuration
        const stripeConfig = {
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: finalMetadata,
            success_url: successUrl,
            cancel_url: cancelUrl,
        };

        // 2. Attach Trial ONLY if eligible
        if (isEligibleForTrial) {
            stripeConfig.subscription_data = { trial_period_days: 14 };
        }

        // 3. Attach Customer ID (Prevents duplicate customers in Stripe)
        if (stripeCustomerId) {
            stripeConfig.customer = stripeCustomerId;
        } else {
            stripeConfig.customer_email = targetEmail;
        }

        // 4. Create Stripe Session
        const stripeSession = await stripe.checkout.sessions.create(stripeConfig);

        return NextResponse.json({ url: stripeSession.url });

    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        const errorMessage = error.message && error.message.includes('No such price')
            ? `Stripe Price ID is invalid or does not exist: "${priceId}". Please create a yearly price in your Stripe dashboard and configure it as STRIPE_PRICE_ID_PRO_YEARLY in your .env files.`
            : (error.message || 'Internal Server Error');
        return new NextResponse(JSON.stringify({ message: errorMessage }), { status: 500 });
    }
};