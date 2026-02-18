'use client';

import { Activity, DollarSign, Users, Package } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { useAtomValue } from 'jotai';
import { isQuestionerAtom, loggedInUserAtom } from '@/state/auth';

export default function DashboardPage() {
  const isQuestioner = useAtomValue(isQuestionerAtom);
  // loggedInUserAtom stores the ROLE string currently, not the user object. 
  // Wait, in AuthHydrator it sets role string to loggedInUserAtom. 
  // So I can't get the name easily here without fetching 'me' or storing name in atom.
  // I will just use the role title.

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {isQuestioner ? 'Questioner Dashboard' : 'Admin Dashboard'}
        </h1>
        <p className="text-slate-700 mt-1">
          {isQuestioner
            ? "Manage your assigned question banks and PINs."
            : "An overview of your platform's performance."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {!isQuestioner && (
          <>
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
          </>
        )}
        <StatCard
          title="Question Banks"
          value="12"
          icon={Package}
          change="+2"
          changeType="increase"
        />
        {!isQuestioner && (
          <StatCard
            title="Games Played"
            value="573"
            icon={Activity}
            change="-2.5%"
            changeType="decrease"
          />
        )}
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
