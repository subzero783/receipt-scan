import siteData from "@/data/siteData.json";
import HeroSectionTwo from "@/components/HeroSectionTwo";
import PricingPlans from "@/components/PricingPlans";
import FAQs from "@/components/FAQs";
import CallToAction from "@/components/CallToAction";

const PricingPage = () => {
  const hero_section = siteData[4].pricing_page.hero_section;
  const pricing_plans = siteData[4].pricing_page.pricing_plans;
  const faqs = siteData[4].pricing_page.faqs;
  const cta = siteData[4].pricing_page.cta;

  return (
    <div className="pricing-page">
      <HeroSectionTwo data={hero_section} />
      <PricingPlans data={pricing_plans} />
      <FAQs data={faqs} />
      <CallToAction data={cta} />
    </div>
  );
};

export default PricingPage;
