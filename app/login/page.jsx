"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";

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
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <section className="login-section">
        <Container>
          <Row>
            <Col>
              <h1>Login</h1>
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
                <button type="submit"> Sign In</button>
                <p>{error && error}</p>
              </form>
              <button
                onClick={() => {
                  signIn("google");
                }}
              >
                <FaGoogle />
                <span>Sign In with Google</span>
              </button>
              <div>- OR -</div>
              <Link href="/register">Register Here</Link>
            </Col>
          </Row>
        </Container>
      </section>
    )
  );
};

export default LoginPage;
