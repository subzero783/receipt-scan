import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/company-logo.png";

const Footer = () => {
  return (
    <section className="footer">
      <div className="container">
        <div className="row">
          <div className="col">
            <Link href="/">
              <Image
                src={logo}
                alt=""
              />
            </Link>
          </div>
          <div className="col"></div>
          <div className="col"></div>
          <div className="col"></div>
          <div className="col"></div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
