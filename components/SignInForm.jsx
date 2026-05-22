"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import Spinner from "@/components/Spinner";
import CallToActionTwo from "@/components/CallToActionTwo";

const SignInForm = ({ signin_data }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError === 'AccountNotFound') {
      setError("Account not found. Please sign up first.");
    } else if (urlError) {
      setError("Authentication failed.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      if (res?.url) router.replace("/");
    } else {
      setError("");
    }
  };

  const hero_section = signin_data.hero_section;
  const cta = signin_data.cta;

  if (sessionStatus === "loading") {
    return <Spinner />;
  }

  return (
    sessionStatus !== "authenticated" && (
      <section className="login-page">
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className="title">{hero_section.title}</h1>
              <p className="subtitle">{hero_section.subtitle}</p>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Email address"
                    className="login-input"
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Password"
                    className="login-input"
                    required
                  />
                </div>
                <button type="submit" className="login-submit-btn">Sign in</button>
              </form>
              {error && <p className="login-error-container">{error}</p>}
              <button
                className="sign-in-with-google"
                onClick={() => {
                  document.cookie = "auth_source=login; path=/; max-age=300";
                  signIn("google");
                }}
              >
                <FaGoogle />
                <span>Sign In with Google</span>
              </button>
              {/* Add a link to the forgot password page */}
              <Link href="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
              <div className="legal-text">
                {hero_section.legal_disclaimer}
              </div>
            </div>
          </div>
        </div>

        <CallToActionTwo data={cta} />
      </section>
    )
  );
};

export default SignInForm;
