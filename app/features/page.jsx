import siteData from "@/data/siteData.json";
import HeroSection from "@/components/HeroSection";
import CallToActionTwo from "@/components/CallToActionTwo";

const FeaturesPage = () => {

  const featuresData = siteData.find(item => item.features_page)?.features_page;

  if (!featuresData) return <div>Loading...</div>;

  const hero_section = featuresData.hero_section;
  const cta = featuresData.cta;

  return (
    <div className="features_page">
      <HeroSection data={hero_section} />

      <section className="extraction-description-section">
        <div className="container">
          <div className="row">
            <div className="col">

            </div>
            <div className="col">

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
