'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Enforce specific admin credentials
    if (username === 'admin' && password === 'admin123') {
      console.log('Admin login successful, redirecting...');
      router.push('/admin');
    } else {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
            <ChevronLeft size={20} />
            Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-8 space-y-6 bg-white rounded-2xl shadow-xl"
          >
            <h2 className="text-3xl font-bold text-center text-slate-800">
              Admin Login
            </h2>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="username" className="text-sm font-medium text-slate-600">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium text-slate-600">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-4 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all"
                >
                  Login
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </>
  );
}