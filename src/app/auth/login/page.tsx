'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../_components/AuthLayout';
import Link from 'next/link';
import Input from '../_components/Input';
import Banner from '../_components/Banner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in both fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/admins/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', 
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Login successful
      console.log("Login success:", data.message);
      router.push('/admin');
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Admin Login">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Banner type="error" message={error} />}

        <Input label="Email Address" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        
        <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-600 invisible">Password</label> 
            <Link href="/auth/forgot-password" tabIndex={-1} className="text-sm text-indigo-600 hover:underline">Forgot password?</Link>
        </div>
        <Input label="Password" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        
        <button type="submit" className="w-full !mt-6 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
          Login
        </button>

         <p className="text-center text-sm text-slate-500">
          Need an account?{' '}
          <Link href="/auth/register" className="font-semibold text-indigo-600 hover:underline">
            Register now
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}