import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/config/database";

export const getSessionUser = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (session && session.user) {
      return {
        user: session.user,
        userId: session.user.id,
      };
    }

    // Mobile App JWT fallback
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'fallback_secret');
        await connectDB();
        const user = await User.findById(decoded.userId);
        if (user) {
          return {
            user: {
              id: user._id.toString(),
              email: user.email,
              name: user.username,
              image: user.image,
              isPro: user.isPro,
              planType: user.planType,
            },
            userId: user._id.toString(),
          };
        }
      } catch (err) {
        console.error("JWT verification failed:", err);
      }
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
