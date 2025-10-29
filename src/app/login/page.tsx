'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to an authentication API.
    console.log('Login Attempt:', formData);
    // On successful login, redirect to the game lobby.
    router.push('/play');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        
        <div className="text-center mb-8">
            <div className="mx-auto bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <LogIn className="text-indigo-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
                Welcome Back
            </h1>
            <p className="text-slate-600 mt-2">
                Sign in to continue to your account.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full h-11 px-4 border bg-slate-50 border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                </label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:underline">
                    Forgot password?
                </a>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full h-11 px-4 border bg-slate-50 border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-transform hover:scale-105"
          >
            <span>Sign In</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-8">
          Don't have an account?{' '}
          <Link href="/user-registration" className="font-semibold text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}