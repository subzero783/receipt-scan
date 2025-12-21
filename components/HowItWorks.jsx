import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import siteData from "@/data/siteData.json";

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="top-text">
              <p className="small-title">{siteData[1].how_it_works.small_title}</p>
              <h2 className="title">{siteData[1].how_it_works.title}</h2>
              <p className="subtitle">{siteData[1].how_it_works.subtitle}</p>
            </div>
            <div className="boxes">
              {siteData[1].how_it_works.boxes.map((item, index) => (
                <div
                  className="box"
                  key={index}
                >
                  <div className="box-image" style={{backgroundImage: `url(/images${item.image})`}}></div>
                  <div className="box-text-container">
                    <p className="small-title">{item.small_title}</p>
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
  );
};

export default HowItWorks;
