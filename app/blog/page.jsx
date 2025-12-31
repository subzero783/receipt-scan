"use client";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import BlogPostCard from "@/components/BlogPostCard";
import Pagination from "@/components/Pagination";
import HeroSectionThree from "@/components/HeroSectionThree";

const BlogIndexPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const res = await fetch(`/api/posts?page=${page}&pageSize=${pageSize}`);

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setBlogPosts(data.posts);
        setTotalItems(data.total);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return loading ? (
    <Spinner />
  ) : (
    <section className="blog-index">
      <HeroSectionThree
        small_title="Blog"
        title="Insights and Tips"
        subtitle="Explore the latest trends in expense management."
      />
      <div className="container posts-container">
        <div className="row">
          <div className="col">
            {blogPosts === undefined ? (
              <p>No posts found</p>
            ) : blogPosts.length === 0 ? (
              <p>No posts found</p>
            ) : (
              <div>
                {blogPosts.map((blogPost) => (
                  <BlogPostCard
                    key={blogPost._id}
                    post={blogPost}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default BlogIndexPage;
