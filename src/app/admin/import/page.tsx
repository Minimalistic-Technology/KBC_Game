'use client';

import React, { useState } from 'react';
import { FileUploader } from '../components/import/FileUploader';
import { ColumnMapper } from '../components/import/ColumnMapper';
import { ImportPreview } from '../components/import/ImportPreview';
import { ImportStatus } from '../components/import/ImportStatus';
import type { Question } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type ImportStep = 'upload' | 'map' | 'status';
export type MappedData = Omit<Question, 'id' | 'bankId' | 'lifelines'>;

const ImportPage = () => {
  const [step, setStep] = useState<ImportStep>('upload');
  const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappedData, setMappedData] = useState<MappedData[]>([]);

  const handleFileUploaded = (data: Record<string, string>[], fileHeaders: string[]) => {
    setParsedData(data);
    setHeaders(fileHeaders);
    setStep('map');
  };

  const handleMappingComplete = (data: MappedData[]) => {
    setMappedData(data);
    // In a real app, you would send 'data' to your backend API.
    // Here, we'll just move to the status screen to simulate it.
    setStep('status');
  };
  
  const handleReset = () => {
    setStep('upload');
    setParsedData([]);
    setHeaders([]);
    setMappedData([]);
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div>
        <Link href="/admin/question-banks" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-2">
            <ArrowLeft size={16} /> Back to Question Banks
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Import Questions</h1>
        <p className="text-slate-700 mt-1">Upload a CSV file to add new questions in bulk.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        {step === 'upload' && <FileUploader onUpload={handleFileUploaded} />}
        
        {step === 'map' && (
          <div className="space-y-8">
            <ColumnMapper headers={headers} data={parsedData} onMap={handleMappingComplete} />
            <ImportPreview data={parsedData} />
          </div>
        )}

        {step === 'status' && <ImportStatus importedData={mappedData} onReset={handleReset} />}
      </div>
    </div>
  );
};

export default ImportPage;