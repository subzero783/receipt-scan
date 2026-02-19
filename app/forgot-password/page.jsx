'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaEnvelope } from 'react-icons/fa';
import siteData from '@/data/siteData.json';

const ForgotPasswordPage = () => {

  const forgot_password_page = siteData.find(item => item.forgot_password_page)?.forgot_password_page;

  if (!forgot_password_page) return <div>Loading...</div>;

  const hero_section = forgot_password_page.hero_section;

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
              <div className="top-text">
                <h1 className="title">{hero_section.title}</h1>
              </div>

              {success ? (
                <div className="success-message">
                  {hero_section.success_message}
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label htmlFor="email" className="">
                      <h2>Email Address</h2>
                    </label>
                    <div className="icon-and-input">
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
                    className="btn btn-sixth"
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