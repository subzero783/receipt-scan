import siteData from '@/data/siteData.json';

const Settings = () => {

    const settingsData = siteData.find(item => item.settings_page)?.settings_page;

    if (!settingsData) return <div>Loading...</div>;

    const hero_section = settingsData.hero_section;

    return (
        <div className="settings-page">
            <section className="settings-hero-section">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="top-text">
                                <span className="small-title">{hero_section.small_title}</span>
                                <h1 className="title">{hero_section.title}</h1>
                                <p className="subtitle">{hero_section.subtitle}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Settings;
