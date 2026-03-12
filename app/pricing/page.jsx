import siteData from "@/data/siteData.json";
import HeroSectionTwo from "@/components/HeroSectionTwo";
import PricingPlans from "@/components/PricingPlans";
import FAQs from "@/components/FAQs";
import CallToAction from "@/components/CallToAction";

const PricingPage = () => {
  const pricing_page = siteData.find(item => item.pricing_page)?.pricing_page;

  if (!pricing_page) return <div>Loading...</div>;

  const hero_section = pricing_page.hero_section;
  const pricing_plans = pricing_page.pricing_plans;
  const faqs = siteData.find(item => item.faqs)?.faqs;
  const cta = pricing_page.cta;

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
