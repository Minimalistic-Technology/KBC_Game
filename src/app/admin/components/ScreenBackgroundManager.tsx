'use client';

import React, { useState, useEffect } from 'react';
import { updateScreenBackground, getScreenBackground } from '@/lib/backgroundApi';
import { Upload, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SCREENS = ['login', 'home', 'dashboard', 'game', 'scoreboard']; // List of manageable screens

export const ScreenBackgroundManager = () => {
    const [selectedScreen, setSelectedScreen] = useState(SCREENS[0]);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        const loadBackground = async () => {
            setFetching(true);
            setFile(null);
            setPreviewUrl(null);
            try {
                const res = await getScreenBackground(selectedScreen);
                // API returns { success: true, data: { mediaRef: { url: ... } } }
                // getScreenBackground helper returns response.data
                if (res && res.success && res.data && res.data.mediaRef?.url) {
                    setPreviewUrl(res.data.mediaRef.url);
                }
            } catch (error) {
                console.error("Failed to load background:", error);
            } finally {
                setFetching(false);
            }
        };
        loadBackground();
    }, [selectedScreen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            // Create preview
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file');
            return;
        }

        setUploading(true);
        const loadingToast = toast.loading('Uploading background...');

        try {
            await updateScreenBackground(selectedScreen, file);
            toast.success('Background updated successfully!', { id: loadingToast });
            setFile(null);
            // Keep the preview url (it matches the uploaded file)
            // Or re-fetch? Re-fetching is safer to confirm backend state.
            const res = await getScreenBackground(selectedScreen);
            if (res && res.success && res.data && res.data.mediaRef?.url) {
                setPreviewUrl(res.data.mediaRef.url);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update background', { id: loadingToast });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Manage Screen Backgrounds</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Controls */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Screen</label>
                        <select
                            value={selectedScreen}
                            onChange={(e) => setSelectedScreen(e.target.value)}
                            className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        >
                            {SCREENS.map(screen => (
                                <option key={screen} value={screen} className="capitalize">{screen}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Upload Image</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100
                  cursor-pointer border border-slate-200 rounded-lg bg-slate-50"
                            />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Recommended size: 1920x1080px (JPG, PNG)</p>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading || !file}
                        className="w-full mt-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium 
              hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed
              flex items-center justify-center gap-2 transition-colors"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                <span>Update Background</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Preview Area */}
                <div className="relative aspect-video rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                    {fetching ? (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            <span className="text-sm">Loading background...</span>
                        </div>
                    ) : previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-center p-4">
                            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-400">Image preview will appear here</p>
                        </div>
                    )}
                    {selectedScreen && !fetching && (
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm uppercase tracking-wider font-semibold">
                            {selectedScreen}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
