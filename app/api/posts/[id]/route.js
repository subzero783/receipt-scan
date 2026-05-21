import connectDB from "@/config/database";
import BlogPost from "@/models/BlogPost";
import { getSessionUser } from "@/utils/getSessionUser";
import { slugify } from "@/utils/slugify";

// GET /api/posts/:id
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const { id } = await params;

    const post = await BlogPost.findById(id);

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

// PUT /api/posts/:id
export const PUT = async (request, { params }) => {
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
      return new Response("Forbidden: You do not have permission to edit posts", { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    // 3. Find the existing post
    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      return new Response("Post not found", { status: 404 });
    }

    // 4. Update the post properties
    existingPost.title = body.title;
    existingPost.content = body.content;
    existingPost.excerpt = body.excerpt;
    existingPost.status = body.status || "Draft";
    existingPost.categories = body.categories || ['General'];
    existingPost.is_featured = body.is_featured === true || body.is_featured === 'true' || body.is_featured === 'on';

    // Update slug if slug is provided or if the title changes
    const newSlugBase = body.slug || (body.title !== existingPost.title ? slugify(body.title) : existingPost.slug || slugify(body.title));
    
    // Ensure slug uniqueness
    if (newSlugBase !== existingPost.slug) {
      let slug = newSlugBase;
      let counter = 1;
      while (await BlogPost.findOne({ slug, _id: { $ne: existingPost._id } })) {
        slug = `${newSlugBase}-${counter}`;
        counter++;
      }
      existingPost.slug = slug;
    } else if (!existingPost.slug) {
      // Generate slug for older posts that did not have one
      let slug = slugify(existingPost.title);
      let counter = 1;
      while (await BlogPost.findOne({ slug, _id: { $ne: existingPost._id } })) {
        slug = `${slug}-${counter}`;
        counter++;
      }
      existingPost.slug = slug;
    }

    if (body.featured_image !== undefined) {
      existingPost.featured_image = body.featured_image;
    }
    if (body.author) {
      existingPost.author = body.author;
    }

    await existingPost.save();

    return new Response(JSON.stringify(existingPost), { status: 200 });
  } catch (error) {
    console.error("Failed to update post:", error);
    return new Response("Failed to update blog post", { status: 500 });
  }
};

// DELETE /api/posts/:id
export const DELETE = async (request, { params }) => {
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
      return new Response("Forbidden: You do not have permission to delete posts", { status: 403 });
    }

    const { id } = await params;

    const post = await BlogPost.findById(id);
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    await post.deleteOne();

    return new Response("Post Deleted Successfully", { status: 200 });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return new Response("Failed to delete blog post", { status: 500 });
  }
};
