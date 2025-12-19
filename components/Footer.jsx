import Image from "next/image";
import Link from "next/link";
import SocialMedia from "@/components/SocialMedia";
import logo from "@/assets/images/company-logo.png";

const Footer = () => {
  return (
    <section className="footer">
      <div className="container top-footer">
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
          <div className="col subscribe-column">
            <h3>Subscribe</h3>
            <p>Stay updated with our latest features and product improvements</p>
            {/* Email subscription signup Goes Here */}
          </div>
        </div>
      </div>
      <div className="container bottom-container">
        <div className="row">
          <div className="col copyright-column">
            <p>&#169; 2024 Receipt AI Manager. All rights reserved</p>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
          <div className="col social-media-column">
            <SocialMedia />
          </div>
          <div className="col">
            <h3>Product</h3>
          </div>
          <div className="col">
            <h3>Company</h3>
          </div>
          <div className="col">
            <h3>Legal</h3>
          </div>
          <div className="col">
            <h3>Subscribe</h3>
            <p className="subtitle"></p>
            {/* Email Sign Up Goes Here */}
          </div>
        </div>
      </div>
      <div className="container bottom-footer">
        <div className="row">
          <div className="privacy-policy-col col"></div>
          <div className="social-media-col col"></div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
