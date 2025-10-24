import { authOptions } from "@/utils/authOptions";
import NextAuth from "next-auth/next";

const { handler, signIn, signOut, auth } = NextAuth(authOptions);

export { signIn, signOut, auth };

export { handler as GET, handler as POST };
