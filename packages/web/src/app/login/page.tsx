'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext'; // Added

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const router = useRouter();
  const { login } = useAuth();
  const { addNotification } = useNotifications(); // Added

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      await login(email, password); // Use email
      addNotification({ displayType: 'toast', style: 'success', message: 'Login successful!' }); // Use addNotification
      router.push('/dashboard'); // Redirect to dashboard
    } catch (error: any) {
      addNotification({ displayType: 'toast', style: 'error', message: error.message || 'Login failed.' }); // Use addNotification
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="login-background d-flex justify-content-center align-items-center min-vh-100"> {/* Added login-background class */}
      <div className="card p-4 login-card"> {/* Added login-card class */}
        <div className="text-center mb-4">
          <img src="/brand.svg" alt="Brand Logo" style={{ width: '64px', height: '64px' }} className="mb-3" /> {/* Added Logo */}
          <h2 className="text-center">Welcome Back</h2> {/* Changed Heading */}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="emailInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" // Added placeholder
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label">Password</label> {/* Changed id to passwordInput */}
            <input
              type="password"
              className="form-control"
              id="passwordInput" // Changed id to passwordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" // Added placeholder
              required
            />
          </div>
          <div className="mb-3 form-check"> {/* Added Remember me checkbox */}
            <input type="checkbox" className="form-check-input" id="rememberMeCheck" />
            <label className="form-check-label" htmlFor="rememberMeCheck">Remember me</label>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}> {/* Added disabled and loading spinner */}
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
          <p className="text-center mt-3">
            <Link href="/reset-password">Forgot password?</Link> {/* Added Forgot password link */}
          </p>
          <p className="text-center mt-3">
            Don't have an account? <Link href="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
