'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShieldCheck } from "lucide-react";
import ManagePinLayout from "../_components/ManagePinLayout";

const queryClient = new QueryClient();

export default function PinCreatePageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <PinCreatePage />
    </QueryClientProvider>
  );
}

function PinCreatePage() {
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [oldPin, setOldPin] = useState("");
  const router = useRouter();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["checkPin"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/pin/check", { withCredentials: true });
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">Error loading PIN status</div>;

  const hasPin = data?.hasPin;

  const handlePinInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setter(value);
    }
  };
  
  const handleChangePinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!oldPin || !newPin) {
      alert("Please fill in both old and new PIN fields.");
      return;
    }
    try {
      await axiosInstance.post("/api/pin/change", { oldPin, newPin }, { withCredentials: true });
      alert("PIN changed successfully!");
      router.push('/admin');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to change PIN. Please check your old PIN and try again.";
      alert(errorMessage);
    }
  };

  const handleCreatePinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/pin/create", { pin }, { withCredentials: true });
      alert("PIN created successfully");
      setPin("");
      refetch();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create PIN.";
      alert(errorMessage);
    }
  }

  return (
    <ManagePinLayout
      cardTitle={hasPin ? "Change Your PIN" : "Create a New PIN"}
      cardDescription={hasPin ? "Enter your old and new PIN below." : "This PIN will be used to verify sensitive actions."}
    >
      {!hasPin ? (
        <form onSubmit={handleCreatePinSubmit} className="flex flex-col gap-4">
          <input
            type="password" // --- CHANGED ---
            inputMode="numeric"
            placeholder="Enter 4-digit PIN"
            value={pin}
            onChange={handlePinInputChange(setPin)}
            className="rounded-lg border-2 border-slate-300 bg-slate-50 p-3 text-center text-lg font-medium text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            maxLength={4}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 h-12 text-md font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:bg-slate-400"
          >
            <ShieldCheck size={18}/>
            Create PIN
          </button>
        </form>
      ) : (
        <form onSubmit={handleChangePinSubmit} className="flex flex-col gap-4">
          <input
            type="password" // --- CHANGED ---
            inputMode="numeric"
            placeholder="Old PIN"
            value={oldPin}
            onChange={handlePinInputChange(setOldPin)}
            className="rounded-lg border-2 border-slate-300 bg-slate-50 p-3 text-center text-lg font-medium text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            maxLength={4}
          />
          <input
            type="password" // --- CHANGED ---
            inputMode="numeric"
            placeholder="New 4-digit PIN"
            value={newPin}
            onChange={handlePinInputChange(setNewPin)}
            className="rounded-lg border-2 border-slate-300 bg-slate-50 p-3 text-center text-lg font-medium text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            maxLength={4}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 h-12 text-md font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:bg-slate-400"
          >
              <ShieldCheck size={18}/>
              Change PIN
          </button>
        </form>
      )}
    </ManagePinLayout>
  );
}