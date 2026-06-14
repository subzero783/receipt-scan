import siteData from '@/data/siteData.js';
import HeroSection from "@/components/HeroSection";
import CallToActionTwo from '@/components/CallToActionTwo';
import SectionListImageRightSide from '@/components/SectionListImageRightSide';
import ToolsSection from '@/components/ToolsSection';
import TwoColumns from '@/components/TwoColumns';
import TestimonialsSectionTwo from '@/components/TestimonialsSectionTwo';
import IphoneMockupFeaturesList from '@/components/IphoneMockupFeaturesList';

const landingPageFreelance = siteData.find(item => item.landing_page_freelance)?.landing_page_freelance;

export async function generateMetadata() {
    return {
        title: landingPageFreelance?.meta_data?.title
            ? `${landingPageFreelance.meta_data.title}`
            : "Receipt Scan - AI Expense Tracker for Freelancers and Content Creators",
        description: landingPageFreelance?.meta_data?.description || "Automated expense tracking for freelancers and content creators",
    };
}

const Freelance = () => {

    const hero_section = landingPageFreelance?.hero_section;
    // const reality_section = landingPageFreelance?.reality_section;
    // const list_items = landingPageFreelance?.list_items;
    // const solutions_section = landingPageFreelance?.solutions_section;
    // const freedom_section = landingPageFreelance?.freedom_section;
    // const testimonials = landingPageFreelance?.testimonials;
    // const cta = landingPageFreelance?.cta;

    return (
        <div className="landing-pages lp-freelance">
            <HeroSection data={hero_section} />
            <IphoneMockupFeaturesList />
            {/* <CallToActionTwo data={reality_section} />
            <SectionListImageRightSide data={list_items} />
            <ToolsSection data={solutions_section} />
            <TwoColumns data={freedom_section} text_direction="left" background_color={"var(--color-third)"} bottom_border={false} small_title_margin={false} />
            <TestimonialsSectionTwo data={testimonials} />
            <CallToActionTwo data={cta} /> */}
        </div>
    );
};

export default Freelance;