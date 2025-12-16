"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import profileDefault from "@/assets/images/profile.png";
import { Container, Row, Col } from "react-bootstrap";
import logo from "@/assets/images/company-logo.png";

const Navbar = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const pathName = usePathname();

  return (
    <nav className="top-navigation">
      <Container>
        <Row>
          {/* start:Mobile Menu button column */}
          <Col className="mobile-menu-column">
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
          </Col>
          {/* end:Mobile Menu button column */}
          {/* start:Logo column */}
          <Col className="logo-column">
            <Link href="/">
              <Image
                src={logo}
                alt=""
              />
            </Link>
          </Col>
          {/* end:Logo column */}
          {/* start:Top Menu column */}
          <Col className="top-menu-column">
            <Link
              href="/"
              className={`${pathName === "/" ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={`${pathName === "/blog" ? "active" : ""}`}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className={`${pathName === "/about" ? "active" : ""}`}
            >
              About
            </Link>
            <Link
              href="/features"
              className={`${pathName === "/features" ? "active" : ""}`}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className={`${pathName === "/pricing" ? "active" : ""}`}
            >
              Pricing
            </Link>
          </Col>
          <Col className="top-buttons">
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
          </Col>
          {/* end:Top Menu column */}
          {/* start:Right Side Menu column */}
          {session && (
            <Col className="right-side-menu-col">
              {/* Profile Image */}
              <div className="profile-image-container">
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
              <div className="profile-dropdown-menu-container"></div>
            </Col>
          )}
          {/* end:Right Side Menu column */}
        </Row>
      </Container>
    </nav>
  );
};

export default Navbar;
