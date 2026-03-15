import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    university: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.role, formData.university);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'student', label: 'Student', icon: '🎓' },
    { value: 'mentor', label: 'Mentor', icon: '👨‍🏫' },
    { value: 'counselor', label: 'Counselor', icon: '🧭' },
  ];

  return (
    <div className="auth-page-wrapper">
      <div className="auth-bg-gradient" />
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <div className="auth-card auth-card-wide auth-fade-in">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#regGrad)" />
              <path d="M20 8l10 6v12l-10 6-10-6V14l10-6z" fill="#fff" opacity="0.9" />
              <circle cx="20" cy="20" r="4" fill="#6366f1" />
              <defs>
                <linearGradient id="regGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Join the Student Success Platform</p>
        </div>

        {serverError && (
          <div className="auth-error-banner">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5h2v4H7V5zm0 5h2v2H7v-2z" />
            </svg>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Name */}
          <div className="auth-field">
            <label htmlFor="reg-name" className="auth-label">Full Name</label>
            <div className={`auth-input-wrapper ${errors.name ? 'auth-input-error' : ''}`}>
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input id="reg-name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="auth-input" autoComplete="name" />
            </div>
            {errors.name && <span className="auth-field-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-label">Email Address</label>
            <div className={`auth-input-wrapper ${errors.email ? 'auth-input-error' : ''}`}>
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="M2 7l10 7 10-7" />
              </svg>
              <input id="reg-email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="auth-input" autoComplete="email" />
            </div>
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          {/* Password row */}
          <div className="auth-row">
            <div className="auth-field">
              <label htmlFor="reg-password" className="auth-label">Password</label>
              <div className={`auth-input-wrapper ${errors.password ? 'auth-input-error' : ''}`}>
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input id="reg-password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="auth-input" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-toggle-pw" tabIndex={-1}>
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
              {errors.password && <span className="auth-field-error">{errors.password}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="reg-confirm" className="auth-label">Confirm Password</label>
              <div className={`auth-input-wrapper ${errors.confirmPassword ? 'auth-input-error' : ''}`}>
                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <input id="reg-confirm" type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="auth-input" autoComplete="new-password" />
              </div>
              {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* University */}
          <div className="auth-field">
            <label htmlFor="reg-university" className="auth-label">University <span className="auth-optional">(optional)</span></label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 20h20M4 20V10l8-6 8 6v10" />
                <path d="M9 20v-4h6v4" />
                <path d="M10 14h.01M14 14h.01" />
              </svg>
              <input id="reg-university" type="text" name="university" value={formData.university} onChange={handleChange} placeholder="e.g. MIT, Stanford..." className="auth-input" />
            </div>
          </div>

          {/* Role */}
          <div className="auth-field">
            <label className="auth-label">I am a...</label>
            <div className="auth-role-grid">
              {roles.map((r) => (
                <label key={r.value} className={`auth-role-card ${formData.role === r.value ? 'auth-role-active' : ''}`}>
                  <input type="radio" name="role" value={r.value} checked={formData.role === r.value} onChange={handleChange} className="auth-role-radio" />
                  <span className="auth-role-icon">{r.icon}</span>
                  <span className="auth-role-label">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
