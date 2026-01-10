"use client";
import Link from "next/link";
import SocialMedia from "@/components/SocialMedia";
import LogoLinkImage from "./LogoLinkImage";
import { useSession } from "next-auth/react";
import siteData from "@/data/siteData.json";

const Footer = () => {

  const { data: session } = useSession();

  return (
    <section className="footer">
      <div className="container top-footer">
        <div className="row">
          <div className="col links-columns">
            <div className="col">
              <LogoLinkImage />
            </div>
            {siteData[3].footer_menu.map((item, index) => (
              <div
                className="col"
                key={index}
              >
                <h3>{item.menu_name}</h3>
                <div className="links-container">
                  {item.menu_items.map((item, index) => {

                    // LOGIC 1: If item requires auth, but user is NOT logged in -> Hide it
                    if (item.auth_required && !session) {
                      return null;
                    }

                    // LOGIC 2: If item is for guests only (like 'Pricing'), but user IS logged in -> Hide it
                    if (item.guest_only && session) {
                      return null;
                    }

                    return(
                    <Link
                      key={index}
                      href={item.link}
                    >
                      {item.name}
                    </Link>
                    )
                  })}
                </div>
              </div>
              ))}
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
            {siteData[3].footer_menu
              .find((menu) => menu.menu_name === "Legal")
              ?.menu_items.map((item, index) => (
                <Link
                  href={item.link}
                  key={index}
                >
                  {item.name}
                </Link>
              ))}
          </div>
          <div className="col social-media-column">
            <SocialMedia />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
