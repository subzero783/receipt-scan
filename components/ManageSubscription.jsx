'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const ManageSubscription = ({ data }) => {
    const { small_title, title, subtitle } = data;
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    // Determines if the user is currently on an active Pro/Trial plan
    const isPro = session?.user?.isPro;

    const handlePortal = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/stripe/portal', { method: 'POST' });
            const data = await res.json();
            window.location.href = data.url;
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/stripe/checkout', { method: 'POST' });
            const data = await res.json();
            window.location.href = data.url;
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

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
                <div className="box-container row" style={{ justifyContent: 'center' }}>
                    <div className="col" style={{ textAlign: 'center', background: '#f8fafc', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto' }}>
                        {isPro ? (
                            <>
                                <h3 style={{ marginBottom: '10px', fontSize: '20px', color: '#0f172a' }}>You are on the Pro Plan</h3>
                                <p style={{ marginBottom: '20px', color: '#64748b' }}>Update your payment method, view invoices, or cancel your plan.</p>
                                <button onClick={handlePortal} disabled={isLoading} className="btn btn-primary">
                                    {isLoading ? "Loading..." : "Manage Subscription"}
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 style={{ marginBottom: '10px', fontSize: '20px', color: '#0f172a' }}>You are on the Free Plan</h3>
                                <p style={{ marginBottom: '20px', color: '#64748b' }}>Your trial has ended or you are currently inactive. Upgrade to unlock all features.</p>
                                <button onClick={handleUpgrade} disabled={isLoading} className="btn btn-primary" style={{ background: '#3b82f6' }}>
                                    {isLoading ? "Loading..." : "Upgrade to Pro"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ManageSubscription;