
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Questioners</h1>
                    <p className="text-slate-600 mt-1">Add and manage content creators for your platform.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm w-full sm:w-auto justify-center"
                >
                    <Plus size={18} />
                    Add Questioner
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : questioners.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
                    <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <p>No questioners found.</p>
                    <button onClick={handleCreate} className="text-indigo-600 font-semibold hover:underline mt-1">
                        Create one now
                    </button>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-700 text-sm whitespace-nowrap">Name</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700 text-sm whitespace-nowrap">Email</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questioners.map((q) => (
                                        <tr key={q._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-slate-900 font-medium whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                                                        {q.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    {q.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{q.email}</td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {questioners.map((q) => (
                            <div key={q._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                                            {q.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{q.name}</h3>
                                            <p className="text-sm text-slate-500 break-all">{q.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex border-t pt-3 gap-3">
                                    <button
                                        onClick={() => handleEdit(q)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-700 bg-slate-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                    >
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(q._id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
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
