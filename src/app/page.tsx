import { Activity, DollarSign, Users, Package } from 'lucide-react';
import React from 'react';

type StatCardProps = {
  title: string;
  value: string;
  icon?: React.ComponentType<any>;
  change?: string;
  changeType?: 'increase' | 'decrease';
};

function StatCard({ title, value, icon: Icon, change, changeType = 'increase' }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-medium text-slate-500">{title}</h4>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">{value}</span>
            {change && (
              <span className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
            )}
          </div>
        </div>
        {Icon && <Icon className="h-6 w-6 text-slate-400" />}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-700 mt-1">An overview of your platform's performance.</p>
      </div>

      {/* --- Stat Cards Section (Restored to original static values) --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value="$45,231" 
          icon={DollarSign} 
          change="+20.1%" 
          changeType="increase" 
        />
        <StatCard 
          title="Active Users" 
          value="2,350" 
          icon={Users} 
          change="+180.1%" 
          changeType="increase" 
        />
        <StatCard 
          title="Question Banks" 
          value="12" 
          icon={Package} 
          change="+2" 
          changeType="increase" 
        />
        <StatCard 
          title="Games Played" 
          value="573" 
          icon={Activity} 
          change="-2.5%" 
          changeType="decrease" 
        />
      </div>

      {/* --- Other Dashboard Sections --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-slate-900">Recent Activity</h3>
            <p className="text-slate-700 mt-2">A list or table of recent events would go here...</p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-slate-900">Scheduled Banks</h3>
            <p className="text-slate-700 mt-2">A list of upcoming scheduled banks would go here...</p>
          </div>
      </div>
    </div>
  );
}