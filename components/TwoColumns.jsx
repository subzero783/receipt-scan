import { IoDocumentTextOutline } from "react-icons/io5";
import Link from "next/link";

const TwoColumns = ({ data, text_direction }) => {

    const { title, subtitle, buttons, image } = data;

    return (
        <section className={`two-columns-section ${text_direction}`}>
            <div className="container">
                <div className="row">
                    <div className="col left-column">
                        <div className="content">
                            <div className="icon-wrapper">
                                <IoDocumentTextOutline />
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
