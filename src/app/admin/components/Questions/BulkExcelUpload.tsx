'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Loader2 } from 'lucide-react';

type BulkExcelUploadProps = {
  bankId: string;
  endpoint?: string; 
  onUploaded?: () => void;
};

export function BulkExcelUpload({
  bankId,
  endpoint = `${process.env.NEXT_PUBLIC_API_URL_DEV}/api/import-export/import/questions`,
  onUploaded,
}: BulkExcelUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setError(null);
    setSuccess(null);
  };

  const handleUpload = async () => {
    if (!bankId) {
      setError('No bank selected.');
      return;
    }
    if (!file) {
      setError('Please choose a file first.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setSuccess(null);

      const form = new FormData();
      form.append('file', file);      
      form.append('bankId', bankId);   
      await axios.post(endpoint, form, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Uploaded successfully.');
      setFile(null);
      onUploaded?.();
    } catch (err) {
      console.error('Bulk upload failed', err);
      setError('Upload failed. Please check the file format and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />

      <button
        onClick={handleUpload}
        disabled={!file || !bankId || isUploading}
        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {isUploading ? 'Uploading…' : 'Upload'}
      </button>

      {error && <span className="text-sm text-red-600">{error}</span>}
      {success && <span className="text-sm text-green-600">{success}</span>}
    </div>
  );
}
