'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message); // This will display the error!
    } else {
      window.location.href = '/admin/dashboard';
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-extrabold uppercase tracking-widest mb-8">RANDOM - ADMIN</h1>
      <form onSubmit={handleLogin} className="bg-brand-gray p-8 rounded-lg w-full max-w-sm shadow-2xl">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Administrator Login</h2>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded text-white border-2 border-transparent focus:outline-none focus:border-brand-purple"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded text-white border-2 border-transparent focus:outline-none focus:border-brand-purple"
            required
          />
        </div>
        
        {error && (
          <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-sm text-center">{error}</p>
        )}
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full p-3 bg-brand-purple rounded font-bold text-white hover:bg-opacity-80 transition-all disabled:bg-gray-500"
        >
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}