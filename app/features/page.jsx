import siteData from "@/data/siteData.json";
import HeroSection from "@/components/HeroSection";

const FeaturesPage = () => {

  const featuresData = siteData.find(item => item.features_page)?.features_page;

  if (!featuresData) return <div>Loading...</div>;

  const hero_section = featuresData.hero_section;

  return (
    <div className="features_page">
      <HeroSection data={hero_section} />
    </div>
  )
};

export default FeaturesPage;
