import siteData from '@/data/siteData.js';
import HeroSection from "@/components/HeroSection";
import CallToActionTwo from '@/components/CallToActionTwo';
import SectionListImageRightSide from '@/components/SectionListImageRightSide';
import ToolsSection from '@/components/ToolsSection';
import TwoColumns from '@/components/TwoColumns';
import TestimonialsSectionTwo from '@/components/TestimonialsSectionTwo';

const landingPagePhotographers = siteData.find(item => item.landing_page_photographers)?.landing_page_photographers;

export async function generateMetadata() {
    return {
        title: landingPagePhotographers?.meta_data?.title
            ? `${landingPagePhotographers.meta_data.title}`
            : "Receipt Scan - AI Expense Tracker for Photographers",
        description: landingPagePhotographers?.meta_data?.description || "Automated expense tracking for freelancers and small businesses",
    };
}

const Photographers = () => {

    const hero_section = landingPagePhotographers?.hero_section;
    const reality_section = landingPagePhotographers?.reality_section;
    const list_items = landingPagePhotographers?.list_items;
    const solutions_section = landingPagePhotographers?.solutions_section;
    const freedom_section = landingPagePhotographers?.freedom_section;
    const testimonials = landingPagePhotographers?.testimonials;
    const cta = landingPagePhotographers?.cta;

    return (
        <div className="landing-pages lp-photographers">
            <HeroSection data={hero_section} />
            <CallToActionTwo data={reality_section} />
            <SectionListImageRightSide data={list_items} />
            <ToolsSection data={solutions_section} />
            <TwoColumns data={freedom_section} text_direction="left" background_color={"var(--color-third)"} bottom_border={false} small_title_margin={false} />
            <TestimonialsSectionTwo data={testimonials} />
            <CallToActionTwo data={cta} />
        </div>
    );
};

export default Photographers;