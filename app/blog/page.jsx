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
  const [pageSize, setPageSize] = useState(6);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const res = await fetch(`/api/posts?page=${page}&pageSize=${pageSize}`);

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setBlogPosts(data.posts);
        setTotalPosts(data.total);
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

  // Helper function to split the array into chunks of 2
  const chunkPosts = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
  };

  const blogPostRows = chunkPosts(blogPosts, 2);

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
        {blogPosts.length === 0 ? (
          <p>No posts found</p>
        ) : (
          // Map through each "row" chunk
          blogPostRows.map((row, index) => (
            <div
              className="row"
              key={`row-${index}`}
            >
              {row.map((blogPost) => (
                <div
                  className="col"
                  key={blogPost._id}
                >
                  <BlogPostCard post={blogPost} />
                </div>
              ))}
            </div>
          ))
        )}
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalPosts}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default BlogIndexPage;
