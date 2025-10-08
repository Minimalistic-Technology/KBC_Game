'use client';

import { useState } from 'react';
import AuthLayout from '../_components/AuthLayout';
import Link from 'next/link';
import Banner from '../_components/Banner';
import Input from '../_components/Input';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!/\S+@\S+\.\S+/.test(email)) {
          setError('Please enter a valid email address.');
          return;
        }

        console.log("Simulating password reset email for:", email);
        setSuccess("If an account with that email exists, a password reset link has been sent.");
    };

  return (
    <AuthLayout title="Forgot Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && <Banner type="success" message={success} />}
        <p className="text-sm text-slate-600 text-center">Enter your email and we'll send a link to reset your password.</p>
        
        <Input label="Email Address" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} error={error} required />
        
        <button type="submit" className="w-full !mt-6 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
          Send Reset Link
        </button>

         <p className="text-center text-sm text-slate-500">
          Remembered your password?{' '}
          <Link href="/auth/login" className="font-semibold text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}