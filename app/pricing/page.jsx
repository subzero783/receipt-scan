import siteData from "@/data/siteData.js";
import HeroSectionTwo from "@/components/HeroSectionTwo";
import PricingPlans from "@/components/PricingPlans";
import FAQs from "@/components/FAQs";
import CallToAction from "@/components/CallToAction";

const pricing_page = siteData.find(item => item.pricing_page)?.pricing_page;

export async function generateMetadata() {
  return {
    title: pricing_page?.meta_data?.title
      ? `${pricing_page.meta_data.title}`
      : "Receipt Scan - Expense Tracker for Freelancers",
    description: pricing_page?.meta_data?.description || "Automated expense tracking for freelancers and small businesses",
  };
}

const PricingPage = () => {

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
