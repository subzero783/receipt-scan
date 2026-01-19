import { FaHandSparkles, FaShieldAlt, FaHeart } from 'react-icons/fa';

const OurValuesSection = ({ data }) => {

    const { small_title, title, subtitle, values } = data;

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'sparkles': return <FaHandSparkles size={24} color="#4F46E5" />;
            case 'shield': return <FaShieldAlt size={24} color="#4F46E5" />;
            case 'heart': return <FaHeart size={24} color="#4F46E5" />;
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
                    </div>
                    <div className="col">
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OurValuesSection;