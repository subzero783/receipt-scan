import Link from "next/link";
import { usePathname } from "next/navigation";
import siteData from "@/data/siteData.json";

function MainMenu() {
  const pathName = usePathname();

  return (
    <>
      {siteData[2].top_menu.map((item, index) => (
        <Link
          key={index}
          href={item.link}
          className={`${pathName === item.link ? "active" : ""}`}
        >
          {item.name}
        </Link>
      ))}
    </>
  );
}

export default MainMenu;
