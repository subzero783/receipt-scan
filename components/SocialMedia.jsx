import Link from "next/link"
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";



const SocialMedia = () => {
    return(
        <div className="social-media-links">
            <Link href="/"><FaFacebook/></Link>
            <Link href="/"><FaInstagram/></Link>
            <Link href="/"><FaLinkedin/></Link>
            <Link href="/"><FaTiktok/></Link>
        </div>
    )
}

export default SocialMedia;

