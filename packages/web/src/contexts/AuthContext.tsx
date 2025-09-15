'use client';

import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
  isLoggedIn: boolean;
  user: { username: string } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state from cookie on mount
    const loggedIn = Cookies.get('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      // In a real app, you'd fetch user details from an API
      setUser({ username: 'admin' }); // Placeholder user
    }
  }, []);

  // Mock login function
  const login = useCallback(async (username, password) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'password') {
          setIsLoggedIn(true);
          setUser({ username });
          Cookies.set('isLoggedIn', 'true', { expires: 7 }); // Set cookie for 7 days
          resolve();
        } else {
          reject(new Error('Invalid username or password'));
        }
      }, 500);
    });
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    Cookies.remove('isLoggedIn'); // Remove cookie
    router.push('/login');
  }, [router]);

  const value = useMemo(
    () => ({ isLoggedIn, user, login, logout }),
    [isLoggedIn, user, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
