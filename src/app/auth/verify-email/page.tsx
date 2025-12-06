'use client';

import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { Gamepad2, CheckCircle, AlertTriangle, Loader } from 'lucide-react';

function Banner({ message, type }: { message: string, type: 'success' | 'error' }) {
  if (!message) return null;
  const isSuccess = type === 'success';
  return (
    <div className={`p-4 rounded-md flex items-center gap-3 ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {isSuccess ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
}

function AuthLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="flex items-center justify-center gap-2 text-decoration-none">
            <Gamepad2 className="text-indigo-600" size={32} />
            <h1 className="text-3xl font-bold text-slate-800">QuizMaster</h1>
          </a>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">{title}</h2>
          {children}
        </div>
      </div>
    </main>
  );
}

function useQuery() {
  if (typeof window === 'undefined') return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

function VerifyEmailComponent() {
  const query = useQuery();
  const token = query.get('token'); 
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/admins/verify`, {
    params: { token },
  });
        if (res.status === 200) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    };

    verifyToken();
  }, [token]);

  const renderStatus = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Loader className="animate-spin text-indigo-600" size={48} />
            <p className="text-slate-600 font-semibold">Verifying your email...</p>
            <p className="text-sm text-slate-500">Please wait a moment.</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center space-y-4">
            <Banner type="success" message="Email verified successfully!" />
            <p className="text-slate-600">Your account is now active. You can proceed to log in.</p>
            <a href="/auth/login" className="inline-block w-full mt-4 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 no-underline">
              Go to Login
            </a>
          </div>
        );
      case 'error':
        return (
          <div className="text-center space-y-4">
            <Banner type="error" message="Verification failed. The token may be invalid or expired." />
            <p className="text-slate-600">Please try registering again or contact support if the issue persists.</p>
            <a href="/auth/register" className="inline-block w-full mt-4 p-3 font-semibold text-white bg-slate-600 rounded-lg hover:bg-slate-700 no-underline">
              Back to Register
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout title="Email Verification">
      <div className="min-h-[150px] flex items-center justify-center">{renderStatus()}</div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailComponent />
    </Suspense>
  );
}
