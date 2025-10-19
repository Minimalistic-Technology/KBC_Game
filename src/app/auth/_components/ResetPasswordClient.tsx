// app/auth/reset-password/ResetPasswordClient.tsx

'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthLayout from '../_components/AuthLayout';
import Banner from '../_components/Banner';
import Input from '../_components/Input';
import PasswordStrengthMeter from '../_components/PasswordStrengthMeter';

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); 
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
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

     try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/admins/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to reset password.');
        return;
      }

      setSuccess('Your password has been reset successfully! Redirecting...');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <AuthLayout title="Reset Your Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Banner type="error" message={error} />}
        {success && <Banner type="success" message={success} />}
        
        {!token && <Banner type="error" message="Invalid or missing reset token." />}

        <Input 
          label="New Password" 
          id="password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          disabled={!token} 
        />
        <PasswordStrengthMeter password={password} />
        <Input 
          label="Confirm New Password" 
          id="confirm" 
          type="password" 
          value={confirmPassword} 
          onChange={e => setConfirmPassword(e.target.value)} 
          required 
          disabled={!token} 
        />
        
        <button 
          type="submit" 
          className="w-full !mt-6 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400" 
          disabled={!token}
        >
          Reset Password
        </button>
      </form>
    </AuthLayout>
  );
}