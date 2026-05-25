'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { FaCube } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";

const PricingPlans = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const isPro = session?.user?.isPro;
  const planType = session?.user?.planType;
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handleCheckout = async (interval = 'monthly') => {
    if (!session) {
      router.push(`/signup?plan=pro&interval=${interval}`);
      return;
    }
    try {
      const res = await fetch(`/api/stripe/checkout?interval=${interval}`, { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Payment Error: No checkout URL received', data);
        alert(data.message || 'Payment initialization failed. Please try again.');
      }
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
              <p className="small-title">Plans</p>
              <h2 className="title">Pricing plans</h2>
              <p className="subtitle">Choose the perfect plan for your business or household expense tracking.</p>
            </div>

            <div className="billing-toggle-container">
              <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`billing-toggle-button ${billingCycle}`}
                aria-label="Toggle billing cycle"
              >
                <span className="toggle-switch"></span>
              </button>
              <span className={billingCycle === 'yearly' ? 'active' : ''}>
                Yearly <span className="save-badge">Save 20%</span>
              </span>
            </div>

            <div className="plans">
              <div className="plan">
                <div className="small-title-and-icon">
                  <h3 className="small-title">Free Trial</h3>
                  <FaCube />
                </div>
                <div className="price-and-discount-text">
                  <p className="monthly-price">
                    $0<span>/mo</span>
                  </p>
                  <p className="discount-text">For 14 Days</p>
                </div>
                <div className="includes-list">
                  <p>Includes:</p>
                  <ul>
                    <li><IoMdCheckmark /> 10 Free receipt photo uploads</li>
                    <li><IoMdCheckmark /> Advanced AI categorization</li>
                    <li><IoMdCheckmark /> Download 2 CSV exports per month</li>
                    <li><IoMdCheckmark /> Download 2 Zip folders per month containing receipts</li>
                    <li><IoMdCheckmark /> Download 2 Invoices per month</li>
                    <li><IoMdCheckmark /> Send 1 email per month containing CSV/ZIP files</li>
                    <li><IoMdCheckmark /> Personal Email Inbound Handle for Email receipts</li>
                    <li><IoMdCheckmark /> Monthly expense summary</li>
                  </ul>
                </div>

                <div className="button">
                  {/* // Free Trial Plan */}
                  {!session ? (
                    <Link href={`/signup?plan=free&interval=${billingCycle}`} className="btn btn-primary">
                      Start Free Trial
                    </Link>
                  ) : (
                    isPro && planType === "free" ? (
                      <button onClick={handlePortal} className="btn btn-primary paid-plan">
                        Manage Current Plan
                      </button>
                    ) : null
                  )}
                </div>

              </div>
              <div className="plan">
                <div className="small-title-and-icon">
                  <h3 className="small-title">Pro plan</h3>
                  <FaCube />
                </div>
                <div className="price-and-discount-text">
                  {billingCycle === 'monthly' ? (
                    <>
                      <p className="monthly-price">
                        $20<span>/mo</span>
                      </p>
                      <p className="discount-text">Billed monthly</p>
                    </>
                  ) : (
                    <>
                      <p className="monthly-price">
                        $16<span>/mo</span>
                      </p>
                      <p className="discount-text">Billed annually ($192/year)</p>
                    </>
                  )}
                </div>
                <div className="includes-list">
                  <p>Includes:</p>
                  <ul>
                    <li><IoMdCheckmark /> Unlimited receipt photo uploads</li>
                    <li><IoMdCheckmark /> Advanced AI categorization</li>
                    <li><IoMdCheckmark /> Download unlimited CSV exports</li>
                    <li><IoMdCheckmark /> Download unlimited Zip folders containing receipts</li>
                    <li><IoMdCheckmark /> Download unlimited Invoices per month</li>
                    <li><IoMdCheckmark /> Send unlimited emails per month containing CSV/ZIP files</li>
                    <li><IoMdCheckmark /> Personal Email Inbound Handle for Email receipts</li>
                    <li><IoMdCheckmark /> Monthly expense summary</li>
                    <li><IoMdCheckmark /> Priority customer support</li>
                  </ul>
                </div>

                <div className="button">
                  {/* // Pro Plan */}
                  {
                    session ? (
                      isPro && planType === "pro" ? (
                        <button onClick={handlePortal} className="btn btn-primary paid-plan">
                          Manage Current Plan
                        </button>
                      ) : (
                        <button onClick={() => handleCheckout(billingCycle)} className="btn btn-primary paid-plan">
                          Upgrade to Pro
                        </button>
                      )
                    ) : (
                      <button onClick={() => handleCheckout(billingCycle)} className="btn btn-primary">
                        Get Started
                      </button>
                    )
                  }
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;