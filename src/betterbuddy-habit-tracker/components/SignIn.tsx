import React, { useState } from 'react';

interface SignInProps {
  onSignIn: (email: string, phone: string) => void;
  onGuestLogin: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onGuestLogin }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(email, phone);
  };
  
  // A simple representation of the app's logo/icon using emoji
  const AppIcon = () => (
    <div className="text-6xl mb-4" role="img" aria-label="BetterBuddy Icon">
        <span className="inline-block -rotate-12">🐶</span>
        <span className="inline-block scale-125 z-10 relative -mx-2">🐱</span>
        <span className="inline-block rotate-12">🦅</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 text-center">
        <AppIcon />
        <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
        <p className="text-slate-400 mb-8">Sign in to continue your journey.</p>
        
        <form onSubmit={handleSignInSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-slate-400"
              required
              aria-label="Email Address"
            />
          </div>
          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-slate-400"
              required
              aria-label="Phone Number"
            />
          </div>
          <button
            type="submit"
            disabled={!email || !phone}
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
          >
            Sign In
          </button>
        </form>
        
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-slate-600"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-sm">OR</span>
          <div className="flex-grow border-t border-slate-600"></div>
        </div>
        
        <button
          onClick={onGuestLogin}
          className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-700 transition-transform transform hover:scale-105"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default SignIn;
