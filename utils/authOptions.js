import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser"; // <-- IMPORT PENDING USER
import connectDB from "@/config/database";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // Native Node.js module to generate random dummy passwords

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

        // IF THEY ARE A BRAND NEW GOOGLE USER:
        if (!userExists) {
          // Check if they are already in Pending (e.g., they abandoned checkout previously)
          let pendingUser = await PendingUser.findOne({ email: profile.email });

          if (!pendingUser) {
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

            // Because PendingUser requires a password, generate a secure random one for Google users
            const dummyPassword = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);

            // SAVE TO PENDING USER, NOT OFFICIAL USER
            await PendingUser.create({
              email: profile.email,
              username,
              image: profile.picture,
              password: dummyPassword,
              inboundHandle: finalHandle,
              authProvider: 'google'
            });
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