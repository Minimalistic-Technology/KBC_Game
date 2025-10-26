// app/admin/components/Game-config/BankSelectionCard.tsx
'use client';

import React from 'react';
import type { QuestionBank } from '@/lib/types1';
import { Package, ShieldCheck } from 'lucide-react';

interface BankSelectionCardProps {
    bank: QuestionBank;
    isSelected: boolean;
    order: number;
    onToggle: (id: string) => void;
}

export const BankSelectionCard = ({ bank, isSelected, order, onToggle }: BankSelectionCardProps) => (
    <div 
        className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
        onClick={() => onToggle(bank.id)}
    >
        {isSelected && (
            <div className="absolute -top-3 -right-3 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold border-2 border-white text-sm">
                {order}
            </div>
        )}
        <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-md"><Package className="text-slate-600" /></div>
            <div>
                <p className="font-bold text-slate-800">{bank.title}</p>
                <p className="text-xs text-slate-500 capitalize">{bank.ageGroup || 'General'}</p>
            </div>
        </div>
    </div>
);