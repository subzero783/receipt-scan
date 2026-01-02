"use client";
import { FaTwitter, FaLinkedin, FaFacebook, FaLink } from "react-icons/fa";
import { toast } from "react-toastify";

const ShareButtons = ({ title, url }) => {
    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="share-buttons">
            <span>Share this post:</span>
            <div className="icons">
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="share-icon twitter">
                    <FaTwitter />
                </a>
                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="share-icon linkedin">
                    <FaLinkedin />
                </a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="share-icon facebook">
                    <FaFacebook />
                </a>
                <button onClick={handleCopyLink} className="share-icon link">
                    <FaLink />
                </button>
            </div>
        </div>
    );
};

export default ShareButtons;
