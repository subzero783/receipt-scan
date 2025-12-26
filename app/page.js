import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import siteData from '@/data/siteData.json';

export default async function Home() {

  const hero_section = siteData[1].home_page.hero_section;
  const how_it_works = siteData[1].home_page.how_it_works;
  const features = siteData[1].home_page.features;
  const testimonials = siteData[1].home_page.testimonials;
  

  return (
    <div className="home-page">
      <HeroSection data={hero_section} />
      <HowItWorks data={how_it_works} />
      <Features data={features} />  
      <Testimonials data={testimonials} />
    </div>
  );
}
