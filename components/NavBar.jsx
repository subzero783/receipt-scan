"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import profileDefault from "@/assets/images/profile.png";
import logo from "@/assets/images/company-logo.png";
import MainMenu from "./MainMenu";

const Navbar = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const pathName = usePathname();

  return (
    <nav className="top-navigation">
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
              <span></span>
              <span className="sr-only">Open main menu</span>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
          {/* end:Mobile Menu button column */}
          {/* start:Logo column */}
          <div className="logo-column col">
            <Link href="/">
              <Image
                src={logo}
                alt=""
              />
            </Link>
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
