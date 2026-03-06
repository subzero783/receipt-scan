import siteData from "@/data/siteData.json";
import HeroSection from "@/components/HeroSection";
import CallToActionTwo from "@/components/CallToActionTwo";
import TwoColumns from "@/components/TwoColumns";

const FeaturesPage = () => {

  const featuresData = siteData.find(item => item.features_page)?.features_page;

  if (!featuresData) return <div>Loading...</div>;

  const hero_section = featuresData.hero_section;
  const extraction_description_section = featuresData.extraction_description_section;
  const upload_description_section = featuresData.upload_description_section;
  const personal_analyst_description_section = featuresData.personal_analyst_description_section;
  const tools_description_section = featuresData.tools_description_section;
  const cta = featuresData.cta;

  return (
    <div className="features_page">
      <HeroSection data={hero_section} />

      <TwoColumns data={extraction_description_section} text_direction="right" />

      <section className="upload-description-section"></section>
      <section className="personal-analyst-description-section"></section>
      <section className="tools-description-section"></section>
      <CallToActionTwo data={cta} />
    </div>
  )
};

export default FeaturesPage;
