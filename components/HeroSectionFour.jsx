import Link from "next/link";

const HeroSectionFour = ({data}) => {
    const {small_title, title, subtitle, buttons} = data;

    return(
        <section className="hero-section-four">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="top-text">
                            <p className="small-title">{small_title}</p>
                            <h1 className="title">{title}</h1>
                            <p className="subtitle">{subtitle}</p>
                            <ul className="buttons">
                            {
                                buttons.map((button, index)=>{
                                    return(
                                        <li className="button" key={index}>
                                            <Link className="btn btn-primary" href={button.link}>{button.text}</Link>
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

export default HeroSectionFour;