"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import Spinner from "@/components/Spinner";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
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

  if (sessionStatus === "loading") {
    return <Spinner/>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <section className="login-section">
        <div className="login-hero">
          <div className="login-container container">
            <div className="row">
              <div className="col">
                <h1>Sign in to your account</h1>
                <p>Access your expense tracking and manage your business finances with ease</p>
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
                  {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                </form>
                <div className="legal-text">
                  By signing in, you agree to our terms of service and privacy policy
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="new-platform-section">
          <div className="new-platform-card">
            <h2>New to our platform?</h2>
            <p>Create an account to start tracking your business expenses effortlessly</p>
            <div className="action-buttons">
              <Link href="/register" className="btn-primary-blue">Sign up</Link>
              <Link href="/about" className="btn-secondary-light">Learn more</Link>
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default LoginPage;
