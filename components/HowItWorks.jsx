import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import siteData from "@/data/siteData.json";

const HowItWorks = ({data}) => {

  const {small_title, title, subtitle, boxes} = data;

  return (
    <section className="how-it-works">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="top-text">
              <p className="small-title">{small_title}</p>
              <h2 className="title">{title}</h2>
              <p className="subtitle">{subtitle}</p>
            </div>
            <div className="boxes">
              {boxes.map((item, index) => (
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
