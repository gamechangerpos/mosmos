import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, User, ArrowRight, Compass, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthPageProps {
  onNavigate: (path: string) => void;
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, initialMode = 'login' }) => {
  const { user, loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to account page
  if (user) {
    onNavigate('/account');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        onNavigate('/account');
      } else if (mode === 'register') {
        if (!name.trim()) {
          throw new Error('Please provide your full name.');
        }
        await registerWithEmail(email, password, name);
        onNavigate('/account');
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          throw new Error('Please enter your email address.');
        }
        await resetPassword(email);
        setSuccessMessage('Password reset link sent! Check your inbox.');
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'An error occurred during authentication.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        msg = 'Invalid email or password.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email address already exists.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      onNavigate('/account');
    } catch (err: any) {
      console.error(err);
      if (!err.message?.includes('popup-closed-by-user')) {
        setError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#F7F4ED] min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full bg-white border border-[#D9D0C2] p-8 sm:p-10 shadow-lg relative">
        
        {/* Overline & Header */}
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#78634B] font-semibold block mb-2">
            MOS MOS Safaris Guest Portal
          </span>
          <h1 className="font-serif text-3xl font-light text-[#20221F]">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h1>
          <p className="text-xs text-[#20221F]/60 font-light mt-2 leading-relaxed">
            {mode === 'login' && 'Sign in to review custom itineraries, track gorilla permits, and view quotations.'}
            {mode === 'register' && 'Join MOS MOS Safaris to manage your safari expeditions and private proposals.'}
            {mode === 'forgot' && 'Enter your registered email to receive secure recovery instructions.'}
          </p>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        {mode !== 'forgot' && (
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-3 px-4 border border-[#D9D0C2] bg-white hover:bg-[#F7F4ED] text-[#20221F] text-xs font-medium flex items-center justify-center gap-3 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D9D0C2]" />
              </div>
              <span className="relative bg-white px-3 text-[10px] uppercase tracking-wider text-[#20221F]/40 font-semibold">
                Or with email
              </span>
            </div>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 pl-9 text-[#20221F] text-xs focus:outline-none focus:border-[#20221F]"
                />
                <User className="w-4 h-4 text-[#78634B] absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="guest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 pl-9 text-[#20221F] text-xs focus:outline-none focus:border-[#20221F]"
              />
              <Mail className="w-4 h-4 text-[#78634B] absolute left-3 top-2.5" />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] uppercase tracking-wider text-[#20221F]/70 font-semibold">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-[10px] text-[#78634B] hover:text-[#20221F] transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3.5 py-2.5 pl-9 text-[#20221F] text-xs focus:outline-none focus:border-[#20221F]"
                />
                <Lock className="w-4 h-4 text-[#78634B] absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#20221F] hover:bg-[#78634B] text-[#F7F4ED] text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>
              {isSubmitting
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In to Portal'
                : mode === 'register'
                ? 'Create Guest Account'
                : 'Send Reset Link'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-8 pt-6 border-t border-[#D9D0C2] text-center text-xs text-[#20221F]/70">
          {mode === 'login' ? (
            <p>
              New guest to MOS MOS Safaris?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className="font-semibold text-[#78634B] hover:text-[#20221F] transition-colors underline ml-1 cursor-pointer"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className="font-semibold text-[#78634B] hover:text-[#20221F] transition-colors underline ml-1 cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
