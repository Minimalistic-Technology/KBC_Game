

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import api from '@/lib/axios';
import Header from "@/components/Header";

import { useSetAtom } from "jotai";
import { loggedInUserAtom } from "@/state/auth"; // <-- this is your role atom

type FormData = {
  email: string;
  password: string;
};

const loginUser = async (credentials: FormData) => {
  const { data } = await api.post('/api/auth/login', credentials);
  return data;
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  // ✅ we only set the role atom
  const setLoggedInRole = useSetAtom(loggedInUserAtom);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success(data.message || 'Login successful!');

      // ✅ mark this session as "user"
      setLoggedInRole("user");

      setTimeout(() => {
        router.push('/play');
      }, 1000);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred.';
      toast.error(errorMessage);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <>
      <Header />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex items-center justify-center min-h-screen bg-slate-50 pt-16">
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
                type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                required
                className="w-full h-11 px-4 border bg-slate-50 border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              {/* "Forgot password?" link has been removed from here */}
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
              </label>
              <input
                type="password" id="password" name="password"
                value={formData.password} onChange={handleChange}
                required
                className="w-full h-11 px-4 border bg-slate-50 border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={mutation.isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
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
    </>
  );
}