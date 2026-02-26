const ManageSubscription = ({ data }) => {

    const { small_title, title, subtitle } = data;

    return (
        <section className="manage-subscription">
            <div className="manage-subscription-container container">
                <div className="row">
                    <div className="col">
                        <div className="top-text">
                            <span className="small-title">{small_title}</span>
                            <h2 className="title">{title}</h2>
                            <p className="subtitle">{subtitle}</p>
                        </div>
                    </div>
                </div>
                <div className="box-container row">
                    <div className="col">

                    </div>
                    <div className="col">

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ManageSubscription;