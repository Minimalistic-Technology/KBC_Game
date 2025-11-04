'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { UploadCloud, File as FileIcon } from 'lucide-react';
import type { MediaAsset } from '@/lib/types';

const processUploadedFile = (file: File): Promise<MediaAsset> => {
  return new Promise(resolve => {
    const objectUrl = URL.createObjectURL(file);
    setTimeout(() => {
        let type: 'image' | 'video' | 'audio' = 'image';
        if (file.type.startsWith('video')) type = 'video';
        if (file.type.startsWith('audio')) type = 'audio';

      const newAsset: MediaAsset = {
        id: `media_${Date.now()}`,
        url: objectUrl,
        type: type,
        fileName: file.name,
        derivedFormats: type === 'image'
            ? [{ name: 'Thumbnail', resolution: '300x200' }, { name: 'Medium', resolution: '600x400' }]
            : (type === 'video' 
                ? [{ name: 'SD', resolution: '480p' }, { name: 'HD', resolution: '720p' }] 
                : [{ name: 'MP3', resolution: '128kbps' }])
      };
      resolve(newAsset);
    }, 1000);
  });
};

// --- UPDATED: Component now accepts 'accept' prop ---
interface MediaUploaderProps {
    onUploadComplete: (asset: MediaAsset) => void;
    accept: Accept;
}

export const MediaUploader = ({ onUploadComplete, accept }: MediaUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- NEW: Generate descriptive text from the accept prop ---
  const acceptedTypesText = useMemo(() => {
    return Object.values(accept).flat().map(ext => ext.replace('.', '').toUpperCase()).join(', ');
  }, [accept]);

  const handleUpload = async (acceptedFile: File) => {
    setError(null);
    setFile(acceptedFile);
    setIsProcessing(true);
    const newAsset = await processUploadedFile(acceptedFile);
    onUploadComplete(newAsset);
    setIsProcessing(false);
  };
  
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      setError(`Invalid file type. Please upload: ${acceptedTypesText}`);
      return;
    }
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0]);
    }
  }, [acceptedTypesText, handleUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept, // Use the passed-in accept prop
    multiple: false,
  });

  if (isProcessing && file) {
    return (
      <div className="w-full p-4 rounded-lg border bg-slate-50">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 animate-pulse"><FileIcon className="h-10 w-10 text-slate-500" /></div>
          <div className="flex-grow">
            <p className="font-medium text-slate-800 truncate">{file.name}</p>
            <p className="text-sm text-slate-600">Processing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div {...getRootProps()} className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors cursor-pointer 
      ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300 hover:border-indigo-500'}`}>
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto h-10 w-10 text-slate-400" />
      <p className="mt-2 text-sm text-slate-600 text-center">
        {isDragActive ? "Drop the file here..." : <>Drag & drop or <span className="font-semibold text-indigo-600">click to upload</span></>}
      </p>
      <p className="text-xs text-slate-500 mt-1">{acceptedTypesText}</p>
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
    </div>
  );
};