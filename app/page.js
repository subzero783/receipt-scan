import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import siteData from '@/data/siteData.js';

const homeData = siteData.find(item => item.home_page)?.home_page;

export async function generateMetadata() {
  return {
    title: homeData?.meta_data?.title
      ? `${homeData.meta_data.title} | Receipt Scan`
      : "Receipt Scan - Expense Tracker for Freelancers",
    description: homeData?.meta_data?.description || "Automated expense tracking for freelancers and small businesses",
  };
}

export default async function Home() {

  if (!homeData) return <div>Loading...</div>;

  const hero_section = homeData.hero_section;
  const how_it_works = homeData.how_it_works;
  const features = homeData.features;
  const testimonials = homeData.testimonials;

  return (
    <div className="home-page">
      <HeroSection data={hero_section} />
      <HowItWorks data={how_it_works} />
      <Features data={features} />
      <Testimonials data={testimonials} />
    </div>
  );
}
