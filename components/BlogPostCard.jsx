import Image from "next/image";
import Link from "next/link";

const BlogPostCard = ({ post }) => {
  console.log(post);
  const { _id, title, status, owner, is_featured, featured_image, excerpt, content, categories, author } = post;

  return (
    <div className="blog-post-card">
      <Link
        className="image-link"
        href={`/blog/${_id}`}
      >
        <Image
          src="/images/post-featured-image-placeholder.png"
          alt="Placeholder image"
          width={0}
          height={0}
        />
      </Link>
      <div className="text-container">
        <div className="categories-and-time">
          <div className="categories"></div>
          <div className="time"></div>
        </div>
        <h2 className="title">{title}</h2>
        <p className="excerpt">{excerpt}</p>
        <Link href={`/blog/${_id}`}>Read more</Link>
      </div>
    </div>
  );
};

export default BlogPostCard;
