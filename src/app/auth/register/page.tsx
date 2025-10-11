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
  const [banner, setBanner] = useState({ message: '', type: '' as 'success' | 'error' });

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
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBanner({ message: '', type: 'error' });
    
    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);
    const confirmError = validateField('confirm', confirmPassword);
    
    setErrors({ email: emailError, password: passwordError, confirm: confirmError });

    if (emailError || passwordError || confirmError) {
      return;
    }

    console.log("Simulating registration for:", email);
    setBanner({ message: "Registration successful! Please check your email to verify your account.", type: 'success' });
  };

  return (
    <AuthLayout title="Create Admin Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {banner.message && <Banner type={banner.type} message={banner.message} />}
        
        <Input label="Email Address" id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} onBlur={handleBlur} error={errors.email} required />
        <Input label="Password" id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} onBlur={handleBlur} error={errors.password} required />
        <PasswordStrengthMeter password={password} />
        <Input label="Confirm Password" id="confirm" name="confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onBlur={handleBlur} error={errors.confirm} required />
        
        <button type="submit" className="w-full !mt-6 p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
          Register
        </button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-indigo-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}