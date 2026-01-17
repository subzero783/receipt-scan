'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { FaCube } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";

const PricingPlans = ({ data }) => {
  const { small_title, title, subtitle, plans } = data;

  const { data: session } = useSession();
  const router = useRouter();

  const handleSubscription = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });
      const data = await res.json();
      
      // Redirect to Stripe Payment Page
      window.location.href = data.url;
      
    } catch (err) {
      console.error('Payment Error:', err);
    }
  };

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
                  {item.paid ? (
                    // Renders for Pro Plan (Trigger Stripe)
                    <div className="button">
                      <button 
                        onClick={handleSubscription} 
                        className="btn btn-primary paid-plan"
                      >
                        {item.button.text}
                      </button>
                    </div>
                  ) : (
                    // Renders for Free Plan (Link to Signup)
                    <div className="button">
                      <Link 
                        href={item.button.link} 
                        className="btn btn-primary"
                      >
                        {item.button.text}
                      </Link>
                    </div>
                  )}
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
