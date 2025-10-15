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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/admins/password/forgot`, {  //
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong');
      } else {
        setSuccess('If an account with that email exists, a password reset link has been sent.');
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again later.');
      console.error(err);
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Banner type="error" message={error} />}
        {success && <Banner type="success" message={success} />}
        <p className="text-sm text-slate-600 text-center">
          Enter your email and we’ll send a link to reset your password.
        </p>

        <Input
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          required
        />

        <button
          type="submit"
          className="w-full !mt-6 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
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