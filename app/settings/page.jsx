import siteData from '@/data/siteData.json';
import HeroSectionTwo from '@/components/HeroSectionTwo';
import AccountSettings from '@/components/AccountSettings';

const Settings = () => {

    const settingsData = siteData.find(item => item.settings_page)?.settings_page;

    if (!settingsData) return <div>Loading...</div>;

    const hero_section = settingsData.hero_section;

    return (
        <div className="settings-page">
            <HeroSectionTwo data={hero_section} />
            <AccountSettings />
        </div>
    );
};

export default Settings;
