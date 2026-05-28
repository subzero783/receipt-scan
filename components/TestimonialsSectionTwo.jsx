import Image from "next/image";

const TestimonialsSectionTwo = ({ data }) => {

    const { title, subtitle, testimonials } = data;

    return (
        <div className="testimonials-section-two">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="top-text">
                            <h2 className="title">{title}</h2>
                            <p className="subtitle">{subtitle}</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="testimonials">
                            {
                                testimonials.map((item, index) => {
                                    {
                                        return (
                                            <div
                                                className="testimonial"
                                                key={index}
                                            >
                                                <img src={item.image} alt={item.image_alt} />
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSectionTwo;