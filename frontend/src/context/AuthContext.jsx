import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_ACCOUNTS = [
  {
    id: 'commander-1',
    name: 'Adina Hawaldar',
    email: 'adinahawaldar@gmail.com',
    role: 'Expedition Commander',
    station: 'Maitri Research Base',
    initials: 'AH',
    avatarGradient: 'from-purple-600 to-indigo-600',
    demoPassword: 'password123'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('aurora_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState('/dashboard');

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('aurora_auth_user', JSON.stringify(user));
      } catch (e) {
        console.error('Failed to store auth user', e);
      }
    } else {
      localStorage.removeItem('aurora_auth_user');
    }
  }, [user]);

  const openAuthModal = (redirectPath = '/dashboard') => {
    setPendingRedirect(redirectPath);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginWithDemoAccount = async (account) => {
    // Simulated realistic authentication latency
    await new Promise((resolve) => setTimeout(resolve, 850));
    setUser(account);
    setIsAuthModalOpen(false);
    return account;
  };

  const loginWithCredentials = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 950));
    
    // Look up matching demo account or create authenticated session
    const matched = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );

    const authenticatedUser = matched || {
      id: 'custom-' + Date.now(),
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Expedition Member',
      email: email.trim(),
      role: 'Operations Specialist',
      station: 'Maitri Research Base',
      initials: email.slice(0, 2).toUpperCase(),
      avatarGradient: 'from-blue-600 to-slate-700'
    };

    setUser(authenticatedUser);
    setIsAuthModalOpen(false);
    return authenticatedUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aurora_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        pendingRedirect,
        openAuthModal,
        closeAuthModal,
        loginWithDemoAccount,
        loginWithCredentials,
        logout,
        demoAccounts: DEMO_ACCOUNTS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
