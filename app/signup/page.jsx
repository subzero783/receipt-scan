"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import siteData from '@/data/siteData.json';
import HeroSectionTwo from "@/components/HeroSectionTwo";
import Spinner from "@/components/Spinner";
import FAQs from "@/components/FAQs";

const SignupPage = () => {

  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const signup_data = siteData[6].signup_page;
  const hero_section = signup_data.hero_section;
  const registration_section = signup_data.registration;
  const faqs = siteData[7].faqs;

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/login");
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

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.status === 400) {
        setError("This email is already registered");
      }
      if (res.status === 201) {
        setError("");
        router.push("/login");
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return <Spinner/>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <>
        <HeroSectionTwo data={hero_section}/>
        <section className="signup-section">
          <div className="register-form-section">
            <div className="container">
              <div className="row">
                <div className="col">
                  <h2 className="title">{registration_section.title}</h2>
                  <p className="subtitle">{registration_section.subtitle}</p>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Email"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                    />
                    <button type="submit">Register with Email</button>
                    <p>{error && error}</p>
                  </form>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <p className="or-text">- OR -</p>
                  <button onClick={() => signIn("google")}>
                    <FaGoogle />
                    <span>Register with Google</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <FAQs data={faqs} />
      </>
    )
  );
};

export default SignupPage;
