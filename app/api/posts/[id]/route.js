import connectDB from "@/config/database";
import BlogPost from "@/models/BlogPost";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/properties/:id
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const post = await BlogPost.findById(params.id);

    if (!post) {
      return new Response("Post Not Found", { status: 404 });
    }

    return new Response(JSON.stringify(post), {
      status: 200,
    });
  } catch (error) {
    return new Response("Something Went Wrong", { status: 500 });
  }
};
