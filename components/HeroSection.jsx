import Link from "next/link";

const HeroSection = ({data}) => {

  const {title, subtitle, buttons} = data;

  return (
    <section className="hero-section">
      <div className="container">
        <div className="row">
          <div className="col">
            <h1>{title}</h1>
            <p className="subtitle">{subtitle}</p>
            <div className="buttons">
              {
                buttons.map((item, index)=>(
                <Link
                  href={item.link}
                  className="btn btn-third"
                  key={index}
                >
                  {item.text}
                </Link>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
