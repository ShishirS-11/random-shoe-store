'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert('Error logging in: ' + error.message);
    } else {
      window.location.href = '/admin/dashboard';
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg w-full max-w-sm">
        <h1 className="text-white text-3xl font-bold mb-6">Admin Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-gray-700 rounded text-white"
          required
        />
        <button type="submit" className="w-full p-3 bg-indigo-600 rounded font-bold text-white hover:bg-indigo-500">
          Log In
        </button>
      </form>
    </div>
  );
}