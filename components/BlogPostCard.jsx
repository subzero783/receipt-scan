import Image from "next/image";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";

const BlogPostCard = ({ post }) => {
  console.log(post);
  const { _id, title, status, owner, is_featured, featured_image, excerpt, content, categories, author } = post;
  const excerpt_length = 64;
  const read_more_text = excerpt.substring(0, 65) + "...";

  return (
    <div className="blog-post-card">
      <Link
        className="image-link"
        href={`/blog/${_id}`}
      >
        <div
          className="post-image"
          // style={{ backgroundImage: `url(/images${featured_image})` }}
          style={{ backgroundImage: `url(/images/post-featured-image-placeholder.png)` }}
          alt="Placeholder image"
        ></div>
      </Link>
      <div className="text-container">
        <div className="categories-and-time">
          <div className="categories"></div>
          <div className="time"></div>
        </div>
        <h2 className="title">{title}</h2>
        <p className="excerpt">{read_more_text}</p>
        <Link href={`/blog/${_id}`}>
          Read more <MdKeyboardArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default BlogPostCard;
