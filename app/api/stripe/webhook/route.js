import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import connectDB from '@/config/database';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Generates a unique inbound handle based on the user's email.
 */
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

    // Fallback if 10 attempts fail
    if (!isUnique) finalHandle = `${baseHandle}${Date.now()}`;

    return finalHandle;
}

// ==========================================
// EVENT HANDLERS
// ==========================================

/**
 * Handles 'checkout.session.completed'
 * Upgrades a PendingUser to an official User and grants Pro access.
 */
async function handleCheckoutCompleted(session) {
    const metadata = session.metadata;

    if (!metadata || !metadata.pendingUserId) return;

    const pendingUser = await PendingUser.findById(metadata.pendingUserId);
    if (!pendingUser) return;

    // Check if the webhook fired twice or they already exist
    let realUser = await User.findOne({ email: pendingUser.email });

    if (!realUser) {
        let handleToUse = pendingUser.inboundHandle;

        if (!handleToUse) {
            handleToUse = await generateUniqueInboundHandle(pendingUser.email);
        }

        // Create the official user
        realUser = new User({
            username: pendingUser.username,
            email: pendingUser.email,
            password: pendingUser.password,
            image: pendingUser.image,
            inboundHandle: handleToUse,
            isPro: true,
            planType: 'pro',
            stripeCustomerId: session.customer,
            subscriptionId: session.subscription
        });

        await realUser.save();
    }

    // Clean up the Pending collection
    await PendingUser.findByIdAndDelete(metadata.pendingUserId);
}

/**
 * Handles 'customer.subscription.deleted' & 'canceled'
 * Revokes Pro access when a subscription ends.
 */
async function handleSubscriptionDowngrade(subscription) {
    const stripeCustomerId = subscription.customer;
    const userToDowngrade = await User.findOne({ stripeCustomerId: stripeCustomerId });

    if (userToDowngrade) {
        userToDowngrade.isPro = false;
        userToDowngrade.subscriptionId = null;

        await userToDowngrade.save();
        console.log(`User ${userToDowngrade.email} downgraded to Free.`);
    }
}

// ==========================================
// MAIN WEBHOOK ROUTER
// ==========================================

export const POST = async (req) => {
    const body = await req.text();
    const sig = (await headers()).get('stripe-signature');

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Signature Error: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Ensure database is connected before routing events
    try {
        await connectDB();
    } catch (dbError) {
        console.error(`Database Connection Error: ${dbError.message}`);
        return new NextResponse(`Internal Server Error`, { status: 500 });
    }

    // Route the event to the appropriate handler
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object);
                break;

            case 'customer.subscription.deleted':
            case 'customer.subscription.canceled':
                await handleSubscriptionDowngrade(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (handlerError) {
        console.error(`Error processing event ${event.type}:`, handlerError);
        // We still return 200 to Stripe so it doesn't infinitely retry a broken payload,
        // but the error is securely logged on your server.
    }

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
};