'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Save, RefreshCw, Info } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';

export default function PinConfigurationManager() {
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
        const labels = ['1st Digit (Day tens)', '2nd Digit (Day units)', '3rd Digit (Month tens)', '4th Digit (Month units)'];
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
            <div className="rounded-xl border bg-white p-6 shadow-sm animate-pulse">
                <div className="h-8 w-48 bg-slate-200 rounded mb-4"></div>
                <div className="h-32 bg-slate-100 rounded"></div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                        <Lock className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-slate-900">PIN Configuration</h3>
                        <p className="text-sm text-slate-600">Configure your dynamic admin PIN</p>
                    </div>
                </div>
                <button
                    onClick={fetchPinConfig}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Refresh"
                >
                    <RefreshCw className="h-4 w-4 text-slate-600" />
                </button>
            </div>

            {/* Info Box */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">How it works:</p>
                    <p>
                        The PIN is automatically generated using the current date. By default, it uses{' '}
                        <span className="font-mono font-semibold">DD-MM</span> (day and month).
                        You can hardcode any digit to a fixed value (0-9), and the rest will use the date logic.
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pinConfig.map((digit, index) => (
                        <div key={index} className="flex flex-col">
                            <label className="text-xs font-medium text-slate-600 mb-2">
                                {getDigitLabel(index)}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={digit !== null ? digit : ''}
                                    onChange={(e) => handleDigitChange(index, e.target.value)}
                                    placeholder={getPlaceholder(index)}
                                    maxLength={1}
                                    className="w-full h-16 text-center text-2xl font-mono font-bold border-2 border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                                />
                                {digit === null && (
                                    <span className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-normal pointer-events-none">
                                        Auto
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                {digit !== null ? `Fixed: ${digit}` : `Auto (${getPlaceholder(index)})`}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
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
        </div>
    );
}
