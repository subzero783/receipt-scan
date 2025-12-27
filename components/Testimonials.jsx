import Image from "next/image";
import { LiaStarSolid } from "react-icons/lia";

const Testimonials = ({ data }) => {
  const { title, subtitle, boxes } = data;

  const getFiveStars = () => {
    const stars = [];
    for (let i = 0; i <= 4; i++) {
      stars.push(<LiaStarSolid key={i + 1} />);
    }
    return stars;
  };

  return (
    <section className="testimonials">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="top-text">
              <h2 className="title">{title}</h2>
              <p className="subtitle">{subtitle}</p>
            </div>
          </div>
        </div>
        <div className="boxes">
          {boxes.map((item, index) => (
            <div
              className="box"
              key={index}
            >
              <div className="stars">{getFiveStars()}</div>
              <p className="text">{item.text}</p>
              <div className="image-and-author-name">
                <Image
                  className="author-image"
                  src={`/images${item.image}`}
                  alt={item.author}
                  width={100}
                  height={100}
                />
                <div className="name-and-occupation">
                  <p className="author">{item.author}</p>
                  <p className="occupation">{item.occupation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
