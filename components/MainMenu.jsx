import Link from "next/link";
import { usePathname } from "next/navigation";
import siteData from "@/data/siteData.json";

function MainMenu({session}) {
  const pathName = usePathname();
  
  // Get the menu data
  const menuItems = siteData.find(item => item.top_menu)?.top_menu || [];

  return (
    <>
      {menuItems.map((item, index) => {

        // LOGIC 1: If item requires auth, but user is NOT logged in -> Hide it
        if (item.auth_required && !session) {
          return null;
        }

        // LOGIC 2: If item is for guests only (like 'Pricing'), but user IS logged in -> Hide it
        if (item.guest_only && session) {
          return null;
        }

        return(
          <Link
            key={index}
            href={item.link}
            className={`${pathName === item.link ? "active" : ""}`}
          >
            {item.name}
          </Link>
        )
      })}
    </>
  );
}

export default MainMenu;
