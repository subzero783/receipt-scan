import Link from 'next/link';


const CallToActionTwo = ({data}) => {

    const {title, subtitle, buttons} = data;

    return(
        <div className="cta-2-section">
            <div className="cta-2-card">
                <h2>{title}</h2>
                <p>{subtitle}</p>
                <div className="action-buttons">
                    {buttons.map((button, index)=>(
                    <Link key={index} href={button.link} className="btn btn-primary">{button.text}</Link>
                    ))}              
                </div>
            </div>
        </div>
    );
}

export default CallToActionTwo;