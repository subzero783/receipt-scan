import Link from "next/link";

const HeroSectionTwo = ({ data }) => {
  const { small_title, title, subtitle, buttons } = data;

  return (
    <section className="hero-section-two">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="top-text">
              <p className="small-title">{small_title}</p>
              <h1>{title}</h1>
              <p className="subtitle">{subtitle}</p>
              <div className="buttons">
                {buttons.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className="btn btn-primary"
                  >
                    {item.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionTwo;
