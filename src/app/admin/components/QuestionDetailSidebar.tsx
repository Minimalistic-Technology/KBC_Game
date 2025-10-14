'use client';

import { 
    FileQuestion, 
    ImageIcon, 
    CheckCircle, 
    Edit, 
    Trash2,
    Tag,
    BarChart3,
    Zap,
    Users,
    Lightbulb,
    FileEdit
} from 'lucide-react';
import type { Question } from '@/lib/types';

interface SidebarProps {
  question: Question | null;
  onDelete: (id: number) => void;
  onEdit: () => void;
}

// A small helper component for displaying details
const DetailItem = ({ icon: Icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) => (
    <div>
        <span className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-2">
            <Icon size={14} />
            {label}
        </span>
        <div className="text-sm text-slate-800">{children}</div>
    </div>
);


export const QuestionDetailSidebar = ({ question, onDelete, onEdit }: SidebarProps) => {
    if (!question) {
        return (
            <div className="hidden lg:flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
                <FileQuestion className="h-16 w-16 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-800">Select a Question</h3>
                <p className="mt-1 text-sm text-slate-500">Choose a question from the list to see its details.</p>
            </div>
        );
    }

    const { status, level, tags, lifelines, mediaUrl } = question;

    const StatusBadge = () => (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold capitalize px-3 py-1 rounded-full ${
            status === 'Published' 
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
        }`}>
            {status === 'Published' ? <CheckCircle size={12} /> : <FileEdit size={12} />}
            {status}
        </span>
    );

    return (
        <div className="hidden lg:flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-slate-900">Details</h3>
            </div>
            <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                {/* --- Question Preview --- */}
                <div>
                    <span className="text-sm font-semibold text-slate-500">Question Preview</span>
                    <p className="mt-1 text-slate-800 font-medium">{question.question}</p>
                </div>

                {/* --- Media Display --- */}
                <DetailItem icon={ImageIcon} label="Media">
                    {mediaUrl ? (
                        <img src={mediaUrl} alt="Question media" className="mt-2 rounded-lg border w-full h-32 object-cover" />
                    ) : (
                        <div className="mt-2 flex items-center justify-center h-32 rounded-lg bg-slate-100 border border-dashed">
                            <p className="text-xs text-slate-500">No media attached</p>
                        </div>
                    )}
                </DetailItem>
                
                {/* --- Options --- */}
                <div>
                    <span className="text-sm font-semibold text-slate-500">Options</span>
                    <ul className="mt-2 space-y-2">
                        {question.options.map((opt, index) => (
                            <li key={index} className={`flex items-center gap-3 text-sm p-3 rounded-md ${question.answer === opt ? 'bg-green-100 text-green-900 font-semibold' : 'bg-slate-100 text-slate-700'}`}>
                                {question.answer === opt && <CheckCircle size={16} className="text-green-600 flex-shrink-0" />}
                                <span>{opt}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* --- Other Details --- */}
                <div className="pt-4 border-t space-y-5">
                    <DetailItem icon={CheckCircle} label="Status">
                        <StatusBadge />
                    </DetailItem>
                    
                    <DetailItem icon={BarChart3} label="Difficulty Level">
                        <span className="font-semibold">{level}</span>
                    </DetailItem>

                    <DetailItem icon={Tag} label="Tags">
                        {tags && tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <span key={tag} className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500">No tags assigned</p>
                        )}
                    </DetailItem>

                    <DetailItem icon={Zap} label="Available Lifelines">
                        <div className="flex items-center gap-4">
                            {/* --- CORRECTED CODE --- */}
                            {lifelines['50:50'] && (
                                <span title="50:50">
                                    <Zap size={18} className="text-slate-600"/>
                                </span>
                            )}
                            {lifelines['Audience Poll'] && (
                                <span title="Audience Poll">
                                    <Users size={18} className="text-slate-600"/>
                                </span>
                            )}
                            {lifelines['Expert Advice'] && (
                                <span title="Expert Advice">
                                    <Lightbulb size={18} className="text-slate-600"/>
                                </span>
                            )}
                        </div>
                    </DetailItem>
                </div>
            </div>

            <div className="p-4 bg-slate-50 border-t flex gap-3">
                <button onClick={onEdit} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 h-10 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                    <Edit size={16} /> Edit
                </button>
                <button onClick={() => onDelete(question.id)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white border h-10 text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-200">
                    <Trash2 size={16} /> Delete
                </button>
            </div>
        </div>
    );
};