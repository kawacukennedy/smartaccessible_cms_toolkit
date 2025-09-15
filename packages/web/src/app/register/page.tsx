'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNotifications } from '@/contexts/NotificationContext';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      addNotification({ displayType: 'toast', style: 'error', message: 'Passwords do not match.' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.storyblok-ai.example/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification({ displayType: 'toast', style: 'success', message: 'Registration successful! Please log in.' });
        router.push('/login');
      } else {
        throw new Error(data.message || 'Registration failed.');
      }
    } catch (error: any) {
      addNotification({ displayType: 'toast', style: 'error', message: error.message || 'Network error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 login-card">
        <div className="text-center mb-4">
          <img src="/brand.svg" alt="Brand Logo" style={{ width: '64px', height: '64px' }} className="mb-3" />
          <h2 className="text-center">Create an Account</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nameInput" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="nameInput"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="emailInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              placeholder="••••••••"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPasswordInput"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
          <p className="text-center mt-3">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
