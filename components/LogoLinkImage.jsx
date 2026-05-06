import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/Receipt_Scan_logo_01.png";

const LogoLinkImage = () => {
  return (
    <Link href="/">
      <Image
        className="logo-img"
        src={logo}
        alt="Receipt Scan logo"
        width={100}
        height={100}
      />
    </Link>
  );
};

export default LogoLinkImage;
