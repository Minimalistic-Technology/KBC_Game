'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '../_components/AuthLayout';
import Link from 'next/link';
import Input from '../_components/Input';
import Banner from '../_components/Banner';

import axios from 'axios';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function LoginPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginPage />
    </QueryClientProvider>
  );
}

  function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


   const loginAdmin = async () => {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/admins/login`,
      { email, password },
      { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
    );
    return data;
  };

  const { data, isFetching, isError, error: queryError, refetch } = useQuery({
    queryKey: ['login', email],
    queryFn: loginAdmin,
    enabled: false, // prevent auto fetch on mount
    retry: false,
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      
      const result = await refetch();

      if (result.data?.message) {
        console.log("Login success:", result.data.message);
        router.push('/admin');
      } else {
        setError(result.data?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      console.error(err);
    }

  };

  return (
    <AuthLayout title="Admin Login">
      <form onSubmit={handleSubmit} className="space-y-4">
  
        {(error || (isError && queryError)) && (
          <Banner
            type="error"
            message={error || (queryError as any)?.response?.data?.message || "Login failed"}
          />
        )}

        <Input label="Email Address" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        
        <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-600 invisible">Password</label> 
            <Link href="/auth/forgot-password" tabIndex={-1} className="text-sm text-indigo-600 hover:underline">Forgot password?</Link>
        </div>
        <Input label="Password" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        
        <button type="submit" className="w-full !mt-6 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700" disabled={isFetching}>
          {isFetching ? "Logging in..." : "Login"}
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