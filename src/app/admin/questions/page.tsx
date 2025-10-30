import React, { Suspense } from 'react';
import QuestionsPageClient from '../components/questions/QuestionsPageClient'; // Adjust the path if necessary

// A simple loading skeleton component
const LoadingSkeleton = () => (
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Loading Questions...</h1>
    <p className="text-slate-700 mt-1">Please wait while we fetch the details.</p>
  </div>
);

export default function QuestionsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <QuestionsPageClient />
    </Suspense>
  );
}