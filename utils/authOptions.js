import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser"; // <-- IMPORT PENDING USER
import connectDB from "@/config/database";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // Native Node.js module to generate random dummy passwords
import { cookies } from "next/headers";
import Stripe from "stripe";
import sendEmail from "@/utils/sendEmail";

export const authOptions = {
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        await connectDB();
        try {
          const user = await User.findOne({ email: credentials.email }).select("+password");
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordCorrect) return user;
          } else {
            // Did they already pay, but the webhook was delayed or missed?
            const pendingUser = await PendingUser.findOne({ email: credentials.email });
            if (pendingUser) {
              const isPasswordCorrect = await bcrypt.compare(credentials.password, pendingUser.password);
              if (isPasswordCorrect) {
                const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
                const customers = await stripe.customers.list({
                  email: credentials.email,
                  expand: ['data.subscriptions']
                });

                if (customers.data.length > 0) {
                  const customer = customers.data[0];
                  const activeSub = customer.subscriptions?.data.find(sub => sub.status === 'active' || sub.status === 'trialing');

                  if (activeSub) {
                    let handleToUse = pendingUser.inboundHandle;
                    if (!handleToUse) {
                      let baseHandle = pendingUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
                      if (!baseHandle) baseHandle = `user${Math.floor(Math.random() * 10000)}`;
                      let finalHandle = baseHandle;
                      let isUnique = false;
                      let attempts = 0;
                      while (!isUnique && attempts < 10) {
                        const existing = await User.findOne({ inboundHandle: finalHandle });
                        if (!existing) isUnique = true;
                        else {
                          attempts++;
                          finalHandle = `${baseHandle}${Math.floor(Math.random() * 10000)}`;
                        }
                      }
                      if (!isUnique) finalHandle = `${baseHandle}${Date.now()}`;
                      handleToUse = finalHandle;
                    }

                    // Upgrade them right now as a fallback
                    const realUser = new User({
                      username: pendingUser.username,
                      email: pendingUser.email,
                      password: pendingUser.password,
                      image: pendingUser.image,
                      inboundHandle: handleToUse,
                      isPro: true,
                      planType: activeSub.status === 'active' ? 'pro' : 'free',
                      stripeCustomerId: customer.id,
                      subscriptionId: activeSub.id
                    });
                    await realUser.save();
                    await PendingUser.findByIdAndDelete(pendingUser._id);
                    return realUser;
                  }
                }
              }
            }
          }
          return null;
        } catch (error) {
          console.error("Authorization error: ", error);
          throw new Error(error, "Authentication failed due to server error.");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: "consent", access_type: "offline", response_type: "code" } },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();

      if (account.provider === "google") {
        const userExists = await User.findOne({ email: profile.email });

        const cookieStore = await cookies();
        const authSource = cookieStore.get("auth_source")?.value;

        // IF THEY ARE A BRAND NEW GOOGLE USER:
        if (!userExists) {
          if (authSource === "login") {
            let pendingUser = await PendingUser.findOne({ email: profile.email });
            // Did they already pay, but the webhook was delayed or missed?
            if (pendingUser) {
              const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
              const customers = await stripe.customers.list({
                email: profile.email,
                expand: ['data.subscriptions']
              });

              if (customers.data.length > 0) {
                const customer = customers.data[0];
                const activeSub = customer.subscriptions?.data.find(sub => sub.status === 'active' || sub.status === 'trialing');

                if (activeSub) {
                  let handleToUse = pendingUser.inboundHandle;
                  if (!handleToUse) {
                    let baseHandle = pendingUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
                    if (!baseHandle) baseHandle = `user${Math.floor(Math.random() * 10000)}`;
                    let finalHandle = baseHandle;
                    let isUnique = false;
                    let attempts = 0;
                    while (!isUnique && attempts < 10) {
                      const existing = await User.findOne({ inboundHandle: finalHandle });
                      if (!existing) isUnique = true;
                      else {
                        attempts++;
                        finalHandle = `${baseHandle}${Math.floor(Math.random() * 10000)}`;
                      }
                    }
                    if (!isUnique) finalHandle = `${baseHandle}${Date.now()}`;
                    handleToUse = finalHandle;
                  }

                  // Upgrade them right now as a fallback
                  const realUser = new User({
                    username: pendingUser.username,
                    email: pendingUser.email,
                    password: pendingUser.password,
                    image: pendingUser.image,
                    inboundHandle: handleToUse,
                    isPro: true,
                    planType: activeSub.status === 'active' ? 'pro' : 'free',
                    stripeCustomerId: customer.id,
                    subscriptionId: activeSub.id
                  });
                  await realUser.save();
                  await PendingUser.findByIdAndDelete(pendingUser._id);
                  return true; // Successfully logged in!
                }
              }
            }
            return "/login?error=AccountNotFound";
          }

          // Otherwise, directly register them as a free user!
          const username = profile.name.slice(0, 20);

          // Handle Generation Logic
          let baseHandle = profile.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
          if (!baseHandle) baseHandle = `user${Math.floor(Math.random() * 10000)}`;

          let finalHandle = baseHandle;
          let isUnique = false;
          let attempts = 0;

          // Ensure unique handle against OFFICIAL users
          while (!isUnique && attempts < 10) {
            const existing = await User.findOne({ inboundHandle: finalHandle });
            if (!existing) isUnique = true;
            else {
              attempts++;
              finalHandle = `${baseHandle}${Math.floor(Math.random() * 10000)}`;
            }
          }
          if (!isUnique) finalHandle = `${baseHandle}${Date.now()}`;

          // Because PendingUser/User requires a password fallback
          const dummyPassword = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);

          // Create the official User
          const newUser = new User({
            username,
            email: profile.email,
            password: dummyPassword,
            image: profile.picture,
            inboundHandle: finalHandle,
            isPro: false,
            planType: 'free'
          });
          await newUser.save();

          // Send welcome/upgrade email
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
            console.error("Welcome email failed to send for Google user:", emailError);
          }
        }
      }
      return true;
    },

    async session({ session }) {
      await connectDB();

      // 1. Check official users first
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        session.user.id = user._id.toString();
        session.user.image = user.image || null;
        session.user.isPro = user.isPro || false;
        session.user.planType = user.planType || 'free';
        session.user.createdAt = user.createdAt ? user.createdAt.toISOString() : null;
      } else {
        // 2. If not official, check Pending Users (This allows the /welcome page to work!)
        const pendingUser = await PendingUser.findOne({ email: session.user.email });
        if (pendingUser) {
          session.user.id = pendingUser._id.toString();
          session.user.isPending = true; // Flag for the Stripe API Route
        }
      }
      return session;
    },
  },
};