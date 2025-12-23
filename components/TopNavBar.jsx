"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import profileDefault from "@/assets/images/profile.png";
import MainMenu from "./MainMenu";
import { IoIosMenu } from "react-icons/io";
import LogoLinkImage from "./LogoLinkImage";

const Navbar = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathName = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathName]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 90);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`top-navigation ${isScrolled ? "scrolled" : ""} ${isMobileMenuOpen ? "menu-open" : ""}`}>
      <div className="container">
        <div className="row">
          {/* start:Mobile Menu button column */}
          <div className="mobile-menu-column col">
            <button
              type="button"
              id="mobile-dropdown-button"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <IoIosMenu />
            </button>
          </div>
          {/* end:Mobile Menu button column */}
          {/* start:Logo column */}
          <div className="logo-column col">
            <LogoLinkImage />
          </div>
          {/* end:Logo column */}
          {/* start:Top Menu column */}
          <div className="top-menu-column col">
            <MainMenu />
          </div>
          <div className="top-buttons col">
            <Link
              href="/login"
              className={`${pathName === "/login" ? "active" : ""} btn btn-primary`}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={`${pathName === "/signup" ? "active" : ""} btn btn-primary`}
            >
              Sign up
            </Link>
          </div>
          {/* end:Top Menu column */}
          {/* start:Right Side Menu column */}
          {session && (
            <div className="right-side-menu-col col">
              {/* Profile Image */}
              <div className="profile-image-div container">
                <button
                  type="button"
                  id="user-menu-button"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                >
                  <span></span>
                  <span className="sr-only">Open user menu</span>
                  <Image
                    src={profileImage || profileDefault}
                    alt=""
                    width={40}
                    height={40}
                  />
                </button>
              </div>
              {/* Profile Dropdown Menu */}
              <div className="profile-dropdown-menu-div container"></div>
            </div>
          )}
          {/* end:Right Side Menu column */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
