'use client';
import { useState, use } from 'react'; // 'use' is for unwrapping params in Next 13+
import { useRouter } from 'next/navigation';

// Note: params is a promise in newer Next.js versions, so we await it or use `use`
const ResetPasswordPage = ({ params }) => {
  // Unwrap params (Next.js 15 requires awaiting params, prior versions didn't)
  // If you are on an older Next.js 14 version, you can just use params.token directly.
  const { token } = use(params);

  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="top-text">
              <h1 className="title">Set New Password</h1>
              <p className="subtitle">Please enter your new password below.</p>
            </div>
            <div className="bottom-container">
              {message && (
                <div className="success-message">
                  {message}
                </div>
              )}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="new-password-form">
                  <label className="new-password-label">New Password</label>
                  <input
                    type="password"
                    className="new-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div className="confirm-password-container">
                  <label className="confirm-password-label">Confirm Password</label>
                  <input
                    type="password"
                    className="confirm-password-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="confirm-password-button btn btn-third"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;