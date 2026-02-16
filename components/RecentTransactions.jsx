const RecentTransactions = ({ data }) => {
    return (
        <section className="recent-transactions-section">
            <div className="container">
                <div className="top-text">
                    <div className="small-title">{data.small_title}</div>
                    <h2 className="title">{data.title}</h2>
                    <p className="subtitle">{data.subtitle}</p>
                </div>
            </div>
        </section>
    );
};

export default RecentTransactions;