import Link from "next/link";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { FaCameraRetro, FaChartPie } from "react-icons/fa";

const IphoneMockupFeaturesList = () => {
    return (
        <section className="iphone-mockup-with-features-list">
            <div className="container">
                <div className="top-text-container">
                    <div className="top-text">
                        <span className="small-title">Effortless Expense Tracking</span>
                        <h2 className="title">Digitize Your Receipts in Seconds</h2>
                        <p className="subtitle">Stop losing your write-offs to faded paper and messy shoeboxes. Receipt Scan's AI-powered upload interface makes capturing, reading, and categorizing your business expenses completely frictionless, no matter where your freelance work takes you.</p>
                    </div>
                </div>
                <div className="row features-row">
                    <div className="col">
                        <div className="feature-container">
                            <span className="icon-container"><FaCameraRetro /></span>
                            <h3>Instant AI Parsing</h3>
                            <p>Snap a quick photo and let our advanced AI instantly extract the merchant, date, total price, and taxes with zero manual data entry.</p>
                        </div>
                        <div className="feature-container">
                            <span className="icon-container"><MdOutlineMarkEmailRead /></span>
                            <h3>Drag, Drop, or Email</h3>
                            <p>Upload physical receipts from your camera roll, or forward your digital software invoices straight to your unique Receipt Scan email address.</p>
                        </div>
                    </div>
                    <div className="col iphone-mockup-column">
                        <div className="iphone-mockup">
                            <img src="https://res.cloudinary.com/dswzkrkcx/image/upload/v1780632167/iPhone_ReceiptScan.org_Upload_page_g9cbei.png" alt="Iphone mockup of the Upload page" />
                        </div>
                        <div className="buttons">
                            <Link href="/signup" className="btn btn-primary">Start Free Trial</Link>
                            <Link href="/features" className="btn btn-primary">View All Features</Link>
                        </div>
                    </div>
                    <div className="col">
                        <div className="feature-container">
                            <span className="icon-container"><FaChartPie /></span>
                            <h3>Smart Categorization</h3>
                            <p>Our predictive AI automatically sorts your uploads into standard tax categories, keeping your business and personal spending perfectly separated.</p>
                        </div>
                        <div className="feature-container">
                            <span className="icon-container"><IoCloudDownloadOutline /></span>
                            <h3>Cloud-Synced Security</h3>
                            <p>Every receipt you upload is instantly backed up with bank-level security and synced across all your devices so you are always audit-ready.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default IphoneMockupFeaturesList;