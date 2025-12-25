import siteData from "@/data/siteData.json";
import HeroSectionTwo from "@/components/HeroSectionTwo";
import PricingPlans from "@/components/PricingPlans";

const PricingPage = () => {
  const hero_section = siteData[4].pricing_page.hero_section;
  const pricing_plans = siteData[4].pricing_page.pricing_plans;

  return (
    <div className="pricing-page">
      <HeroSectionTwo data={hero_section} />
      <PricingPlans data={pricing_plans} />
    </div>
  );
};

export default PricingPage;
