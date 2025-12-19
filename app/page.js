import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";

export default async function Home() {
  return (
    <div className="home-page">
      <HeroSection />
      <HowItWorks />
    </div>
  );
}
