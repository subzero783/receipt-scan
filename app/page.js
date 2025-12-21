import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";

export default async function Home() {
  return (
    <div className="home-page">
      <HeroSection />
      <HowItWorks />
      <Features />  
      <Testimonials />
    </div>
  );
}
