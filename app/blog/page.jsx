import HeroSectionThree from "@/components/HeroSectionThree";
import BlogPostsContainer from "@/components/BlogPostsContainer";
import siteData from '@/data/siteData.js';

const BlogIndexPage = () => {
  const blog_index = siteData.find(item => item.blog_index)?.blog_index;

  if (!blog_index) return <div>Loading...</div>;

  const hero_section = blog_index.hero_section;

  return (
    <section className="blog-index">
      <HeroSectionThree data={hero_section} />
      <BlogPostsContainer />
    </section>
  );
};

export default BlogIndexPage;
