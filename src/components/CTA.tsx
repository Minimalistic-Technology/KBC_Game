'use client';

import Link from 'next/link';

// IMPORTANT: Replace this with the actual URL of your deployed quiz app
const QUIZ_APP_URL = "/play/game";

export default function CTA() {
  return (
    <section className="bg-indigo-600 py-20">
      <div className="container mx-auto px-6 text-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-indigo-200 mb-10 max-w-2xl mx-auto">
            Jump right in and see what makes QuizMaster the best quiz platform out there.
          </p>
          <div className="inline-block">
            <Link href={QUIZ_APP_URL}>
              <button className="px-10 py-4 text-lg font-bold text-indigo-600 bg-white rounded-full shadow-lg transition-transform transform hover:scale-105">
                Launch the App
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}