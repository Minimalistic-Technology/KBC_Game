
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

interface Questioner {
    _id?: string;
    name: string;
    email: string;
    password?: string;
}

interface Props {
    questioner?: Questioner | null;
    onSave: () => void;
    onClose: () => void;
}

export const QuestionerEditorModal = ({ questioner, onSave, onClose }: Props) => {
    const [name, setName] = useState(questioner?.name || "");
    const [email, setEmail] = useState(questioner?.email || "");
    const [password, setPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) {
            toast.error("Name and Email are required");
            return;
        }

        if (!questioner?._id && !password) {
            toast.error("Password is required for new accounts");
            return;
        }

        try {
            setIsSaving(true);
            if (questioner?._id) {
                await axiosInstance.put(`/auth/admins/questioners/${questioner._id}`, { name, email, password });
                toast.success("Questioner updated");
            } else {
                await axiosInstance.post("/auth/admins/questioners", { name, email, password });
                toast.success("Questioner created");
            }
            onSave();
        } catch (err: any) {
            toast.error(err.response?.data?.message || btnText + " failed");
        } finally {
            setIsSaving(false);
        }
    };

    const btnText = questioner?._id ? "Update" : "Create";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">{questioner?._id ? "Edit Questioner" : "Add Questioner"}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {questioner?._id ? "New Password (leave blank to keep current)" : "Password"}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : btnText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
