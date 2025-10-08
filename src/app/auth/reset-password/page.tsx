'use client';

import { useState } from 'react';
import AuthLayout from '../_components/AuthLayout';
import Link from 'next/link';
import Banner from '../_components/Banner';
import Input from '../_components/Input';
import PasswordStrengthMeter from '../_components/PasswordStrengthMeter';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Reads token from URL: ?token=...

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    console.log("Simulating password reset with token:", token);
    setSuccess("Your password has been reset successfully!");
    
    setTimeout(() => {
        router.push('/auth/login');
    }, 2000);
  };

  return (
    <AuthLayout title="Reset Your Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Banner type="error" message={error} />}
        {success && <Banner type="success" message={success} />}
        
        {!token && <Banner type="error" message="Invalid or missing reset token." />}

        <Input label="New Password" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={!token} />
        <PasswordStrengthMeter password={password} />
        <Input label="Confirm New Password" id="confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required disabled={!token} />
        
        <button type="submit" className="w-full !mt-6 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400" disabled={!token}>
          Reset Password
        </button>
      </form>
    </AuthLayout>
  );
}   