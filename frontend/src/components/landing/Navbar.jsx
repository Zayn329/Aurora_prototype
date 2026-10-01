import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      openAuthModal('/dashboard');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-sky-50/95 via-blue-50/90 to-cyan-50/95 backdrop-blur-md z-50 shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        
        {/* Left Side Links - shifted to far left end */}
        <div className="hidden md:flex flex-1 items-center justify-start space-x-8 lg:space-x-10">
          <a 
            href="#overview" 
            className="text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors"
          >
            Overview
          </a>
          <a 
            href="#how-it-works" 
            className="text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors"
          >
            How It Works
          </a>
        </div>

        {/* Center: ARORA Logo from public folder logo.png */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <Link to="/" className="flex items-center group">
            <img 
              src="/logo.png" 
              alt="ARORA Logo" 
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105" 
            />
          </Link>
        </div>

        {/* Right Side Links & CTA - shifted to far right end */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-5">
          <a 
            href="#about" 
            className="text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors"
          >
            About
          </a>

          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-sky-100/70 hover:bg-sky-200/70 border border-sky-200/80 transition"
              >
                <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${user.avatarGradient || 'from-indigo-600 to-purple-600'} text-white font-bold text-[10px] flex items-center justify-center`}>
                  {user.initials || 'U'}
                </div>
                <span className="text-xs font-semibold text-slate-800">
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[10px] bg-sky-200/80 text-sky-900 font-mono px-1 rounded">
                  Console
                </span>
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGetStarted}
              className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-black rounded-lg transition shadow-sm hover:shadow active:scale-[0.98] flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-sky-100/60 transition ml-auto"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200/60 bg-gradient-to-b from-sky-50 via-blue-50/95 to-cyan-50 px-4 sm:px-8 pt-3 pb-6 space-y-3 shadow-md shadow-slate-900/5">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-800">
            <a 
              href="#overview" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-sky-100/70"
            >
              Overview
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-sky-100/70"
            >
              How It Works
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-sky-100/70"
            >
              About
            </a>
          </div>
          <div className="pt-3 border-t border-sky-200/60">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-sm font-semibold text-white bg-slate-900 rounded-lg shadow-sm flex items-center justify-center space-x-1.5 mr-2"
                >
                  <span>Go to Command Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="p-2 rounded-lg text-rose-600 bg-rose-50 border border-rose-200"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => { setMobileMenuOpen(false); handleGetStarted(e); }}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-black rounded-lg shadow-sm flex items-center justify-center space-x-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
