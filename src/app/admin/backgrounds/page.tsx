'use client';

import React from 'react';
import { ScreenBackgroundManager } from '../components/ScreenBackgroundManager';

export default function BackgroundsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Screen Backgrounds
                </h1>
                <p className="text-slate-700 mt-1">
                    Manage background images for different game screens.
                </p>
            </div>

            <div className="mt-4">
                <ScreenBackgroundManager />
            </div>
        </div>
    );
}
