import { FaRegEnvelope } from "react-icons/fa";
import Link from "next/link";
import siteData from "@/data/siteData.json";
import AweberSubscribeFormOne from '@/components/AweberSubscribeFormOne';

const ContactForm = () => {

    const contactInfo = siteData.find(item => item.contact_info)?.contact_info;

    const { email } = contactInfo;

    return (
        <section className="contact-form">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <AweberSubscribeFormOne />
                    </div>
                    <div className="col">
                        <div className="contact-info">
                            <div className="icon-wrapper">
                                <FaRegEnvelope />
                            </div>
                            <div className="text-wrapper">
                                <h2>Email</h2>
                                <Link href={`mailto:${email}`}>{email}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;