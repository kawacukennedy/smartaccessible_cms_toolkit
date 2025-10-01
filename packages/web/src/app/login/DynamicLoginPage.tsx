'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import Link from 'next/link';

const DynamicLoginPage: React.FC = () => {
  const { login } = useAuth();
  const { addNotification } = useNotifications();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addNotification({
        displayType: 'toast',
        style: 'success',
        message: 'Logged in successfully!',
      });
      // Redirect to dashboard or previous page
    } catch (error: any) {
      addNotification({
        displayType: 'modal',
        style: 'error',
        message: error.message || 'Failed to login.',
        title: 'Login Error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Login</div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <div className="mt-3">
                <Link href="/register">Don't have an account? Register</Link>
              </div>
              <div className="mt-2">
                <Link href="/reset-password">Forgot password?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicLoginPage;
