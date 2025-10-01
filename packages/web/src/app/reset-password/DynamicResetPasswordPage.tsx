'use client';

import React from 'react';
import Link from 'next/link';

const DynamicResetPasswordPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/brand.svg" alt="Brand Logo" className="w-16 h-16 mx-auto mb-3" />
          <h2 className="text-2xl font-bold">Reset Password</h2>
        </div>
        <form className="space-y-4">
          <div>
            <label htmlFor="emailInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              id="emailInput"
              placeholder="you@example.com"
              required
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 rounded-md bg-primary text-white hover:bg-opacity-80">
            Send Reset Link
          </button>
          <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
            Remember your password? <Link href="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default DynamicResetPasswordPage;
