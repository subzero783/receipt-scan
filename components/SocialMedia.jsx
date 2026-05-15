import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";
import siteData from "@/data/siteData.js";

const SocialMedia = () => {
  const socialData = siteData.find(item => item.social_media)?.social_media;

  if (!socialData) return <div>Loading...</div>;

  const getIcon = (name) => {
    switch (name) {
      case "facebook":
        return <FaFacebook />;
      case "instagram":
        return <FaInstagram />;
      case "linkedin":
        return <FaLinkedin />;
      case "tiktok":
        return <FaTiktok />;
      default:
        return "";
    }
  };

  return (
    <div className="social-media-links">
      {socialData.map((item, index) => (
        <Link
          href={item.link}
          key={index}
        >
          {getIcon(item.name)}
        </Link>
      ))}
    </div>
  );
};

export default SocialMedia;
