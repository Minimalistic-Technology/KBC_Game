'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import Papa from 'papaparse';

interface UploaderProps {
  onUpload: (data: Record<string, string>[], headers: string[]) => void;
}

export const FileUploader = ({ onUpload }: UploaderProps) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length === 0) {
      setError('Please select a valid CSV file.');
      return;
    }
    
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Failed to parse CSV file. Please check its format.');
          return;
        }
        const headers = results.meta.fields || [];
        onUpload(results.data as Record<string, string>[], headers);
      },
      error: () => {
        setError('An unexpected error occurred while parsing the file.');
      }
    });
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  return (
    <div {...getRootProps()} className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors cursor-pointer 
      ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300 hover:border-indigo-500'}`}>
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
      <p className="mt-4 text-lg font-semibold text-slate-600">
        {isDragActive ? "Drop the file here..." : "Drag & drop a CSV file or click to select"}
      </p>
      <p className="text-sm text-slate-500 mt-1">Only *.csv files are accepted</p>
      {error && <p className="text-red-500 text-sm mt-4 font-semibold">{error}</p>}
    </div>
  );
};