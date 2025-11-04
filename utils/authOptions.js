import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import connectDB from "@/config/database";
import bcrypt from "bcryptjs";

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
            if (isPasswordCorrect) {
              return user;
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
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      await connectDB();

      if (account.provider === "google") {
        // --- LOGIC FOR GOOGLE (OAuth) ---
        // 'profile' and 'account' will be present
        const userExists = await User.findOne({ email: profile.email });
        if (!userExists) {
          const username = profile.name.slice(0, 20);
          await User.create({
            email: profile.email,
            username,
            image: profile.picture,
          });
        }
      }
      // Credentials Provider successfully authenticated in the 'authorize' function.
      // 'user' will be present, and we just return true to allow sign in.
      return true;
    },

    async session({ session }) {
      // 1. Get user from database
      const user = await User.findOne({ email: session.user.email });
      // 2. Assign the user id to the session
      session.user.id = user._id.toString();
      // 3. return session
      return session;
    },
  },
};
