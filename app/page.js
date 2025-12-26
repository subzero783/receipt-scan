import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import siteData from '@/data/siteData.json';

export default async function Home() {

  const hero_section = siteData[1].home_page.hero_section;
  

  return (
    <div className="home-page">
      <HeroSection data={hero_section} />
      <HowItWorks />
      <Features />  
      <Testimonials />
    </div>
  );
}
