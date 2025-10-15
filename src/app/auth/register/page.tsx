'use client';

import { useState } from 'react';
import AuthLayout from '../_components/AuthLayout';
import Link from 'next/link';
import Banner from '../_components/Banner';
import Input from '../_components/Input';
import PasswordStrengthMeter from '../_components/PasswordStrengthMeter';

import axios from 'axios';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RegisterPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <RegisterPage />
    </QueryClientProvider>
  );
}

 function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', confirm: '' });
  const [banner, setBanner] = useState<{ message: string; type: 'success' | 'error' | '' }>({
    message: '',
    type: '',
  });
  

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email address.';
        break;
      case 'password':
        if (value.length < 8) return 'Password must be at least 8 characters.';
        break;
      case 'confirm':
        if (value !== password) return 'Passwords do not match.';
        break;
    }
    return '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const registerAdmin = async () => {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_DEV}/auth/admins/register`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return data;
  };

  const { refetch, isFetching, isError, error, data } = useQuery({
    queryKey: ['register', email],
    queryFn: registerAdmin,
    enabled: false,
    retry: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner({ message: '', type: '' });

    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);
    const confirmError = validateField('confirm', confirmPassword);
    setErrors({ email: emailError, password: passwordError, confirm: confirmError });

    if (emailError || passwordError || confirmError) return;

    try {
      const result = await refetch();

      if (!result.data?.message) {
        setBanner({ message: 'Registration failed.', type: 'error' });
        return;
      }

      setBanner({
        message: 'Registration successful! Please check your email to verify your account.',
        type: 'success',
      });

      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setBanner({ message: 'Something went wrong. Try again later.', type: 'error' });
    }
  };

  return (
    <AuthLayout title="Create Admin Account">
      {(banner.message && banner.type) && (
        <Banner type={banner.type as 'success' | 'error'} message={banner.message} />
      )}

      {banner.type !== 'success' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleBlur}
            error={errors.email}
            required
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handleBlur}
            error={errors.password}
            required
          />
          <PasswordStrengthMeter password={password} />
          <Input
            label="Confirm Password"
            id="confirm"
            name="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={handleBlur}
            error={errors.confirm}
            required
          />

         
          <button
            type="submit"
            disabled={isFetching}
            className="w-full !mt-6 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isFetching ? 'Registering...' : 'Register'}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-indigo-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}