import { FaHandSparkles, FaShieldAlt, FaHeart } from 'react-icons/fa';
import Link from "next/link";

const OurValuesSection = ({ data }) => {

    const { image, small_title, title, subtitle, values, buttons } = data;

    console.log(buttons);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'sparkles': return <FaHandSparkles size={24} />;
            case 'shield': return <FaShieldAlt size={24} />;
            case 'heart': return <FaHeart size={24} />;
            default: return null;
        }
    };

    return (
        <section className="our-values-section">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="top-text">
                            <p className="small-title">{small_title}</p>
                            <h2 className="title">{title}</h2>
                            <p className="subtitle">{subtitle}</p>
                        </div>
                        <div className="values">
                            {
                                values.map((value, index) => {
                                    return (
                                        <div
                                            className="value"
                                            key={index}
                                        >
                                            <div className="icon">
                                                {getIcon(value.icon)}
                                            </div>
                                            <div className="content">
                                                <h3 className="title">{value.title}</h3>
                                                <p className="description">{value.description}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="buttons">
                            {
                                buttons.map((button, index) => {
                                    return (
                                        <Link
                                            className="button"
                                            key={index}
                                            href={button.link}
                                        >
                                            {button.text}
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="col">
                        <div className="our-values-image" style={{ "backgroundImage": `url(${image})` }}></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OurValuesSection;