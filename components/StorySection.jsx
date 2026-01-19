import Link from "next/link";
import Image from "next/image";

const StorySection = ({ data }) => {

    const { image, image_alt, small_title, title, paragraphs, buttons } = data;

    return (
        <section className="story-section">
            <div className="container">
                <div className="row">
                    <div className="col left-side">
                        <div className="story-image" style={{ "backgroundImage": `url(${image})` }}></div>
                    </div>
                    <div className="col right-side">
                        <div className="top-text">
                            <p className="small-title">{small_title}</p>
                            <h2 className="title">{title}</h2>
                            <div className="paragraphs">
                                {
                                    paragraphs.map((item, index) => {
                                        return (
                                            <p key={index}>{item}</p>
                                        )
                                    })
                                }
                            </div>
                            <ul className="buttons">
                                {
                                    buttons.map((button, index) => {
                                        return (
                                            <li
                                                className="button"
                                                key={index}
                                            >
                                                <Link
                                                    className="btn btn-primary"
                                                    href={button.link}
                                                >
                                                    {button.text}
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StorySection;