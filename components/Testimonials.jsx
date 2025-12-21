import Image from "next/image";

const Testimonials = () => {
    return(
            <section className="how-it-works">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="top-text">
              <h2 className="title">{siteData[1].home_page.testimonials.title}</h2>
              <p className="subtitle">{siteData[1].home_page.testimonials.subtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    )
}

export default Testimonials;