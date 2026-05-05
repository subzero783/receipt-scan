import Link from "next/link";

const ReceiptsManagedTaxesConquered = ({ data }) => {
    const { small_title, title, text, button } = data;

    return (
        <section className="receipts-managed-taxes-conquered">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <span className="small-title">{small_title}</span>
                        <h2 className="title">{title}</h2>
                    </div>
                    <div className="col">
                        <div className="text-container">
                            <p>{text}</p>
                            <div className="btn-wrapper">
                                <Link href={button.link} className="btn btn-primary">{button.text}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ReceiptsManagedTaxesConquered;