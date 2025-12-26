import Link from "next/link";

const CallToAction = ({ data }) => {
  const { title, subtitle, button } = data;

  return (
    <section className="call-to-action-section">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="cta-text">
              <h3 className="title">{title}</h3>
              <p className="subtitle">{subtitle}</p>
              <Link
                className="btn btn-primary"
                href={button.link}
              >
                {button.text}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
