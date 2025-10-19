'use client';

import React, { useState, useEffect } from 'react';
import { MappedData } from '../../import/page';
import { CheckCircle, Download, RotateCcw } from 'lucide-react';

interface StatusProps {
  importedData: MappedData[];
  onReset: () => void;
}

export const ImportStatus = ({ importedData, onReset }: StatusProps) => {
  const [progress, setProgress] = useState(0);
  
  // Simulate import progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 10));
    }, 150);
    return () => clearInterval(interval);
  }, []);
  
  // Simulate some errors for demonstration
  const totalRows = importedData.length;
  const errorCount = Math.floor(totalRows / 5);
  const successCount = totalRows - errorCount;

  const handleDownloadErrors = () => {
    alert("In a real app, this would download a CSV of the errored rows.");
  }

  if (progress < 100) {
    return (
        <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900">Import in Progress...</h2>
            <div className="w-full bg-slate-200 rounded-full h-4 mt-6">
                <div className="bg-indigo-600 h-4 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="mt-4 text-slate-600">{progress}% Complete</p>
        </div>
    );
  }

  return (
    <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold text-slate-900 mt-4">Import Complete</h2>
        
        <div className="mt-6 flex justify-center gap-8 text-lg">
            <div className="text-green-700 font-semibold">
                <span className="block text-3xl">{successCount}</span>
                Rows Imported
            </div>
            <div className="text-red-700 font-semibold">
                <span className="block text-3xl">{errorCount}</span>
                Rows Failed
            </div>
        </div>

        <div className="mt-10 flex justify-center gap-4">
            <button onClick={onReset} className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-5 h-11 text-sm font-semibold text-slate-800 hover:bg-slate-100">
                <RotateCcw size={16} /> New Import
            </button>
            {errorCount > 0 && (
                <button onClick={handleDownloadErrors} className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 h-11 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700">
                    <Download size={16} /> Download Error Report
                </button>
            )}
        </div>
    </div>
  );
};