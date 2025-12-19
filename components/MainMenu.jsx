import Link from "next/link";
import { usePathname } from "next/navigation";

function MainMenu() {
  const pathName = usePathname();

  return (
    <>
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
    </>
  );
}

export default MainMenu;
