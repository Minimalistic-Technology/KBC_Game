'use client';

import { useState } from 'react';
import AuthLayout from '../_components/AuthLayout';
import Link from 'next/link';
import Banner from '../_components/Banner';
import Input from '../_components/Input';
import PasswordStrengthMeter from '../_components/PasswordStrengthMeter';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', confirm: '' });
  const [banner, setBanner] = useState<{ message: string; type: 'success' | 'error' | '' }>({
    message: '',
    type: '',
  });
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner({ message: '', type: '' });
    setLoading(true);

    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);
    const confirmError = validateField('confirm', confirmPassword);
    setErrors({ email: emailError, password: passwordError, confirm: confirmError });

    if (emailError || passwordError || confirmError) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/auth/admins/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBanner({ message: data.message || 'Registration failed.', type: 'error' });
      } else {
        setBanner({
          message: 'Registration successful! Please check your email to verify your account.',
          type: 'success',
        });
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error(error);
      setBanner({ message: 'Something went wrong. Try again later.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Admin Account">
      {/* Always show the banner if present */}
      {banner.message && banner.type && (
        <Banner type={banner.type as 'success' | 'error'} message={banner.message} />
      )}

      {/* Hide form when registration is successful */}
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
            disabled={loading}
            className="w-full !mt-6 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
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

/*
'use client';

import React, { useState } from 'react';
import AuthLayout from '../_components/AuthLayout';
import Link from 'next/link';
import Banner from '../_components/Banner';
import Input from '../_components/Input';
import PasswordStrengthMeter from '../_components/PasswordStrengthMeter';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', confirm: '' });
  const [banner, setBanner] = useState<{ message: string; type: 'success' | 'error' | '' }>({
    message: '',
    type: '',
  });
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // ✅ simple client-side validation
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner({ message: '', type: '' });
    setLoading(true);

    // ✅ validate all fields
    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);
    const confirmError = validateField('confirm', confirmPassword);
    setErrors({ email: emailError, password: passwordError, confirm: confirmError });

    if (emailError || passwordError || confirmError) {
      setLoading(false);
      return;
    }

    try {
      // ✅ Backend API call
      const res = await fetch('http://localhost:5000/auth/admins/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBanner({ message: data.message || 'Registration failed.', type: 'error' });
      } else {
        // ✅ show verification link section
        setBanner({
          message: 'Registration successful! Please check your email to verify your account.',
          type: 'success',
        });
        setRegistrationSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setBanner({ message: 'Something went wrong. Try again later.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ only for simulation (local verify link)
  const verificationToken = 'simulated-jwt-token-for-testing-12345';
  const verificationLink = `/auth/verify-email?token=${verificationToken}`;

  return (
    <AuthLayout title="Create Admin Account">
      {registrationSuccess ? (
        <div className="text-center space-y-4">
          <Banner type="success" message={banner.message} />
          <p className="text-slate-600">A verification link has been sent to your email. (Simulated)</p>
          <p className="text-slate-600">Click the link below to verify your account:</p>
          <a
            href={verificationLink}
            className="inline-block w-full mt-4 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 no-underline"
          >
            Verify Email
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {banner.message && banner.type && (
            <Banner type={banner.type as 'success' | 'error'} message={banner.message} />
          )}

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
            disabled={loading}
            className="w-full !mt-6 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-70"
          >
            {loading ? 'Registering...' : 'Register'}
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
*/