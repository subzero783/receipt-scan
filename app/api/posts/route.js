import connectDB from "@/config/database";
import BlogPost from "@/models/BlogPost";
// import { getSessionUser } from "@/utils/getSessionUser";

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
