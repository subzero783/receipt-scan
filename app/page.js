import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";

export default async function Home() {
  return (
    <div className="home-page">
      <HeroSection />
      <HowItWorks />
      <Features />  
    </div>
  );
}
