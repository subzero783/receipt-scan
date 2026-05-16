import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import connectDB from '@/config/database';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';

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
        const metadata = session.metadata;

        await connectDB();

        // NEW: Check if this was a brand new user completing their first checkout
        if (metadata && metadata.pendingUserId) {
            const pendingUser = await PendingUser.findById(metadata.pendingUserId);

            if (pendingUser) {
                // 1. Check just in case the webhook fired twice or they already exist
                let realUser = await User.findOne({ email: pendingUser.email });

                if (!realUser) {
                    // 2. CREATE THE OFFICIAL USER! They are now allowed to log in.
                    realUser = new User({
                        username: pendingUser.username,
                        email: pendingUser.email,
                        password: pendingUser.password, // This is already securely hashed!
                        isPro: true, // Since they just started their trial/paid
                        stripeCustomerId: session.customer,
                        stripeSubscriptionId: session.subscription
                    });
                    await realUser.save();
                }

                // 3. Remove them from the Pending collection
                await PendingUser.findByIdAndDelete(metadata.pendingUserId);
            }
        }
    }

    // Handle cancellations (optional but recommended)
    if (event.type === 'customer.subscription.deleted') {
        const subscriptionId = event.data.object.id;
        await connectDB();
        await User.findOneAndUpdate({ subscriptionId }, { isPro: false, planType: 'free' });
    }

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
};