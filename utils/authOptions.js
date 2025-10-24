// auth.js (in the root of your project)

import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/mongodb";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const client = await clientPromise;
        const db = client.db("hotelagency"); // Use your database name
        const usersCollection = db.collection("users");

        // Find user by email
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          return null;
        }

        // Check if the user has a password. If not, they signed up with an OAuth provider
        if (!user.password) {
          return null;
        }

        // Validate password
        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        // Return user object (must match standard User model)
        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          image: user.image,
          bookmarks: [],
        };
      },
    }),
  ],
  session: {
    strategy: "database", // Use 'database' strategy with an adapter
  },
  pages: {
    signIn: "/login", // Custom login page
  },
});
