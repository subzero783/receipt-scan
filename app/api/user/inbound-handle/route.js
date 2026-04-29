import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import connectDB from '@/config/database';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return new Response('Unauthorized', { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return new Response('User not found', { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}