'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Save, RefreshCw, Info, ArrowLeft } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';
import ManagePinLayout from '../_components/ManagePinLayout';
import { useRouter } from 'next/navigation';

export default function CreatePinPage() {
  const router = useRouter();
  const [pinConfig, setPinConfig] = useState<(number | null)[]>([null, null, null, null]);
  const [currentPin, setCurrentPin] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch current PIN configuration on mount
  useEffect(() => {
    fetchPinConfig();
  }, []);

  const fetchPinConfig = async () => {
    try {
      setIsFetching(true);
      const res = await axiosInstance.get('/api/pin/config', { withCredentials: true });
      if (res.data.success) {
        setPinConfig(res.data.pinConfig);
        setCurrentPin(res.data.currentPin);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch PIN configuration');
    } finally {
      setIsFetching(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (value === '') {
      // Empty = use auto-generated (null)
      const newConfig = [...pinConfig];
      newConfig[index] = null;
      setPinConfig(newConfig);
    } else if (/^\d$/.test(value)) {
      // Single digit 0-9
      const newConfig = [...pinConfig];
      newConfig[index] = parseInt(value);
      setPinConfig(newConfig);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post('/api/pin/config', { pinConfig }, { withCredentials: true });
      if (res.data.success) {
        toast.success('PIN configuration saved successfully');
        setCurrentPin(res.data.currentPin);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save PIN configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPinConfig([null, null, null, null]);
  };

  const getDigitLabel = (index: number): string => {
    const labels = ['Day (tens)', 'Day (units)', 'Month (tens)', 'Month (units)'];
    return labels[index];
  };

  const getPlaceholder = (index: number): string => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const placeholders = [day[0], day[1], month[0], month[1]];
    return placeholders[index];
  };

  if (isFetching) {
    return (
      <ManagePinLayout
        cardTitle="Configure PIN"
        cardDescription="Loading configuration..."
      >
        <div className="animate-pulse">
          <div className="h-32 bg-slate-100 rounded"></div>
        </div>
      </ManagePinLayout>
    );
  }

  return (
    <ManagePinLayout
      cardTitle="Configure PIN"
      cardDescription="Set up your dynamic admin PIN with date-based generation"
    >
      {/* Back to Dashboard Button */}
      <button
        onClick={() => router.push('/admin')}
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">How it works:</p>
          <p>
            The PIN is automatically generated using the current date in{' '}
            <span className="font-mono font-semibold">DD-MM</span> format.
            You can hardcode any digit to a fixed value (0-9), and the rest will use the date.
          </p>
          <p className="mt-2">
            <span className="font-semibold">Example:</span> If you set the 2nd digit to{' '}
            <span className="font-mono">9</span> and today is <span className="font-mono">22-04</span>,
            the PIN will be <span className="font-mono font-semibold">2904</span>.
          </p>
        </div>
      </div>

      {/* Current PIN Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
        <p className="text-sm text-slate-700 mb-2">Current PIN (today):</p>
        <p className="text-3xl font-bold font-mono text-indigo-600 tracking-wider">{currentPin}</p>
      </div>

      {/* PIN Digit Configuration */}
      <div className="space-y-4 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Configure PIN Digits
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {pinConfig.map((digit, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-xs font-medium text-slate-600 mb-2">
                Digit {index + 1}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={digit !== null ? digit : ''}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  placeholder={getPlaceholder(index)}
                  maxLength={1}
                  className="w-full h-16 text-center text-2xl font-mono font-bold border-2 border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors pr-8"
                />
                {digit === null && (
                  <span className="absolute top-1 right-1 bg-blue-100 text-blue-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    Auto
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 text-center">
                {getDigitLabel(index)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 h-11 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </button>
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="px-6 h-11 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset to Auto
        </button>
      </div>
    </ManagePinLayout>
  );
}