import connectDB from "@/config/database";
import BlogPost from "@/models/BlogPost";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import ShareButtons from "@/components/ShareButtons";
import AuthorBio from "@/components/AuthorBio";

const SingleBlogPage = async ({ params }) => {
  const { id } = await params;

  await connectDB();
  const post = await BlogPost.findById(id).lean();

  if (!post) {
    return notFound();
  }

  // Convert mongoose document to plain object if needed, though .lean() does most of it
  // Ensure dates are strings for serialization if passed to client components, but here we render on server
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
          <Link href="/blog" className="back-link">
            <IoIosArrowBack /> All posts
          </Link>

          <div className="post-header-content">
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

            {/* Featured Image - using placeholder logic if standard image is missing */}
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
              <ShareButtons title={post.title} url={`${process.env.NEXTAUTH_URL || ''}/blog/${post._id}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container content-container">
          {/* <h2 className="introduction-header">Introduction</h2> */}
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="post-footer">
            {/* Conclusion Header if not in content */}
            {/* <h2 className="introduction-header">Conclusion</h2> */}
            {/* <p className="post-content">
              We hope this article has provided valuable insights into efficient expense tracking.
              Proper management of your finances is key to freelance success.
            </p> */}

            <div className="bottom-share-container">
              <div className="share-wrapper">
                <ShareButtons title={post.title} url={`${process.env.NEXTAUTH_URL || ''}/blog/${post._id}`} />
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

            {/* Author Bio */}
            <AuthorBio author={post.author || { name: "Receipt AI Team" }} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleBlogPage;
