import siteData from "@/data/siteData.js";
import HeroSectionThree from "@/components/HeroSectionThree";
import ContactForm from "@/components/ContactForm";

const contactData = siteData.find(item => item.contact_page)?.contact_page;

export async function generateMetadata() {
    return {
        title: contactData?.meta_data?.title
            ? `${contactData.meta_data.title}`
            : "Receipt Scan - Expense Tracker for Freelancers",
        description: contactData?.meta_data?.description || "Automated expense tracking for freelancers and small businesses",
    };
}

const ContactPage = () => {

    if (!contactData) return <div>Loading...</div>;

    const { hero_section } = contactData;

    return (
        <div className="contact-page">
            <HeroSectionThree data={hero_section} />
            <ContactForm />
        </div>
    );
};

export default ContactPage;