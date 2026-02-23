'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import api from '@/lib/axios';

type FormData = {
  firstName: string;
  lastName: string;
  userName: string;
  email?: string;
  phone?: string;
  age: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

const registerUser = async (userData: Omit<FormData, 'confirmPassword'>) => {
  const payload: any = {
    ...userData,
    age: parseInt(userData.age, 10),
  };

  if (!payload.email) delete payload.email;
  if (!payload.phone) delete payload.phone;

  const { data } = await api.post('/api/users/register', payload);
  return data;
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phone: '',
    age: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data?.message || 'Registration successful!');
      setTimeout(() => router.push('/login'), 1500);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    },
  });

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'Please enter a valid first name.';
    }

    if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Please enter a valid last name.';
    }

    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required.';
    } else if (!/^[a-zA-Z0-9_.-]{3,}$/.test(formData.userName.trim())) {
      newErrors.userName = 'Username must be at least 3 characters.';
    }

    // OPTIONAL email --> validate only if entered
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }

    // OPTIONAL phone --> validate only if entered
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
      newErrors.age = 'Age must be between 5 and 100.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const { confirmPassword, ...payload } = formData;
      mutation.mutate(payload);
    }
  };

  const inputClasses = (field: keyof FormErrors) =>
    `w-full h-11 px-4 bg-slate-50 border rounded-lg focus:ring-2 
    ${errors[field] ? 'border-red-500 ring-red-500' : 'border-slate-300 focus:ring-indigo-500'}`;

  return (
    <>
      <Toaster />

      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-4 sm:p-8 border border-slate-200">

          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <UserPlus size={32} className="text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Create Your Account</h1>
            <p className="text-slate-600 mt-2">Fill in your details to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} className={inputClasses('firstName')} />
                {errors.firstName && <p className="text-red-600 text-xs">{errors.firstName}</p>}
              </div>

              <div>
                <label className="text-sm font-medium">Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} className={inputClasses('lastName')} />
                {errors.lastName && <p className="text-red-600 text-xs">{errors.lastName}</p>}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="text-sm font-medium">Username</label>
              <input name="userName" value={formData.userName} onChange={handleChange} className={inputClasses('userName')} />
              {errors.userName && <p className="text-red-600 text-xs">{errors.userName}</p>}
            </div>

            {/* OPTIONAL Email */}
            <div>
              <label className="text-sm font-medium">Email (Optional)</label>
              <input name="email" value={formData.email} onChange={handleChange} className={inputClasses('email')} placeholder="you@email.com" />
              {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClasses('password')}
                  />
                  <button type="button" className="absolute right-3 top-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-xs">{errors.password}</p>}
              </div>

              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className={inputClasses('confirmPassword')} />
                {errors.confirmPassword && <p className="text-red-600 text-xs">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* OPTIONAL Phone */}
            <div>
              <label className="text-sm font-medium">Phone (Optional)</label>
              <input name="phone" maxLength={10} value={formData.phone} onChange={handleChange} className={inputClasses('phone')} placeholder="9876543210" />
              {errors.phone && <p className="text-red-600 text-xs">{errors.phone}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="text-sm font-medium">Age</label>
              <input name="age" type="number" value={formData.age} onChange={handleChange} className={inputClasses('age')} placeholder="18" />
              {errors.age && <p className="text-red-600 text-xs">{errors.age}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:scale-105 transition disabled:opacity-50"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Register'}
              <ArrowRight />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
