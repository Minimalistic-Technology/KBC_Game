// src/app/admin/components/StatCard.tsx
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'increase' | 'decrease';
}

export const StatCard = ({ title, value, icon: Icon, change, changeType }: StatCardProps) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <div className="mt-2">
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        <p className="text-xs text-slate-600 mt-1">
          <span className={changeType === 'increase' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {change}
          </span>{' '}
          from last month
        </p>
      </div>
    </div>
  );
};