import { Schema, model, models } from "mongoose";

const BlogPostSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: String,
      },
    ],
    excerpt: {
      type: String,
      required: true,
    },
    author: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    featured_image: {
      type: String,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
    },
    status: {
      required: true,
      type: String,
      default: "Draft",
      enum: ["Draft", "Published"],
    },
  },
  {
    timestamps: true,
  }
);

const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);

export default BlogPost;
