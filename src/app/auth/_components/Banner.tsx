import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function Banner({ message, type }: { message: string, type: 'success' | 'error' }) {
  if (!message) return null;
  
  const isSuccess = type === 'success';
  
  return (
    <div className={`p-4 rounded-md flex items-center gap-3 ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {isSuccess ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
}