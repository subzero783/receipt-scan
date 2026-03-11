import Link from "next/link";

const HeroSection = ({ data }) => {

  const { title, subtitle, buttons, background_image } = data;

  return (
    <section className="hero-section">
      <div className="container">
        <div className="row" style={{ backgroundImage: `url(${background_image})` }}>
          <div className="col">
            {
              title && <h1>{title}</h1>
            }
            {
              subtitle && <p className="subtitle">{subtitle}</p>
            }
            {
              buttons && <div className="buttons">
                {
                  buttons.map((item, index) => (
                    <Link
                      href={item.link}
                      className="btn btn-seventh"
                      key={index}
                    >
                      {item.text}
                    </Link>
                  ))
                }
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
