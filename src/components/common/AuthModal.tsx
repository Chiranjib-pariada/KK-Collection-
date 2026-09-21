import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User as UserIcon, Phone, CheckCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from './BrandLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, currentUser } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please provide valid credentials.');
      return;
    }

    if (mode === 'register') {
      if (!fullName) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    // Process login or registration
    login(email, email.includes('admin') ? 'ADMIN' : 'CUSTOMER');
    setSuccessMsg(mode === 'login' ? 'Successfully authenticated!' : 'Welcome to KK COLLECTION Privilege Club!');
    setTimeout(() => {
      onClose();
      setSuccessMsg('');
    }, 600);
  };

  const handleQuickDemo = (role: 'CUSTOMER' | 'ADMIN') => {
    if (role === 'ADMIN') {
      login('admin@kkcollection.in', 'ADMIN');
    } else {
      login('ananya.sharma@example.com', 'CUSTOMER');
    }
    setSuccessMsg(`Switched to ${role === 'ADMIN' ? 'Admin Concierge' : 'Customer Account'}`);
    setTimeout(() => {
      onClose();
      setSuccessMsg('');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#EAE3DA] overflow-hidden">
        {/* Top Decorative Header */}
        <div className="bg-[#420A16] px-6 py-5 text-center relative border-b border-[#C5A059]/40">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#F3DEAB] hover:text-white p-1 rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex justify-center mb-1">
            <BrandLogo variant="light" size="sm" showTagline={false} />
          </div>
          <p className="font-serif italic text-xs text-[#F3DEAB] mt-1">
            {mode === 'login' ? 'Welcome Back to Your Heritage Vault' : 'Begin Your Drape Journey'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B1B] mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Radhika Roy"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#F4EFEA] border border-[#EAE3DA] rounded-lg focus:outline-none focus:border-[#7A142A]"
                    />
                    <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E1B1B] mb-1">Mobile Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#F4EFEA] border border-[#EAE3DA] rounded-lg focus:outline-none focus:border-[#7A142A]"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1E1B1B] mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F4EFEA] border border-[#EAE3DA] rounded-lg focus:outline-none focus:border-[#7A142A]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E1B1B] mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F4EFEA] border border-[#EAE3DA] rounded-lg focus:outline-none focus:border-[#7A142A]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#1E1B1B] mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#F4EFEA] border border-[#EAE3DA] rounded-lg focus:outline-none focus:border-[#7A142A]"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-2.5 bg-[#7A142A] hover:bg-[#9B1A36] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-colors"
            >
              {mode === 'login' ? 'Sign In to Account' : 'Create Customer Profile'}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-4 text-center text-xs text-gray-600">
            {mode === 'login' ? (
              <p>
                New to KK COLLECTION?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="font-semibold text-[#7A142A] hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-semibold text-[#7A142A] hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Credentials Switcher */}
          <div className="mt-6 pt-4 border-t border-[#EAE3DA]">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-center mb-2.5">
              Quick Prototype Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('CUSTOMER')}
                className="px-3 py-2 bg-[#F4EFEA] hover:bg-[#EAE3DA] text-[#1E1B1B] text-[11px] font-medium rounded-lg border border-[#EAE3DA] text-center transition-colors"
              >
                Sign in as Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className="px-3 py-2 bg-[#540D1E] hover:bg-[#7A142A] text-[#F3DEAB] text-[11px] font-semibold rounded-lg border border-[#C5A059]/40 text-center transition-colors"
              >
                Sign in as Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
