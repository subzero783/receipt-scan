import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import siteData from '@/data/siteData.json';

export default async function Home() {

  const homeData = siteData.find(item => item.home_page)?.home_page;

  if (!homeData) return <div>Loading...</div>;

  const hero_section = homeData.hero_section;
  const how_it_works = homeData.how_it_works;
  const features = homeData.features;
  const testimonials = homeData.testimonials;

  return (
    <div className="home-page">
      <HeroSection data={hero_section} background_image={hero_section.background_image} />
      <HowItWorks data={how_it_works} />
      <Features data={features} />
      <Testimonials data={testimonials} />
    </div>
  );
}
