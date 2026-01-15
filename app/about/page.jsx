import siteData from '@/data/siteData.json';
import HeroSectionThree from '@/components/HeroSectionThree';

const AboutPage = () => {
    const about_page = siteData[10].about_page;
    const hero_section = about_page.hero_section;

    return(
        <div className="about-page">
            <HeroSectionThree data={hero_section} />
        </div>
    )
}

export default AboutPage;