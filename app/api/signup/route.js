import User from "@/models/User";
import connectDB from "@/config/database";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  const { username, email, password } = await request.json();

  await connectDB();

  const userExists = await User.findOne({ email });

  if (userExists) {
    return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return new Response(JSON.stringify({ message: "User created successfully" }), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response({ error: error.message }, { status: 500 });
  }
};
