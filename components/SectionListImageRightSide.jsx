'use client';
import { FaHandSparkles, FaShieldAlt, FaHeart } from 'react-icons/fa';
import Link from "next/link";

const SectionListImageRightSide = ({ data }) => {

    const { image, small_title, title, subtitle, list, buttons = [] } = data || {};

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'sparkles': return <FaHandSparkles size={24} />;
            case 'shield': return <FaShieldAlt size={24} />;
            case 'heart': return <FaHeart size={24} />;
            default: return null;
        }
    };

    return (
        <section className="section-list-with-image-right-side">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="top-text">
                            {small_title && <p className="small-title">{small_title}</p>}
                            {title && <h2 className="title">{title}</h2>}
                            {subtitle && <p className="subtitle">{subtitle}</p>}
                        </div>
                        <div className="list">
                            {
                                list.map((item, index) => {
                                    return (
                                        <div
                                            className="list-item"
                                            key={index}
                                        >
                                            <div className="icon">
                                                {item.icon ? getIcon(item.icon) : ""}
                                            </div>
                                            <div className="content">
                                                <h3 className="title">{item.title}</h3>
                                                <p className="description">{item.description}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="buttons">
                            {
                                buttons.length > 0 &&
                                buttons.map((item, index) => {
                                    return (
                                        <Link
                                            className="btn btn-secondary"
                                            key={index}
                                            href={item.link}
                                        >
                                            {item.text}
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="col">
                        <div className="right-side-image" style={{ "backgroundImage": `url(${image})` }}></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionListImageRightSide;