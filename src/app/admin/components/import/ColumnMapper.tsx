'use client';

import React, { useState } from 'react';
import { MappedData } from '../../import/page';
import { Check, ChevronsRight } from 'lucide-react';

interface MapperProps {
  headers: string[];
  data: Record<string, string>[];
  onMap: (mappedData: MappedData[]) => void;
}

export const ColumnMapper = ({ headers, data, onMap }: MapperProps) => {
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const handleMappingChange = (fileHeader: string, modelField: string) => {
    setMapping(prev => ({ ...prev, [fileHeader]: modelField }));
  };

  const handleStartImport = () => {
    const mappedData = data.map(row => {
        const newQuestion: any = { options: [] };
        for (const fileHeader in mapping) {
            const modelField = mapping[fileHeader];
            const value = row[fileHeader];

            if (modelField.startsWith('option')) {
                // Handle multiple option columns (e.g., option1, option2)
                newQuestion.options.push(value);
            } else if (modelField === 'tags') {
                newQuestion.tags = value.split(',').map(tag => tag.trim());
            } else {
                newQuestion[modelField] = value;
            }
        }
        return newQuestion as MappedData;
    });
    onMap(mappedData);
  };
  
  return (
    <div>
        <h2 className="text-xl font-bold text-slate-900">Map Columns</h2>
        <p className="text-slate-600 mt-1">Match the columns from your file to the required question fields.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 p-6 border rounded-lg bg-slate-50">
            {headers.map(header => (
                <div key={header} className="flex items-center gap-3">
                    <span className="font-semibold text-slate-800 bg-white border px-3 py-2 rounded-md w-40 truncate">{header}</span>
                    <ChevronsRight className="text-slate-400" />
                    <select 
                        onChange={(e) => handleMappingChange(header, e.target.value)}
                        className="w-full h-10 px-3 border bg-white border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select Field...</option>
                        <option value="question">Question Text</option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                        <option value="option4">Option 4</option>
                        <option value="answer">Correct Answer</option>
                        <option value="status">Status (Draft/Published)</option>
                        <option value="tags">Tags (comma-separated)</option>
                    </select>
                </div>
            ))}
        </div>

        <div className="mt-8 flex justify-end">
            <button 
                onClick={handleStartImport}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 h-11 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
                <Check size={18} />
                Start Import
            </button>
        </div>
    </div>
  );
};