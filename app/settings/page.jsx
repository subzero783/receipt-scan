'use client';

import siteData from '@/data/siteData.json';
import HeroSectionTwo from '@/components/HeroSectionTwo';
import AccountSettings from '@/components/AccountSettings';
// import ManageSubscription from '@/components/ManageSubscription';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Settings = () => {

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    const settingsData = siteData.find(item => item.settings_page)?.settings_page;
    // const manageSubscriptionData = settingsData.manage_subscription;

    if (!settingsData) return <div>Loading...</div>;

    const hero_section = settingsData.hero_section;

    return (
        <div className="settings-page">
            <HeroSectionTwo data={hero_section} />
            <AccountSettings />
            {/* <ManageSubscription data={manageSubscriptionData} /> */}
        </div>
    );
};

export default Settings;
