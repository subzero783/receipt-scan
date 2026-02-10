import User from "@/models/User";
import connectDB from "@/config/database";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  const { username, email, password, inboundHandle } = await request.json();

  const handle = email.split('@')[0];

  await connectDB();

  const userExists = await User.findOne({ email });
  // Check if handle exists, if so, append random number
  const existingHandle = await User.findOne({ inboundHandle: handle });
  const finalHandle = existingHandle ? `${handle}${Math.floor(Math.random() * 1000)}` : handle;

  if (userExists) {
    return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    inboundHandle: finalHandle
  });

  try {
    await newUser.save();
    return new Response(JSON.stringify({ message: "User created successfully" }), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
