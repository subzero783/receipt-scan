import siteData from '@/data/siteData.json';
import { FaHandSparkles, FaShieldAlt, FaHeart } from 'react-icons/fa'; 
import HeroSectionFour from '@/components/HeroSectionFour';
import StorySection from '@/components/StorySection';

const AboutPage = () => {
    const aboutData = siteData.find(item => item.about_page)?.about_page;
  
    if (!aboutData) return <div>Loading...</div>;

    const hero_section = aboutData.hero_section;
    const story_section = aboutData.story_section;
    const values_section = aboutData.core_values;

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'sparkles': return <FaHandSparkles size={24} color="#4F46E5" />;
            case 'shield': return <FaShieldAlt size={24} color="#4F46E5" />;
            case 'heart': return <FaHeart size={24} color="#4F46E5" />;
            default: return null;
        }
    };

    return(
        <div className="about-page">
            <HeroSectionFour data={hero_section} />
            {/* ==================== 
                SECTION 2: story_section 
            ==================== */}
            <StorySection data={story_section}/>
            {/* ==================== 
                SECTION 3: VALUES 
            ==================== */}
            <section className="about-values-section">
                <div className="container">
                
                    <div className="about-values-header">
                        <span className="about-small-title">{values_section.small_title}</span>
                        <h2 className="about-section-title">{values_section.title}</h2>
                        <p className="about-subtitle">{values_section.subtitle}</p>
                    </div>

                    <div className="about-values-grid">
                        {values_section.values.map((value, index) => (
                            <div key={index} className="about-value-card">
                                <div className="about-icon-circle">
                                    {getIcon(value.icon)}
                                </div>
                                <h3 className="about-card-title">{value.title}</h3>
                                <p className="about-card-desc">{value.description}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </div>
    );
}

export default AboutPage;