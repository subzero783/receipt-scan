import Link from "next/link";

const TwoColumns = ({ data, text_direction, section_class, icon }) => {

    const { title, subtitle, buttons, image } = data;

    return (
        <section className={`two-columns-section ${text_direction} ${section_class}`}>
            <div className="container">
                <div className="row">
                    <div className="col left-column">
                        <div className="content">
                            <div className="icon-wrapper">
                                {icon}
                            </div>
                            <div className="text-wrapper">
                                <h2 className="title">{title}</h2>
                                <p className="description">{subtitle}</p>
                                <div className="buttons-wrapper">
                                    {buttons.map((button, index) => (
                                        <Link key={index} href={button.link} className="btn btn-fourth">
                                            {button.text}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col right-column">
                        <div className="background-image" style={{ backgroundImage: `url(${image})` }}></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TwoColumns;
