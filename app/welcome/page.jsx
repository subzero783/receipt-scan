"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Spinner from "@/components/Spinner";

const WelcomePage = () => {
    const router = useRouter();
    const { status } = useSession();
    const [error, setError] = useState("");
    const hasTriggeredCheckout = useRef(false);

    useEffect(() => {
        // If the user isn't logged in, kick them back to signup
        if (status === "unauthenticated") {
            router.replace("/signup");
            return;
        }

        if (status === "authenticated" && !hasTriggeredCheckout.current) {
            hasTriggeredCheckout.current = true;

            const initiateStripeCheckout = async () => {
                try {
                    const searchParams = new URLSearchParams(window.location.search);
                    const interval = searchParams.get('interval') || 'monthly';
                    // 1. Fetch the Stripe URL while they still have a valid NextAuth session.
                    // We pass a query param so the backend knows this is a new Google onboarding flow.
                    const res = await fetch(`/api/stripe/checkout?isNewGoogleUser=true&interval=${interval}`, {
                        method: "POST"
                    });
                    const data = await res.json();

                    if (data.url) {
                        // 2. THE KILL-SWITCH: Destroy their Google session completely in the background
                        await signOut({ redirect: false });

                        // 3. Now send them to the Stripe paywall. They are officially logged out!
                        window.location.href = data.url;
                    } else {
                        console.error("No Stripe URL returned", data);
                        setError("Unable to load checkout. Redirecting to signup...");
                        setTimeout(() => router.push("/signup"), 3000);
                    }
                } catch (err) {
                    console.error("Stripe redirect error:", err);
                    setError("An error occurred. Redirecting to signup...");
                    setTimeout(() => router.push("/signup"), 3000);
                }
            };

            initiateStripeCheckout();
        }
    }, [status, router]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '20px'
        }}>
            {error ? (
                <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
            ) : (
                <>
                    <Spinner />
                    <h2 style={{ marginTop: '20px', fontSize: '24px', color: '#334155' }}>
                        Setting up your account...
                    </h2>
                    <p style={{ color: '#64748b', marginTop: '10px' }}>
                        Redirecting you to start your free trial securely. Please do not close this window.
                    </p>
                </>
            )}
        </div>
    );
};

export default WelcomePage;