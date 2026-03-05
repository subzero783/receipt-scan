import siteData from "@/data/siteData.json";
import HeroSection from "@/components/HeroSection";
import CallToActionTwo from "@/components/CallToActionTwo";
import Image from "next/image";

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

      <section className="extraction-description-section">
        <div className="container">
          <div className="row">
            <div className="col left-column">
              <div className="content">
                <h2 className="title">{extraction_description_section.title}</h2>
                <p className="description">{extraction_description_section.subtitle}</p>
              </div>
            </div>
            <div className="col right-column">
              <div className="image-wrapper">
                <Image width={0} height={0} src={extraction_description_section.image} alt={extraction_description_section.image_alt} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="upload-description-section"></section>
      <section className="personal-analyst-description-section"></section>
      <section className="tools-description-section"></section>
      <CallToActionTwo data={cta} />
    </div>
  )
};

export default FeaturesPage;
