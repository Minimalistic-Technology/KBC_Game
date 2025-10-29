'use client';
import axios from "axios";
import { useState } from "react";
import axiosInstance from '@/utils/axiosInstance';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

  // Fetch to check if PIN exists
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["checkPin"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/pin/check", { withCredentials: true });
      return res.data;
    },
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading PIN status</div>;

  const hasPin = data?.hasPin;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        {hasPin ? "Manage Your PIN" : "Create Your PIN"}
      </h1>

      {!hasPin ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await axiosInstance.post(
              "/api/pin/create",
              { pin },
              { withCredentials: true }
            );
            alert("PIN created successfully");
            refetch();
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="password"
            placeholder="Enter 4-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="border rounded p-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
          >
            Create PIN
          </button>
        </form>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await axiosInstance.post(
              "/api/pin/change",
              { oldPin, newPin },
              { withCredentials: true }
            );
            alert("PIN changed successfully");
            refetch();
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="password"
            placeholder="Old PIN"
            value={oldPin}
            onChange={(e) => setOldPin(e.target.value)}
            className="border rounded p-2"
          />
          <input
            type="password"
            placeholder="New 4-digit PIN"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            className="border rounded p-2"
          />
          <button
            type="submit"
            className="bg-green-600 text-white rounded p-2 hover:bg-green-700"
          >
            Change PIN
          </button>
        </form>
      )}
    </div>
  );
}