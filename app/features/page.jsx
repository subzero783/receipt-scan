import siteData from "@/data/siteData.js";
import HeroSection from "@/components/HeroSection";
import CallToActionTwo from "@/components/CallToActionTwo";
import TwoColumns from "@/components/TwoColumns";
import ToolsSection from "@/components/ToolsSection";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { LuBrain } from "react-icons/lu";


const FeaturesPage = () => {

  const featuresData = siteData.find(item => item.features_page)?.features_page;

  if (!featuresData) return <div>Loading...</div>;

  const hero_section = featuresData.hero_section;
  const extraction_description_section = featuresData.extraction_description_section;
  const upload_description_section = featuresData.upload_description_section;
  const personal_analyst_description_section = featuresData.personal_analyst_description_section;
  const tools = featuresData.tools;
  const cta = featuresData.cta;

  return (
    <div className="features_page">
      <HeroSection data={hero_section} />

      <TwoColumns data={extraction_description_section} text_direction="left" icon={<IoDocumentTextOutline />} />

      <TwoColumns data={upload_description_section} text_direction="right" section_class="upload-description-section" icon={<FiUpload />} />

      <TwoColumns data={personal_analyst_description_section} text_direction="left" section_class="personal-analyst-description-section" icon={<LuBrain />} />

      <ToolsSection data={tools} />
      <CallToActionTwo data={cta} />
    </div>
  )
};

export default FeaturesPage;
