'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowRight } from 'lucide-react';

// Define a type for the error state for better type safety
type FormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  age?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

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
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }
    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
      newErrors.age = 'Please enter a valid age (5-100).';
    }

    setErrors(newErrors);
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for the field as user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form Submitted:', { ...formData, phone: `+91${formData.phone}` });
      router.push('/play');
    }
  };

  // Helper function to apply error styles
  const getInputClass = (fieldName: keyof FormErrors) => {
    const baseClass = "w-full h-11 px-4 border bg-slate-50 border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2";
    return errors[fieldName]
      ? `${baseClass} border-red-500 ring-red-500 focus:ring-red-500`
      : `${baseClass} focus:ring-indigo-500`;
  };

  return (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
              <input
                type="text" id="firstName" name="firstName"
                value={formData.firstName} onChange={handleChange}
                required className={getInputClass('firstName')} placeholder="First Name"
              />
              {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              <input
                type="text" id="lastName" name="lastName"
                value={formData.lastName} onChange={handleChange}
                required className={getInputClass('lastName')} placeholder="Last Name"
              />
              {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email" id="email" name="email"
              value={formData.email} onChange={handleChange}
              required className={getInputClass('email')} placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone No.</label>
              <div className={`flex items-center w-full h-11 border bg-slate-50 border-slate-300 rounded-lg focus-within:ring-2 transition-all ${errors.phone ? 'border-red-500 ring-red-500 focus-within:ring-red-500' : 'focus-within:ring-indigo-500'}`}>
                <span className="px-3 text-slate-500 border-r border-slate-300">+91</span>
                <input
                  type="tel" id="phone" name="phone"
                  value={formData.phone} onChange={handleChange}
                  required pattern="[6-9][0-9]{9}" maxLength={10}
                  title="Please enter a valid 10-digit Indian mobile number"
                  className="w-full h-full px-4 bg-transparent border-none rounded-r-lg text-slate-900 focus:outline-none"
                  placeholder="9876543210"
                />
              </div>
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-2">Age</label>
              <input
                type="number" id="age" name="age"
                value={formData.age} onChange={handleChange}
                required min="1"
                className={getInputClass('age')} placeholder="18"
              />
              {errors.age && <p className="text-red-600 text-xs mt-1">{errors.age}</p>}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-transform hover:scale-105 mt-6"
          >
            <span>Register</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}