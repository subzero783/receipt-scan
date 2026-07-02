"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import Spinner from "@/components/Spinner";
import FAQs from "@/components/FAQs";
import Link from "next/link";
import { navigateTo } from "@/utils/navigation";

const SignUpForm = ({ signup_data, faqs }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get('canceled'); // Detect cancelation
  const interval = searchParams.get('interval') || 'monthly';

  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session, status: sessionStatus } = useSession();

  // --- Security & Redirect Logic ---
  useEffect(() => {
    // 1. If they land here from Stripe's Cancel URL
    if (canceled === 'true') {
      setError("Checkout canceled. If you already created an account, please Log In to complete setup.");
    }

    if (sessionStatus === "authenticated") {
      // 2. Did they click the browser BACK button from Stripe?
      if (sessionStorage.getItem("stripe_redirected")) {
        sessionStorage.removeItem("stripe_redirected");

        // FIX: Force a hard redirect to wipe NextAuth state completely
        signOut({ callbackUrl: "/signup?canceled=true" });
        return;
      }

      // 3. Normal authenticated users go to dashboard
      router.replace("/dashboard");
    }
  }, [sessionStatus, router, canceled]);
  // --------------------------------------

  const registration_section = signup_data.registration;

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    const username = e.target.elements.username.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    if (!username || username.length <= 0) {
      setError("Username is required");
      setIsProcessing(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      setIsProcessing(false);
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Hit our updated backend API
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, interval }),
      });

      if (res.status === 400) {
        setError("This email is already registered. Please log in instead.");
        setIsProcessing(false);
        return;
      }

      if (res.status === 201) {
        // Automatically sign in the user
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password
        });
        if (result.error) {
          setError("Registration successful, but sign in failed. Please log in manually.");
          setIsProcessing(false);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
      setIsProcessing(false);
    }
  };

  if (sessionStatus === "loading") {
    return <Spinner />;
  }

  return (
    sessionStatus !== "authenticated" && (
      <>
        <section className="signup-page">
          <div className="container">
            <div className="row">
              <div className="col">
                <h2 className="title">{registration_section.title}</h2>
                <p className="subtitle">{registration_section.subtitle}</p>
                <form onSubmit={handleSubmit} className="signup-form" autoComplete="on" noValidate>
                  <div className="name-container">
                    <div className="input-group">
                      <input name="username" type="text" placeholder="Username" className="signup-input" required />
                    </div>
                  </div>
                  <div className="email-password-button-container">
                    <div className="input-group">
                      <input name="email" type="email" placeholder="Email" className="signup-input" required />
                    </div>
                    <div className="input-group">
                      <input name="password" type="password" placeholder="Password" className="signup-input" required />
                    </div>
                    <button
                      type="submit"
                      className="signup-submit-btn"
                      disabled={isProcessing}
                      style={{ opacity: isProcessing ? 0.7 : 1 }}
                    >
                      {isProcessing ? "Signing Up..." : "Sign Up"}
                    </button>
                  </div>
                  <div className="error-container">
                    {error && (
                      <p>
                        {error}
                        {/* Provide a quick link to the login page if they canceled */}
                        {error.includes("Log In") && (
                          <Link href="/login">Go to Login</Link>
                        )}
                      </p>
                    )}
                  </div>
                </form>
                <p className="or-text">- OR -</p>
                <button
                  onClick={() => {
                    document.cookie = "auth_source=signup; path=/; max-age=300";
                    signIn("google", { callbackUrl: "/dashboard" });
                  }}
                  className="signup-with-google"
                >
                  <FaGoogle />
                  <span>Sign Up with Google</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        <FAQs data={faqs} />
      </>
    )
  );
};

export default SignUpForm;
