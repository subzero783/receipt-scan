import User from "@/models/User";
import connectDB from "@/config/database";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  const { username, email, password, inboundHandle } = await request.json();

  await connectDB();

  const userExists = await User.findOne({ email });

  if (userExists) {
    return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
  }

  // Handle Generation Logic
  let baseHandle = inboundHandle || email.split('@')[0];
  // Sanitize: lowercase and remove non-alphanumeric characters
  baseHandle = baseHandle.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Fallback if sanitization leaves empty string
  if (!baseHandle) {
    baseHandle = `user${Math.floor(Math.random() * 10000)}`;
  }

  let finalHandle = baseHandle;
  let isUnique = false;
  let attempts = 0;

  // Try to find a unique handle
  while (!isUnique && attempts < 10) {
    const existing = await User.findOne({ inboundHandle: finalHandle });
    if (!existing) {
      isUnique = true;
    } else {
      attempts++;
      finalHandle = `${baseHandle}${Math.floor(Math.random() * 10000)}`;
    }
  }

  if (!isUnique) {
    return new Response(JSON.stringify({ message: "Unable to generate a unique handle. Please try again." }), { status: 500 });
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
