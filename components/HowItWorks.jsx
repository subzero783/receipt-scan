import Image from "next/image";
import Link from "next/link";
import siteData from "@/data/siteData.json";

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="boxes">
              {siteData[1].how_it_works.boxes.map((item, index) => (
                <div
                  className="box"
                  key={index}
                >
                  <Image
                    src={`/images${item.image}`}
                    alt={item.title}
                    width={100}
                    height={100}
                  />
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
