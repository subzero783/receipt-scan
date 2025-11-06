import User from "@/models/User";
import connectDB from "@/config/database";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { username, email, password } = await request.json();

  await connectDB();

  const userExists = await User.findOne({ email });

  if (userExists) {
    return new NextResponse({ message: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return new NextResponse({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
};
