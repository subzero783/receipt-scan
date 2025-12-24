import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaCube } from "react-icons/fa6";
import siteData from "@/data/siteData.json";

const Features = () => {
  return(
    <section className="features">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="top-text">
              <p className="small-title">{siteData[1].home_page.features.small_title}</p>
              <h2 className="title">{siteData[1].home_page.features.title}</h2>
              <p className="subtitle">{siteData[1].home_page.features.subtitle}</p>
            </div>
            <div className="boxes">
              {siteData[1].home_page.features.boxes.map((item, index) => (
                <div
                  className="box"
                  key={index}
                  style={{backgroundImage: `url(/images${item.image})`}}
                >
                  <div className="box-text-container">
                    <FaCube/>
                    <p className="title">{item.title}</p>
                    <p className="text">{item.text}</p>
                    <Link href={item.link.url}>{item.link.text} <MdKeyboardArrowRight/></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features;