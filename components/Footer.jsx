import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/company-logo.png";

const Footer = () => {
  return (
    <section className="footer">
      <div className="container">
        <div className="row">
          <div className="col links-columns">
            <div className="col">
              <Link href="/">
                <Image
                  src={logo}
                  alt=""
                />
              </Link>
            </div>
            <div className="col">
              <h3>Product</h3>
              <div className="links-container">
                <Link href="/features">Features</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/blog">Blog</Link>
              </div>
            </div>
            <div className="col">
              <h3>Company</h3>
              <div className="links-container">
                <Link href="/about-us">About Us</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>
            <div className="col">
              <h3>Legal</h3>
              <div className="links-container">
                <Link href="/terms">Terms</Link>
                <Link href="/privacy">Privacy</Link>
                <Link href="/cookies">Cookies</Link>
              </div>
            </div>
          </div>
          <div className="col">
            <h3>Subscribe</h3>
            {/* Email subscription signup Goes Here */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
