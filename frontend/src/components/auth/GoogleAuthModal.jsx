import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { X, ChevronDown, UserPlus } from 'lucide-react';

export default function GoogleAuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    pendingRedirect,
    demoAccounts,
    loginWithDemoAccount,
    loginWithCredentials
  } = useAuth();

  const navigate = useNavigate();

  // 'chooser' | 'email' | 'password'
  const [screen, setScreen] = useState('chooser');
  const [email, setEmail] = useState('adinahawaldar@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(demoAccounts[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset when opened
  useEffect(() => {
    if (isAuthModalOpen) {
      setScreen('chooser');
      setEmail('adinahawaldar@gmail.com');
      setPassword('password123');
      setSelectedAccount(demoAccounts[0]);
      setIsLoading(false);
      setError('');
      setShowPassword(false);
    }
  }, [isAuthModalOpen, demoAccounts]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen && !isLoading) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, isLoading, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleAccountClick = async (acc) => {
    setError('');
    setSelectedAccount(acc);
    setEmail(acc.email);
    setIsLoading(true);

    try {
      await loginWithDemoAccount(acc);
      setTimeout(() => {
        navigate(pendingRedirect || '/dashboard');
      }, 500);
    } catch {
      setError('An error occurred during sign-in.');
      setIsLoading(false);
    }
  };

  const handleEmailNext = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Enter an email or phone number');
      return;
    }
    setError('');
    const matched = demoAccounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (matched) {
      setSelectedAccount(matched);
    }
    setScreen('password');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Enter a password');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await loginWithCredentials(email, password);
      setTimeout(() => {
        navigate(pendingRedirect || '/dashboard');
      }, 500);
    } catch {
      setError('Wrong password. Try again or click Forgot password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-[2px] font-sans antialiased animate-in fade-in duration-150">
      {/* Click outside to close (standard modal behavior) */}
      <div 
        className="absolute inset-0" 
        onClick={() => !isLoading && closeAuthModal()} 
      />

      {/* Main Google Login Window Card */}
      <div 
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[448px] bg-white rounded-[28px] border border-[#dadce0] shadow-[0_4px_24px_rgba(0,0,0,0.12)] overflow-hidden z-10 transition-all"
        style={{ fontFamily: "'Google Sans', Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif" }}
      >
        {/* Real Google Material Indeterminate Loading Bar */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#e8f0fe] overflow-hidden z-30">
            <div 
              className="h-full bg-[#0b57d0]"
              style={{
                width: '40%',
                animation: 'googleBar 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
              }}
            />
          </div>
        )}

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-full transition z-20"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Card Body */}
        <div className="px-8 sm:px-10 pt-9 pb-8">
          
          {/* Official Google Wordmark Logo */}
          <div className="mb-4">
            <img
              src="/google_logo.svg"
              alt="Google"
              className="h-6 w-auto block select-none"
            />
          </div>

          {/* ========================================================================= */}
          {/* SCREEN 1: REAL GOOGLE ACCOUNT CHOOSER (Sign in with Google)              */}
          {/* ========================================================================= */}
          {screen === 'chooser' && (
            <div>
              <h1 className="text-2xl font-normal text-[#202124] tracking-tight leading-8 mb-1">
                Choose an account
              </h1>
              <p className="text-base text-[#5f6368] mb-6 font-normal">
                to continue to <span className="font-medium text-[#202124]">Aurora</span>
              </p>

              {/* Real Google Account Items */}
              <div className="border-t border-b border-[#e0e0e0] divide-y divide-[#e0e0e0] -mx-8 sm:-mx-10 mb-6">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleAccountClick(acc)}
                    className="w-full text-left px-8 sm:px-10 py-3.5 hover:bg-[#f8f9fa] active:bg-[#f1f3f4] transition-colors flex items-center space-x-3.5 cursor-pointer disabled:opacity-60"
                  >
                    {/* Real Google Account Avatar Circle */}
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${acc.avatarGradient} text-white font-medium text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                      {acc.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#202124] truncate">
                        {acc.name}
                      </div>
                      <div className="text-xs text-[#5f6368] truncate">
                        {acc.email}
                      </div>
                    </div>
                  </button>
                ))}

                {/* Option to use another account / enter password */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setScreen('email')}
                  className="w-full text-left px-8 sm:px-10 py-3.5 hover:bg-[#f8f9fa] active:bg-[#f1f3f4] transition-colors flex items-center space-x-3.5 cursor-pointer text-[#202124]"
                >
                  <div className="w-9 h-9 rounded-full bg-[#f1f3f4] text-[#5f6368] flex items-center justify-center shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-medium text-[#202124]">
                    Use another account
                  </div>
                </button>
              </div>

              {/* Real Google Disclaimer text */}
              <p className="text-xs text-[#5f6368] leading-relaxed">
                To continue, Google will share your name, email address, language preference, and profile picture with Aurora. Before using this app, you can review Aurora’s{' '}
                <span className="text-[#0b57d0] hover:underline cursor-pointer">privacy policy</span> and{' '}
                <span className="text-[#0b57d0] hover:underline cursor-pointer">terms of service</span>.
              </p>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 2: REAL GOOGLE EMAIL INPUT SCREEN                                  */}
          {/* ========================================================================= */}
          {screen === 'email' && (
            <div>
              <h1 className="text-2xl font-normal text-[#202124] tracking-tight leading-8 mb-1">
                Sign in
              </h1>
              <p className="text-base text-[#5f6368] mb-6 font-normal">
                to continue to <span className="font-medium text-[#202124]">Aurora</span>
              </p>

              <form onSubmit={handleEmailNext} className="space-y-4">
                {/* Material Outlined Input */}
                <div className="relative">
                  <input
                    type="email"
                    id="google-email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    disabled={isLoading}
                    required
                    placeholder=" "
                    className="peer w-full px-4 pt-4 pb-2 text-base text-[#202124] bg-white border border-[#747775] rounded-[4px] focus:outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] transition-colors"
                  />
                  <label
                    htmlFor="google-email"
                    className="absolute text-[#5f6368] text-sm duration-150 transform -translate-y-2.5 scale-75 top-3.5 z-10 origin-[0] bg-white px-1 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5 peer-focus:text-[#0b57d0]"
                  >
                    Email or phone
                  </label>
                </div>

                {error && (
                  <p className="text-xs text-[#d93025] flex items-center space-x-1">
                    <span>{error}</span>
                  </p>
                )}

                <div className="pt-1">
                  <button
                    type="button"
                    className="text-sm font-medium text-[#0b57d0] hover:underline"
                    onClick={() => setEmail('adinahawaldar@gmail.com')}
                  >
                    Forgot email?
                  </button>
                </div>

                <div className="text-xs text-[#5f6368] leading-relaxed pt-4">
                  Not your computer? Use Guest mode to sign in privately.{' '}
                  <span className="text-[#0b57d0] hover:underline cursor-pointer">
                    Learn more
                  </span>
                </div>

                {/* Bottom Buttons */}
                <div className="pt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setScreen('chooser')}
                    className="text-sm font-medium text-[#0b57d0] hover:bg-[#f8fafd] px-3 py-2 rounded-full transition"
                  >
                    Back to accounts
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] active:bg-[#063b90] text-white text-sm font-medium rounded-full transition shadow-xs cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 3: REAL GOOGLE PASSWORD INPUT SCREEN                               */}
          {/* ========================================================================= */}
          {screen === 'password' && (
            <div>
              <h1 className="text-2xl font-normal text-[#202124] tracking-tight leading-8 mb-2">
                Welcome
              </h1>

              {/* User Account Pill Chip (Real Google style) */}
              <button
                type="button"
                onClick={() => setScreen('chooser')}
                className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full border border-[#dadce0] hover:bg-[#f8f9fa] transition text-sm text-[#3c4043] mb-6"
              >
                <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${selectedAccount?.avatarGradient || 'from-purple-600 to-indigo-600'} text-white text-[10px] font-medium flex items-center justify-center`}>
                  {selectedAccount?.initials || 'U'}
                </div>
                <span className="truncate max-w-[190px]">{email}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#5f6368]" />
              </button>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Outlined Material Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="google-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    disabled={isLoading}
                    required
                    placeholder=" "
                    className="peer w-full px-4 pt-4 pb-2 text-base text-[#202124] bg-white border border-[#747775] rounded-[4px] focus:outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] transition-colors"
                  />
                  <label
                    htmlFor="google-password"
                    className="absolute text-[#5f6368] text-sm duration-150 transform -translate-y-2.5 scale-75 top-3.5 z-10 origin-[0] bg-white px-1 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5 peer-focus:text-[#0b57d0]"
                  >
                    Enter your password
                  </label>
                </div>

                {error && (
                  <p className="text-xs text-[#d93025]">
                    {error}
                  </p>
                )}

                {/* Real Google "Show password" checkbox */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="show-password"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-4 h-4 text-[#0b57d0] rounded border-[#747775] focus:ring-[#0b57d0]"
                  />
                  <label htmlFor="show-password" className="text-sm text-[#202124] select-none cursor-pointer">
                    Show password
                  </label>
                </div>

                {/* Bottom Buttons */}
                <div className="pt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPassword('password123')}
                    className="text-sm font-medium text-[#0b57d0] hover:underline"
                  >
                    Forgot password?
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] active:bg-[#063b90] text-white text-sm font-medium rounded-full transition shadow-xs disabled:opacity-60 cursor-pointer"
                  >
                    {isLoading ? 'Verifying...' : 'Next'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Real Google Account Dialog Footer */}
        <div className="px-8 sm:px-10 py-3.5 bg-[#f8f9fa] border-t border-[#e0e0e0] flex items-center justify-between text-xs text-[#5f6368]">
          <div className="flex items-center space-x-1 cursor-pointer hover:text-[#202124]">
            <span>English (United States)</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-[#202124] cursor-pointer">Help</span>
            <span className="hover:text-[#202124] cursor-pointer">Privacy</span>
            <span className="hover:text-[#202124] cursor-pointer">Terms</span>
          </div>
        </div>

      </div>
    </div>
  );
}
