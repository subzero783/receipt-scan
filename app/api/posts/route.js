import connectDB from "@/config/database";
import BlogPost from "@/models/BlogPost";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// Get all blog posts
export const GET = async (request) => {
  try {
    await connectDB();

    const page = request.nextUrl.searchParams.get("page") || 1;
    const pageSize = request.nextUrl.searchParams.get("pageSize") || 6;

    const skip = (page - 1) * pageSize;

    const total = await BlogPost.countDocuments({});
    const posts = await BlogPost.find({}).skip(skip).limit(pageSize);

    const result = {
      total,
      posts,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    return new Response("Something Went Wrong", { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    // 1. Verify User is logged in
    if (!sessionUser || !sessionUser.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Security Check: Restrict access to admin email OR admin role
    const isAdmin = sessionUser.user.email === "contact@receiptscan.org" || sessionUser.user.role === "admin";

    if (!isAdmin) {
      return new Response("Forbidden: You do not have permission to create posts", { status: 403 });
    }

    // 3. Extract data from the request
    const body = await request.json();

    // 4. Create the blog post in the database
    const newPost = new BlogPost({
      owner: sessionUser.userId,
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      author: body.author || { name: sessionUser.user.name, email: sessionUser.user.email, role: sessionUser.user.role || "Content Writer", bio: sessionUser.user.bio || "Passionate about helping freelancers and small businesses manage their expenses efficiently." },
      categories: body.categories || ['General'],
      featured_image: body.featured_image || '',
      is_featured: body.is_featured === true || body.is_featured === 'true' || body.is_featured === 'on',
    });

    await newPost.save();

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return new Response("Failed to create blog post", { status: 500 });
  }
};