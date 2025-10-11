import { Activity, Users, Package } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change, changeType }: any) => {
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

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-700 mt-1">An overview of your platform’s performance.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards dummy data(if required) */}
        
        <StatCard 
          title="User" 
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