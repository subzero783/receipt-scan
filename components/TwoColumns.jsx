import Link from "next/link";

const TwoColumns = ({ data, text_direction, section_class, icon, background_color = "", bottom_border = false, small_title_margin = false }) => {

    const { small_title, title, subtitle, buttons, image } = data;

    return (
        <section className={`two-columns-section ${text_direction} ${section_class}`} style={{
            backgroundColor: background_color ? background_color : "",
            borderBottom: bottom_border ? "1px solid var(--color-neutral-400)" : ""
        }}>
            <div className="container">
                <div className={`row ${small_title_margin ? "small_title_margin" : ""}`}>
                    <div className="col left-column">
                        <div className="content">
                            {small_title ? <span className="small-title">{small_title}</span> : null}
                            <div className="icon-and-text">
                                {icon ? <div className="icon-wrapper">
                                    {icon}
                                </div> : null}
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
