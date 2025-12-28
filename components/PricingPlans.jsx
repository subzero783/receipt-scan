import Link from "next/link";
import { FaCube } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";

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
                    <h3 className="small-title">{item.small_title}</h3>
                    <FaCube />
                  </div>
                  <div className="price-and-discount-text">
                    <p className="monthly-price">
                      ${item.monthly_price}
                      <span>/mo</span>
                    </p>
                    <p className="discount-text">{item.discount_text}</p>
                  </div>
                  <div className="includes-list">
                    <p>Includes:</p>
                    <ul>
                      {item.includes.map((item, index) => (
                        <li key={index}>
                          <IoMdCheckmark /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="button">
                    <Link
                      className="btn btn-primary"
                      href={item.button.link}
                    >
                      {item.button.text}
                    </Link>
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
