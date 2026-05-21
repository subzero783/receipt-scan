import connectDB from "@/config/database";
import BlogPost from "@/models/BlogPost";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import ShareButtons from "@/components/ShareButtons";
import AuthorBio from "@/components/AuthorBio";
import { sanitizeHtml } from "@/utils/sanitize";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function generateMetadata({ params }) {

  const { slug } = await params;
  await connectDB();

  // Fetch the specific blog post based on URL slug or Mongo ID fallback
  let post;
  if (slug.match(/^[0-9a-fA-F]{24}$/)) {
    post = await BlogPost.findById(slug);
  } else {
    post = await BlogPost.findOne({ slug });
  }

  // If the post doesn't exist, return a generic fallback
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Check draft status
  if (post.status === "Draft") {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.email === "contact@receiptscan.org" || session?.user?.role === "admin";
    if (!isAdmin) {
      return {
        title: 'Post Not Found',
      };
    }
  }

  // Return the metadata populated dynamically by the database
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.featured_image],
    },
  };
}

const SingleBlogPage = async ({ params }) => {
  const { slug } = await params;

  await connectDB();
  
  // Fetch the specific blog post based on URL slug or Mongo ID fallback
  let post;
  if (slug.match(/^[0-9a-fA-F]{24}$/)) {
    post = await BlogPost.findById(slug).lean();
  } else {
    post = await BlogPost.findOne({ slug }).lean();
  }

  if (!post) {
    return notFound();
  }

  if (post.status === "Draft") {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.email === "contact@receiptscan.org" || session?.user?.role === "admin";
    if (!isAdmin) {
      return notFound();
    }
  }

  // Convert mongoose document to plain object
  const formattedDate = new Date(post.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="blog-post-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">

          <div className="post-header-content">
            <Link href="/blog" className="back-link">
              <IoIosArrowBack /> All posts
            </Link>
            {post.categories && post.categories.length > 0 && (
              <div className="categories">
                {post.categories.map((category, index) => (
                  <span key={index} className="category-tag">
                    {category}
                  </span>
                ))}
              </div>
            )}

            <h1 className="title">{post.title}</h1>

            {/* Featured Image */}
            <div className="featured-image-container">
              <Image
                src={post.featured_image || "/images/post-featured-image-placeholder.png"}
                alt={post.title}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>

            <div className="meta-info">
              <div className="author-date">
                <p>Written by {post.author?.name || "Receipt AI Team"}</p>
                <span>Published on {formattedDate}</span>
              </div>
              <ShareButtons title={post.title} url={`${process.env.NEXTAUTH_URL || ''}/blog/${post.slug || post._id}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="content-container">
          <div className="container">

            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            />
          </div>

          <div className="container">
            <div className="post-footer">
              <div className="bottom-share-container">
                <div className="share-wrapper">
                  <ShareButtons title={post.title} url={`${process.env.NEXTAUTH_URL || ''}/blog/${post.slug || post._id}`} />
                </div>

                {post.categories && post.categories.length > 0 && (
                  <div className="bottom-tags">
                    {post.categories.map((category, index) => (
                      <span key={index} className="tag-pill">
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Author Bio */}
            <AuthorBio author={post.author || { name: "Receipt AI Team" }} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleBlogPage;
