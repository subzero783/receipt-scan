const TopText = ({ text }) => {
    return (
        <div className="top-text">
            <p className="small-title">{text.small_title}</p>
            <h2 className="title">{text.title}</h2>
            <p className="subtitle">{text.subtitle}</p>
        </div>
    );
}

export default TopText;