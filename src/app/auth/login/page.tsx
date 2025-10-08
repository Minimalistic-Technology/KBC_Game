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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    
    console.log("Simulating login for:", email);
    router.push('/admin');
  };

  return (
    <AuthLayout title="Admin Login">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Banner type="error" message={error} />}

        <Input label="Email Address" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        
        <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-600 invisible">Password</label> {/* Label provided by Input component, this is for spacing */}
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