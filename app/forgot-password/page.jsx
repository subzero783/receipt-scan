'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaEnvelope } from 'react-icons/fa';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="container">
        <div className="row">
          <div className="col">
            <section className="forgot-password-section">
              <h1 className="title">Reset Password</h1>

              {success ? (
                <div className="success-message">
                  Check your email! We sent you a link to reset your password.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label htmlFor="email" className="">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="" />
                      <input
                        name="email"
                        type="email"
                        className=""
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              )}

              <p className="remembered-it">
                Remembered it? <Link href="/login" className="">Log in</Link>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;