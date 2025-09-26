'use client';

import React from 'react';
import Link from 'next/link';

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="login-background d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 login-card">
        <div className="text-center mb-4">
          <img src="/brand.svg" alt="Brand Logo" style={{ width: '64px', height: '64px' }} className="mb-3" />
          <h2 className="text-center">Reset Password</h2>
        </div>
        <form>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="emailInput"
              placeholder="you@example.com"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Send Reset Link
          </button>
          <p className="text-center mt-3">
            Remember your password? <Link href="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
