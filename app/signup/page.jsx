"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Container, Row, Col } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";

const SignupPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

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
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <section className="signup-section">
        <Container>
          <Row>
            <Col>
              <h1>Signup</h1>
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
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="or-text">- OR -</p>
              <button onClick={() => signIn("google")}>
                <FaGoogle />
                <span>Register with Google</span>
              </button>
            </Col>
          </Row>
        </Container>
      </section>
    )
  );
};

export default SignupPage;
