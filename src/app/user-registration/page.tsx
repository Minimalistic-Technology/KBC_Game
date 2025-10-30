'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import api from '@/lib/axios'; // Adjust the import path if needed

// --- TYPES ---
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

// --- API FUNCTION ---
const registerUser = async (userData: Omit<FormData, 'confirmPassword'>) => {
  const { data } = await api.post('/api/users/register', userData);
  return data;
};


// --- COMPONENT ---
export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
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
      // **UPDATED**: Changed the success message and redirect path
      toast.success('Registration successful! Please log in.');
      setTimeout(() => {
        router.push('/login'); // Redirects to the login page now
      }, 1500);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      toast.error(errorMessage);
    },
  });


  const validate = () => {
    const newErrors: FormErrors = {};

    if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = 'Please enter a valid first name.';
    }
    if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Please enter a valid last name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }
    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
      newErrors.age = 'Please enter a valid age (5-100).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const { confirmPassword, ...payload } = formData;
      mutation.mutate(payload);
    }
  };

  const getInputClass = (fieldName: keyof FormErrors) => {
    const baseClass = "w-full h-11 px-4 border bg-slate-50 border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2";
    return errors[fieldName]
      ? `${baseClass} border-red-500 ring-red-500 focus:ring-red-500`
      : `${baseClass} focus:ring-indigo-500`;
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          
          <div className="text-center mb-8">
              <div className="mx-auto bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <UserPlus className="text-indigo-600" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
              Create Your Account
              </h1>
              <p className="text-slate-600 mt-2">
              Enter your details to get started.
              </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input
                  type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className={getInputClass('firstName')} placeholder="First Name"
                />
                {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input
                  type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className={getInputClass('lastName')} placeholder="Last Name"
                />
                {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={getInputClass('email')} placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                 <div className="relative">
                   <input
                     type={showPassword ? "text" : "password"}
                     id="password" name="password"
                     value={formData.password} onChange={handleChange} required
                     className={getInputClass('password')} placeholder="••••••••"
                   />
                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                     {showPassword ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
                   </button>
                 </div>
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <input
                  type="password" id="confirmPassword" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange} required
                  className={getInputClass('confirmPassword')} placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Phone & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone No.</label>
                <div className={`flex items-center w-full h-11 border bg-slate-50 border-slate-300 rounded-lg focus-within:ring-2 transition-all ${errors.phone ? 'border-red-500 ring-red-500 focus-within:ring-red-500' : 'focus-within:ring-indigo-500'}`}>
                  <span className="px-3 text-slate-500 border-r border-slate-300">+91</span>
                  <input
                    type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required pattern="\d{10}" maxLength={10} title="Please enter a valid 10-digit Indian mobile number" className="w-full h-full px-4 bg-transparent border-none rounded-r-lg text-slate-900 focus:outline-none" placeholder="9876543210"
                  />
                </div>
                {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                <input
                  type="number" id="age" name="age" value={formData.age} onChange={handleChange} required min="1" className={getInputClass('age')} placeholder="18"
                />
                {errors.age && <p className="text-red-600 text-xs mt-1">{errors.age}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={mutation.isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Register</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}