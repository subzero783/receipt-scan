import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/company-logo.png";

const LogoLinkImage = () => {
  return (
    <Link href="/">
      <Image
        src={logo}
        alt=""
      />
    </Link>
  );
};

export default LogoLinkImage;
