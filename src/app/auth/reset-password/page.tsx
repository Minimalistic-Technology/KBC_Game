// app/auth/reset-password/page.tsx

import { Suspense } from 'react';
import ResetPasswordClient from '../_components/ResetPasswordClient';

// You can create a more elaborate loading skeleton component if you wish
function Loading() {
  return <div>Loading page...</div>;
}

export default function ResetPasswordPage() {
  return (
    // This Suspense boundary is essential.
    // It tells Next.js to show the fallback UI while waiting for the
    // client-side `useSearchParams` hook in ResetPasswordClient to be ready.
    <Suspense fallback={<Loading />}>
      <ResetPasswordClient />
    </Suspense>
  );
}