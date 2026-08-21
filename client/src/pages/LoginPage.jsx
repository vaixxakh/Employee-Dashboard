import React from 'react';

import '../styles/auth.css'

import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const [credentials, setCredentials] = React.useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isSubmittingRef = React.useRef(false);

  // Already logged in users should not stay on the login page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    if (!credentials.email.trim() || !credentials.password) {
      toast.error('Please enter your email and password.');
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const { token, user } = await loginUser({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      login(token, user);

      toast.success(`Welcome back, ${user.name}!`);

      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="brand-mark auth-brand-mark" aria-hidden="true">ED</span>
        <h1>Welcome back</h1>
        <p>Log in to your employee dashboard account.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button auth-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-switch-text">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
