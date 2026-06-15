import Link from "next/link";
import { GiCheckMark } from "react-icons/gi";

const TwoColumns = ({ data, text_direction, section_class, icon, background_color = "", bottom_border = false, small_title_margin = false }) => {

    const { small_title, title, subtitle, buttons, image, image_alt, list_items } = data;

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
                                    {title ? <h2 className="title">{title}</h2> : null}
                                    {subtitle ? <p className="description">{subtitle}</p> : null}
                                    {list_items ?
                                        list_items.map((item, index) => (
                                            <ul key={index} className="list-container">
                                                <li>
                                                    <span className="icon-container"><GiCheckMark /></span>
                                                    <div className="text-container">
                                                        {item.title ? <h3 className="title">{item.title}</h3> : null}
                                                        {item.text ? <p className="text">{item.text}</p> : null}
                                                    </div>
                                                </li>
                                            </ul>
                                        )) : null
                                    }
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
                        <div className="image-container">
                            <img src={image} alt={image_alt} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TwoColumns;
