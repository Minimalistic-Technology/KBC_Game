'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import api from '@/lib/axios';
import Header from "@/components/Header";
import { getScreenBackground } from '@/lib/backgroundApi'; // Import the service

import { useSetAtom } from "jotai";
import { loggedInUserAtom } from "@/state/auth"; // <-- this is your role atom

type FormData = {
  userName: string;
  password: string;
};

const loginUser = async (credentials: FormData) => {
  // backend should expect { userName, password }
  const { data } = await api.post('/api/auth/login', credentials);
  return data;
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    userName: '',
    password: '',
  });
  const [bgUrl, setBgUrl] = useState<string>(''); // State for background URL

  const setLoggedInRole = useSetAtom(loggedInUserAtom);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success(data.message || 'Login successful!');

      // mark this session as "user"
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

  // Fetch background on mount
  useEffect(() => {
    getScreenBackground('login').then(result => {
      // Expecting result structure: { success: true, data: { screenName, mediaRef: { url, ... } } }
      // Adjust based on actual API response structure
      if (result?.data?.mediaRef?.url) {
        setBgUrl(result.data.mediaRef.url);
      } else if (result?.url) {
        // Fallback if structure is flat
        setBgUrl(result.url);
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userName.trim()) {
      toast.error("Username is required.");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required.");
      return;
    }

    mutation.mutate(formData);
  };

  return (

    <>
      <Header />
      <Toaster position="top-center" reverseOrder={false} />

      <div
        className="flex items-center justify-center min-h-screen pt-16 px-4 text-slate-900 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
          backgroundColor: bgUrl ? undefined : '#f8fafc' // Fallback color (slate-50)
        }}
      >
        {/* Overlay for better readability if background is present */}
        {bgUrl && <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-0" />}

        <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-8 z-10 relative">

          {/* Header */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Username */}
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="your_username"
                required
                className="w-full h-11 px-4 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin text-white" />
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

          {/* Footer */}
          <p className="text-center text-sm text-slate-600 mt-8">
            Don&apos;t have an account?{' '}
            <Link
              href="/user-registration"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
