
"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";
import { QuestionerEditorModal } from "../components/questioner/QuestionerEditorModal";
import { useAtomValue } from "jotai";
import { isAdminAtom, authHydratedAtom } from "@/state/auth";
import { useRouter } from "next/navigation";

interface Questioner {
    _id: string;
    name: string;
    email: string;
    role: "questioner";
}

export default function ManageQuestionersPage() {
    const [questioners, setQuestioners] = useState<Questioner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingQuestioner, setEditingQuestioner] = useState<Questioner | null>(null);

    const isAdmin = useAtomValue(isAdminAtom);
    const hydrated = useAtomValue(authHydratedAtom);
    const router = useRouter();

    useEffect(() => {
        if (hydrated && !isAdmin) {
            router.push("/admin"); // Redirect non-admins
        }
    }, [hydrated, isAdmin, router]);

    const fetchQuestioners = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/auth/admins/questioners");
            setQuestioners(res.data);
        } catch (err) {
            console.error("Failed to fetch questioners", err);
            toast.error("Failed to load questioners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) fetchQuestioners();
    }, [isAdmin]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this questioner?")) return;
        try {
            await axiosInstance.delete(`/auth/admins/questioners/${id}`);
            toast.success("Questioner deleted");
            fetchQuestioners();
        } catch (err) {
            toast.error("Failed to delete questioner");
        }
    };

    const handleEdit = (q: Questioner) => {
        setEditingQuestioner(q);
        setIsEditorOpen(true);
    };

    const handleCreate = () => {
        setEditingQuestioner(null);
        setIsEditorOpen(true);
    };

    if (!hydrated || !isAdmin) return null; // or loading spinner

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Questioners</h1>
                    <p className="text-slate-600 mt-1">Add and manage content creators for your platform.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                >
                    <Plus size={18} />
                    Add Questioner
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Email</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questioners.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                                        No questioners found. Click "Add Questioner" to create one.
                                    </td>
                                </tr>
                            ) : (
                                questioners.map((q) => (
                                    <tr key={q._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-900 font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                    {q.name.charAt(0).toUpperCase()}
                                                </div>
                                                {q.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{q.email}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(q)}
                                                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(q._id)}
                                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isEditorOpen && (
                <QuestionerEditorModal
                    questioner={editingQuestioner}
                    onSave={() => {
                        setIsEditorOpen(false);
                        fetchQuestioners();
                    }}
                    onClose={() => setIsEditorOpen(false)}
                />
            )}
        </div>
    );
}
