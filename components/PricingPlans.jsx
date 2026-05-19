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
  const isPro = session?.user?.isPro;

  const handleCheckout = async () => {
    if (!session) {
      router.push('/signup');
      return;
    }
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      console.error('Payment Error:', err);
    }
  };

  const handlePortal = async () => {
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      console.error('Portal Error:', err);
    }
  };

  return (
    <section className="pricing-plans" id="plans">
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
                <div className="plan" key={index}>
                  <div className="small-title-and-icon">
                    <h3 className="small-title">{item.small_title}</h3>
                    <FaCube />
                  </div>
                  <div className="price-and-discount-text">
                    <p className="monthly-price">
                      ${item.monthly_price}<span>/mo</span>
                    </p>
                    <p className="discount-text">{item.discount_text}</p>
                  </div>
                  <div className="includes-list">
                    <p>Includes:</p>
                    <ul>
                      {item.includes.map((incl, idx) => (
                        <li key={idx}><IoMdCheckmark /> {incl}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="button">
                    {index === 0 ? (
                      // Free Trial Plan: Only show button to logged-out users
                      !session && (
                        <Link href={item.button.link} className="btn btn-primary">
                          {item.button.text}
                        </Link>
                      )
                    ) : (
                      // Pro Plan: Handle state for logged in (Pro/Free) vs logged out
                      session ? (
                        isPro ? (
                          <button onClick={handlePortal} className="btn btn-primary paid-plan">
                            Manage Current Plan
                          </button>
                        ) : (
                          <button onClick={handleCheckout} className="btn btn-primary paid-plan">
                            Upgrade to Pro
                          </button>
                        )
                      ) : (
                        <button onClick={handleCheckout} className="btn btn-primary paid-plan">
                          {item.button.text}
                        </button>
                      )
                    )}
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