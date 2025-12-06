import { KeyRound } from "lucide-react";
import React from "react";

interface ManagePinLayoutProps {
  cardTitle: string;
  cardDescription: string;
  children: React.ReactNode;
}

export default function ManagePinLayout({ cardTitle, cardDescription, children }: ManagePinLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white p-6">
      
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage PIN</h1>
        <p className="text-slate-700 mt-1">Create or change your secret admin PIN for verification.</p>
      </div>

      {/* The main content card */}
      <div className="w-full max-w-md rounded-xl border bg-white mt-8 p-6 shadow-sm">
        
        {/* Card Header */}
        <div className="flex flex-col items-center text-center">
           <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
              <KeyRound className="h-7 w-7 text-indigo-600" />
            </div>
           <h2 className="text-xl font-semibold mt-4 text-slate-800">
            {cardTitle}
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            {cardDescription}
          </p>
        </div>
        
        {/* The form itself will be rendered here */}
        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
}