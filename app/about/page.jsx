import siteData from '@/data/siteData.json';
import HeroSectionFour from '@/components/HeroSectionFour';
import StorySection from '@/components/StorySection';
import OurValuesSection from '@/components/OurValuesSection';

const AboutPage = () => {
    const aboutData = siteData.find(item => item.about_page)?.about_page;

    if (!aboutData) return <div>Loading...</div>;

    const hero_section = aboutData.hero_section;
    const story_section = aboutData.story_section;
    const values_section = aboutData.core_values;

    return (
        <div className="about-page">
            <HeroSectionFour data={hero_section} />
            {/* ==================== 
                SECTION 2: story_section 
            ==================== */}
            <StorySection data={story_section} />
            {/* ==================== 
                SECTION 3: VALUES 
            ==================== */}
            <OurValuesSection data={values_section} />
        </div>
    );
}

export default AboutPage;