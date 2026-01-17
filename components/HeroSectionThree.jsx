const HeroSectionThree = ({ data }) => {

  const {small_title, title, subtitle} = data;

  return (
    <section className="hero-section-three">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="top-text">
              <p className="small-title">{small_title}</p>
              <h1 className="title">{title}</h1>
              <p className="subtitle">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionThree;
