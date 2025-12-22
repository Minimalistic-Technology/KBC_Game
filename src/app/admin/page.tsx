// src/app/admin/page.tsx
import { Activity, DollarSign, Users, Package } from 'lucide-react';
import { StatCard } from './components/StatCard';

export default function DashboardPage() {
  const a = true; // toggle this

  // 🔹 CASE 1: Coming Soon
  if (a) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Coming Soon 🚧
          </h1>
          <p className="mt-3 text-slate-600">
            This dashboard is under development. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  // 🔹 CASE 2: Full Dashboard
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-700 mt-1">
          An overview of your platform&apos;s performance.
        </p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-slate-900">
            Recent Activity
          </h3>
          <p className="text-slate-700 mt-2">
            A list or table of recent events would go here...
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-slate-900">
            Scheduled Banks
          </h3>
          <p className="text-slate-700 mt-2">
            A list of upcoming scheduled banks would go here...
          </p>
        </div>
      </div>
    </div>
  );
}
