import Link from "next/link";
import { FaCube } from "react-icons/fa6";

const PricingPlans = ({ data }) => {
  const { small_title, title, subtitle, plans } = data;

  return (
    <section className="pricing-plans">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="top-text">
              <p className="small-title">{small_title}</p>
              <h2 className="title">{title}</h2>
              <p className="subtitle">{subtitle}</p>
            </div>
            <div className="plans">
              {plans.map((item, index) => (
                <div
                  className="plan"
                  key={index}
                >
                  <div className="small-title-and-icon">
                    <p className="small-title">{item.small_title}</p>
                    <FaCube />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
