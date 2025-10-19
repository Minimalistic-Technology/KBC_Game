'use client';

import React from 'react';
import type { Lifeline } from '@/lib/types';

interface LifelineToggleProps {
    label: keyof Lifeline;
    icon: React.ElementType;
    isEnabled: boolean;
    onToggle: (label: keyof Lifeline) => void;
}

export const LifelineToggle = ({ label, icon: Icon, isEnabled, onToggle }: LifelineToggleProps) => (
    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${isEnabled ? 'bg-green-50 border-green-300' : 'bg-white hover:bg-slate-50'}`}
        onClick={() => onToggle(label)}
    >
        <div className="flex items-center gap-3">
            <Icon className={`h-5 w-5 ${isEnabled ? 'text-green-700' : 'text-slate-500'}`} />
            <span className={`font-medium ${isEnabled ? 'text-green-800' : 'text-slate-700'}`}>{label}</span>
        </div>
        <div className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors ${isEnabled ? 'bg-green-500 justify-end' : 'bg-slate-300 justify-start'}`}>
            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
        </div>
    </div>
);