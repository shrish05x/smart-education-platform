import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const validate = () => {
    if (!email) {
      setFieldError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('Enter a valid email address');
      return false;
    }
    setFieldError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await forgotPassword(email);
      setSuccess(true);
      setResetUrl(data.resetUrl || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-bg-gradient" />
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <div className="auth-card auth-fade-in">
        <div className="auth-header">
          <div className="auth-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#fpGrad)" />
              <path d="M20 10a7 7 0 017 7v3h-2v-3a5 5 0 10-10 0v3h-2v-3a7 7 0 017-7z" fill="#fff" opacity="0.9" />
              <rect x="12" y="20" width="16" height="12" rx="3" fill="#fff" opacity="0.9" />
              <circle cx="20" cy="25" r="2" fill="#6366f1" />
              <path d="M20 27v3" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="fpGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#f59e0b" />
                  <stop offset="1" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="auth-title">Forgot password?</h2>
          <p className="auth-subtitle">No worries — enter your email and we&apos;ll send you reset instructions</p>
        </div>

        {success ? (
          <div className="auth-success-box auth-fade-in">
            <div className="auth-success-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#10b981" opacity="0.15" />
                <path d="M15 25l6 6 12-12" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="auth-success-title">Reset link generated!</h3>
            <p className="auth-success-desc">
              A password reset link has been created. In a production environment, this would be sent to your email.
            </p>
            {resetUrl && (
              <div className="auth-reset-link-box">
                <p className="auth-reset-link-label">Reset Link (dev only):</p>
                <a href={resetUrl} className="auth-reset-link">{resetUrl}</a>
              </div>
            )}
            <Link to="/login" className="auth-submit-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '1.5rem' }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="auth-error-banner">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5h2v4H7V5zm0 5h2v2H7v-2z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-field">
                <label htmlFor="fp-email" className="auth-label">Email Address</label>
                <div className={`auth-input-wrapper ${fieldError ? 'auth-input-error' : ''}`}>
                  <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="M2 7l10 7 10-7" />
                  </svg>
                  <input
                    id="fp-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldError(''); }}
                    placeholder="you@example.com"
                    className="auth-input"
                    autoComplete="email"
                  />
                </div>
                {fieldError && <span className="auth-field-error">{fieldError}</span>}
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : 'Send Reset Link'}
              </button>
            </form>

            <p className="auth-footer-text">
              Remember your password?{' '}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
