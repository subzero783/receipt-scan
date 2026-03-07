import Link from "next/link";
import Image from "next/image";

const ToolsSection = ({ data }) => {

    const { small_title, title, subtitle, tools } = data;

    return (
        <section className="tools-section">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="top-text">
                            <span className="small-title">{small_title}</span>
                            <h2 className="title">{title}</h2>
                            <p className="subtitle">{subtitle}</p>
                        </div>
                    </div>
                </div>
                <div className="row tools-row">
                    {tools.map((tool, index) => (
                        <div className="col" key={index}>
                            <div className="tool-image" style={{ backgroundImage: `url(${tool.image})` }}></div>
                            <div className="text-wrapper">
                                <span className="small-title">{tool.small_title}</span>
                                <h3 className="title">{tool.title}</h3>
                                <p className="description">{tool.text}</p>
                                <Link href={tool.button.link} className="btn btn-secondary">{tool.button.text}</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ToolsSection;