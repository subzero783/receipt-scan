import Image from "next/image";
import siteData from "@/data/siteData.json";

const Testimonials = () => {
    return(
        <section className="testimonials">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="top-text">
                            <h2 className="title">{siteData[1].home_page.testimonials.title}</h2>
                            <p className="subtitle">{siteData[1].home_page.testimonials.subtitle}</p>
                        </div>
                    </div>
                </div>
                <div className="boxes">
                    {
                        siteData[1].home_page.testimonials.boxes.map((item, index)=>(
                            <div className="box" key={index}></div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Testimonials;