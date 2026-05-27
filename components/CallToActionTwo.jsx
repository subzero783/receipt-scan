import Link from 'next/link';


const CallToActionTwo = ({ data }) => {
    const { small_title, title, subtitle, buttons = [] } = data || {};

    return (
        <section className="cta-2-section">
            <div className="cta-2-card">
                {small_title && <p className="small-title">{small_title}</p>}
                {title && <h2>{title}</h2>}
                {subtitle && <p>{subtitle}</p>}
                {buttons && buttons.length > 0 && (
                    <div className="action-buttons">
                        {buttons.map((button, index) => {
                            if (!button || !button.link || !button.text) return null;
                            return (
                                <Link key={index} href={button.link} className="btn btn-primary">
                                    {button.text}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

export default CallToActionTwo;