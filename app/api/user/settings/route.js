import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import connectDB from '@/config/database';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return new Response('Unauthorized', { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email }).select('-password -resetPasswordToken -resetPasswordExpire');

        if (!user) {
            return new Response('User not found', { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { username, website, email, about, currentPassword, newPassword, language } = await request.json();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return new Response('User not found', { status: 404 });
        }

        // Handle password change
        if (newPassword) {
            if (user.password && !currentPassword) {
                return new Response('Current password required to set new password', { status: 400 });
            }
            if (user.password) {
                const isMatch = await bcrypt.compare(currentPassword, user.password);
                if (!isMatch) {
                    return new Response('Incorrect current password', { status: 400 });
                }
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
        }

        // Update fields
        user.username = username || user.username;
        if (website !== undefined) user.website = website;
        if (about !== undefined) user.about = about;
        if (language !== undefined) user.language = language;

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return new Response('Email already in use', { status: 400 });
            }
            user.email = email;
        }

        await user.save();

        return NextResponse.json({ message: 'User settings updated successfully' });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
