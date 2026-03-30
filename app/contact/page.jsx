import siteData from "@/data/siteData.js";
import HeroSectionThree from "@/components/HeroSectionThree";
import ContactForm from "@/components/ContactForm";

const ContactPage = () => {

    const contactData = siteData.find(item => item.contact_page)?.contact_page;

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