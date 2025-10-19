'use client';

import { useState } from 'react';
import AuthLayout from '../_components/AuthLayout';
import Link from 'next/link';
import Banner from '../_components/Banner';
import Input from '../_components/Input';
import axios from 'axios';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function ForgotPasswordPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <ForgotPasswordPage />
    </QueryClientProvider>
  );
}

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const forgotPassword = async () => {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/admins/password/forgot`,
      { email },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return data;
  };

  const { refetch, isFetching, isError, error: queryError, data } = useQuery({
    queryKey: ['forgot-password', email],
    queryFn: forgotPassword,
    enabled: false, 
    retry: false,
  });

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
      const result = await refetch();

      if (!result.data?.message) {
        setError('Something went wrong.');
        return;
      }

      setSuccess(
        'If an account with that email exists, a password reset link has been sent.'
      );
    } catch (err) {
      console.error(err);
      setError('Failed to send reset email. Please try again later.');
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {(error || (isError && queryError)) && (
          <Banner
            type="error"
            message={error || (queryError as any)?.response?.data?.message || 'Something went wrong'}
          />
        )}

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
          disabled={isFetching}
          className="w-full !mt-6 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isFetching ? 'Sending...' : 'Send Reset Link'}
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
