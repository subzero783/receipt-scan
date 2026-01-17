import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import connectDB from '@/config/database';
import User from '@/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const POST = async (req) => {
    const body = await req.text(); // Stripe requires raw body
    const sig = (await headers()).get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle specific events
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Retrieve the userId we passed in metadata during checkout
        const userId = session.metadata.userId;

        await connectDB();

        // Update User to PRO
        await User.findByIdAndUpdate(userId, {
            stripeCustomerId: session.customer,
            subscriptionId: session.subscription,
            isPro: true,
            planType: 'pro',
        });

        console.log(`User ${userId} upgraded to Pro`);
    }

    // Handle cancellations (optional but recommended)
    if (event.type === 'customer.subscription.deleted') {
        const subscriptionId = event.data.object.id;
        await connectDB();
        await User.findOneAndUpdate({ subscriptionId }, { isPro: false, planType: 'free' });
    }

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
};