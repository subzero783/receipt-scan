import HeroSectionThree from "@/components/HeroSectionThree";
import BlogPostsContainer from "@/components/BlogPostsContainer";
import siteData from '@/data/siteData.js';

const blog_indexData = siteData.find(item => item.blog_index)?.blog_index;

export async function generateMetadata() {
  return {
    title: blog_indexData?.meta_data?.title
      ? `${blog_indexData.meta_data.title}`
      : "Receipt Scan - Expense Tracker for Freelancers",
    description: blog_indexData?.meta_data?.description || "Automated expense tracking for freelancers and small businesses",
  };
}

const BlogIndexPage = () => {

  if (!blog_indexData) return <div>Loading...</div>;

  const hero_section = blog_indexData.hero_section;

  return (
    <section className="blog-index">
      <HeroSectionThree data={hero_section} />
      <BlogPostsContainer />
    </section>
  );
};

export default BlogIndexPage;
