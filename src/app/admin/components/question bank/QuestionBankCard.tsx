'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react';
import type { QuestionBank } from '@/lib/types';

interface CardProps {
    bank: QuestionBank;
    index: number;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
    onMove: (e: React.MouseEvent, direction: 'up' | 'down') => void;
    isFirst: boolean;
    isLast: boolean;
}

export const QuestionBankCard = ({ bank, index, onEdit, onDelete, onMove, isFirst, isLast }: CardProps) => {
    const statusClasses: { [key: string]: string } = {
        published: "bg-green-100 text-green-800",
        draft: "bg-yellow-100 text-yellow-800",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col group transition-shadow duration-200 hover:shadow-md"
        >
            <Link href={`/admin/questions?bankId=${bank._id}`} className="flex-grow p-6 flex flex-col">
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-bold bg-slate-100 text-slate-700 py-1 px-3 rounded-md">Q{index + 1}</span>
                        <div className="flex items-center gap-2">
                            {bank.ageGroup && bank.ageGroup !== 'All Ages' && (
                                <span className="text-xs font-bold bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                                    {bank.ageGroup}
                                </span>
                            )}
                            <span
                                className={`text-xs font-bold capitalize px-3 py-1 rounded-full ${bank.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                {bank.published ? 'Published' : 'Draft'}
                            </span>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">{bank.name}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">{bank.description}</p>
                </div>

                <div className="mt-auto flex items-center gap-2 flex-wrap">
                    {bank.categories.map(tag => (
                        <span key={tag} className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
            </Link>
            <div className="border-t border-slate-200 bg-slate-50/75 p-3 flex justify-between items-center text-sm">
                <div className="flex items-center gap-4 text-slate-700 font-medium">
                    <span className="flex items-center gap-1.5" title="Number of questions"><FileText size={14} /> {bank.questionCount}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={(e) => onMove(e, 'up')} disabled={isFirst} className="p-2 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30"><ArrowUp size={16} /></button>
                    <button onClick={(e) => onMove(e, 'down')} disabled={isLast} className="p-2 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30"><ArrowDown size={16} /></button>
                    <button onClick={onEdit} className="p-2 rounded-md text-slate-500 hover:bg-slate-200" title="Edit"><Edit size={16} /></button>
                    <button onClick={onDelete} className="p-2 rounded-md text-slate-500 hover:bg-red-100 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
                </div>
            </div>
        </motion.div>
    );
};