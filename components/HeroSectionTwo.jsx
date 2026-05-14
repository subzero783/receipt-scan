import Link from "next/link";

const HeroSectionTwo = ({ data, extra }) => {
  const { small_title, title, subtitle, buttons } = data;

  return (
    <section className="hero-section-two">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="top-text">
              {
                small_title && <p className="small-title">{small_title}</p>
              }
              {
                title && <h1 className="title">{title}</h1>
              }
              {
                subtitle && <p className="subtitle">{subtitle}</p>
              }
              {
                extra && extra
              }
              {
                buttons && buttons.length > 0 && (
                  <div className="buttons">
                    {buttons.map((item, index) => {
                      return (
                        <Link
                          key={index}
                          href={item.link}
                          className="btn btn-primary"
                        >
                          {item.text}
                        </Link>
                      )
                    })}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionTwo;
