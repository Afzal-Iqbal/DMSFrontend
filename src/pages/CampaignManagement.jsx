import React, { useState, useEffect } from 'react';
import API from '@/api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CampaignManagement = () => {
    // UI & Data State
    const [campaigns, setCampaigns] = useState([]);
    const [liveFeed, setLiveFeed] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loading, setLoading] = useState(true);

    // Modal & Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Validation Schema
    const campaignSchema = Yup.object().shape({
        title: Yup.string().required('Title is required').min(5, 'Too short'),
        goalAmount: Yup.number().required('Goal is required').positive('Goal must be positive'),
        deadline: Yup.date().nullable().optional(),
        category: Yup.string().required('Category is required'),
        description: Yup.string().required('Description is required').min(10, 'Too short'),
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            goalAmount: '',
            deadline: '',
            category: 'General',
            description: '',
        },
        validationSchema: campaignSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const campaignData = {
                    ...values,
                    goalAmount: Number(values.goalAmount)
                };

                if (isEditing) {
                    await API.put(`/campaigns/${editingId}`, campaignData);
                    alert("Campaign Updated Successfully!");
                } else {
                    await API.post('/campaigns/create', campaignData);
                    alert("Campaign Published Successfully!");
                }

                setIsModalOpen(false);
                formik.resetForm();
                fetchCampaigns();
            } catch (err) {
                alert(err.response?.data?.message || "Action failed");
            }
        },
    });

    const fetchCampaigns = async () => {
        try {
            const res = await API.get('/campaigns');
            setCampaigns(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setLoading(false);
        }
    };

    const fetchLiveFeed = async () => {
        try {
            const res = await API.get('/admin/live-feed');
            setLiveFeed(res.data.data);
        } catch (err) {
            console.error("Live feed error:", err);
        }
    };

    useEffect(() => {
        fetchCampaigns();
        fetchLiveFeed();
        const interval = setInterval(() => {
            fetchCampaigns();
            fetchLiveFeed();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleAiAssist = async () => {
        if (!formik.values.title) {
            alert("Please provide a title first for AI generation.");
            return;
        }
        setIsGenerating(true);
        // Simulate AI delay
        setTimeout(() => {
            const aiDesc = `Help us achieve our goal for "${formik.values.title}". This campaign aims to provide critical support in the ${formik.values.category} sector. Your contribution will directly impact lives and bring hope to the community. Join us in making a difference today!`;
            formik.setFieldValue('description', aiDesc);
            setIsGenerating(false);
        }, 1500);
    };

    const handleEditClick = (campaign) => {
        setIsEditing(true);
        setEditingId(campaign._id);
        formik.setValues({
            title: campaign.title,
            goalAmount: campaign.goalAmount,
            deadline: campaign.deadline ? campaign.deadline.split('T')[0] : '',
            category: campaign.defaultCategory || 'General',
            description: campaign.description || '',
        });
        setIsModalOpen(true);
    };

    const handleDeleteCampaign = async (id) => {
        if (!window.confirm("Are you sure you want to delete this campaign?")) return;
        try {
            await API.delete(`/campaigns/${id}`);
            fetchCampaigns();
            alert("Campaign deleted successfully");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete campaign");
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-[#f6f8f7] dark:bg-[#102218] min-h-screen font-['Inter']">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div className="flex flex-col gap-1 sm:gap-2">
                        <h2 className="text-[#111814] dark:text-white text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase">Campaign Management</h2>
                        <p className="text-[#618972] dark:text-gray-400 text-sm sm:text-base">Create and monitor live donation campaigns.</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setEditingId(null);
                            formik.resetForm();
                            setIsModalOpen(true);
                        }}
                        className="bg-[#13ec6d] text-slate-900 px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-[#13ec6d]/20 hover:bg-[#10d460] transition-all flex items-center gap-2 group"
                    >
                        <span className="material-symbols-outlined transition-transform group-hover:rotate-90">add</span>
                        Create New Campaign
                    </button>
                </div>

                {/* Campaign Form Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-[#15281e] w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="p-6 sm:p-8 flex flex-col gap-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg sm:text-xl font-black text-[#111814] dark:text-white uppercase tracking-tight">
                                        {isEditing ? 'Edit Campaign' : 'Create New Campaign'}
                                    </h3>
                                    <button onClick={() => { setIsModalOpen(false); formik.resetForm(); }} className="text-slate-400 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
                                    <label className="flex flex-col gap-1">
                                        <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Campaign Title</span>
                                        <input
                                            {...formik.getFieldProps('title')}
                                            className={`rounded-2xl border ${formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-slate-100 dark:border-[#2A4034]'} bg-slate-50 dark:bg-[#102218] px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#13ec6d] dark:text-white text-sm font-bold transition-all`}
                                            placeholder="e.g. Winter Relief 2025"
                                            type="text"
                                        />
                                        {formik.touched.title && formik.errors.title && <span className="text-[10px] text-red-500 pl-2">{formik.errors.title}</span>}
                                    </label>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <label className="flex flex-col gap-1">
                                            <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Goal ($)</span>
                                            <input
                                                {...formik.getFieldProps('goalAmount')}
                                                className={`rounded-2xl border ${formik.touched.goalAmount && formik.errors.goalAmount ? 'border-red-500' : 'border-slate-100 dark:border-[#2A4034]'} bg-slate-50 dark:bg-[#102218] px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#13ec6d] dark:text-white text-sm font-bold transition-all`}
                                                placeholder="10000"
                                                type="number"
                                            />
                                            {formik.touched.goalAmount && formik.errors.goalAmount && <span className="text-[10px] text-red-500 pl-2">{formik.errors.goalAmount}</span>}
                                        </label>

                                        <label className="flex flex-col gap-1">
                                            <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Deadline</span>
                                            <input
                                                {...formik.getFieldProps('deadline')}
                                                className={`rounded-2xl border ${formik.touched.deadline && formik.errors.deadline ? 'border-red-500' : 'border-slate-100 dark:border-[#2A4034]'} bg-slate-50 dark:bg-[#102218] px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#13ec6d] dark:text-white text-sm font-bold transition-all`}
                                                type="date"
                                            />
                                            {formik.touched.deadline && formik.errors.deadline && <span className="text-[10px] text-red-500 pl-2">{formik.errors.deadline}</span>}
                                        </label>
                                    </div>

                                    <label className="flex flex-col gap-1">
                                        <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Category</span>
                                        <select
                                            {...formik.getFieldProps('category')}
                                            className="rounded-2xl border border-slate-100 dark:border-[#2A4034] bg-slate-50 dark:bg-[#102218] px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#13ec6d] dark:text-white text-sm font-bold transition-all cursor-pointer"
                                        >
                                            <option value="General">General</option>
                                            <option value="Food">Food & Hunger Relief</option>
                                            <option value="Education">Education & Schooling</option>
                                            <option value="Medical">Medical & Healthcare</option>
                                        </select>
                                    </label>

                                    <label className="flex flex-col gap-1">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Description</span>
                                            <button
                                                type="button"
                                                onClick={handleAiAssist}
                                                className="text-[10px] flex items-center gap-1 text-[#13ec6d] hover:underline font-black uppercase tracking-widest"
                                            >
                                                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                                {isGenerating ? 'Gen...' : 'AI Assist'}
                                            </button>
                                        </div>
                                        <textarea
                                            {...formik.getFieldProps('description')}
                                            className={`rounded-2xl border ${formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-slate-100 dark:border-[#2A4034]'} bg-slate-50 dark:bg-[#102218] px-4 py-3.5 min-h-[100px] outline-none focus:ring-2 focus:ring-[#13ec6d] dark:text-white text-sm font-medium transition-all`}
                                            placeholder="Briefly explain the cause and impact..."
                                        />
                                        {formik.touched.description && formik.errors.description && <span className="text-[10px] text-red-500 pl-2">{formik.errors.description}</span>}
                                    </label>

                                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-50 dark:border-gray-800">
                                        <button
                                            className={`flex-1 h-13 rounded-2xl ${isEditing ? 'bg-blue-500 text-white' : 'bg-[#13ec6d] text-slate-900'} font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-lg transition-all py-3.5 px-6 disabled:opacity-50`}
                                            type="submit"
                                            disabled={formik.isSubmitting}
                                        >
                                            {isEditing ? 'Update Campaign' : 'Publish Campaign'}
                                        </button>
                                        <button
                                            onClick={() => { setIsModalOpen(false); formik.resetForm(); }}
                                            className="h-13 px-5 sm:px-6 rounded-2xl border border-slate-100 dark:border-gray-700 font-black uppercase tracking-widest text-[9px] sm:text-[10px] text-gray-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                                            type="button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:gap-8 items-start">
                    {/* Live Donation Feed Section */}
                    <div className="lg:col-span-12 flex flex-col gap-6">
                        <div className="bg-[#111814] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <span className="material-symbols-outlined text-[120px]">monitor_heart</span>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="size-2 bg-[#13ec6d] rounded-full animate-ping"></span>
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#13ec6d]">Real-Time Activity</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {liveFeed.length > 0 ? liveFeed.map((donation, idx) => (
                                        <div key={donation._id} className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${idx * 100}ms` }}>
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] font-black uppercase text-slate-400">Recent Contribution</span>
                                                <span className="text-[#13ec6d] font-black text-xs">${donation.amount.toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm font-bold truncate">{donation.donor?.name || 'Anonymous'}</p>
                                            <p className="text-[9px] font-medium text-slate-400 truncate">to {donation.campaign?.title || 'General Fund'}</p>
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-4 text-center text-slate-500 text-xs font-bold italic">
                                            Awaiting transactions...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Campaign Registry Section */}
                    <div className="lg:col-span-12 flex flex-col gap-6 w-full">
                        <div className="bg-white dark:bg-[#15281e] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-5 border-b border-slate-50 dark:border-gray-800 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                                <h3 className="text-sm font-black text-[#111814] dark:text-white uppercase tracking-widest">Campaign Registry</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Auto-Syncing</span>
                                    <span className="size-1.5 bg-[#13ec6d] rounded-full"></span>
                                </div>
                            </div>

                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-gray-800">
                                        <tr className="bg-slate-50/30 dark:bg-[#12241b]">
                                            <th className="py-4 px-6">Campaign Info</th>
                                            <th className="py-4 px-6 text-center">Fund Progress</th>
                                            <th className="py-4 px-6 text-right">Audit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {loading ? (
                                            <tr><td colSpan="3" className="p-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Syncing...</td></tr>
                                        ) : campaigns.length === 0 ? (
                                            <tr><td colSpan="3" className="p-20 text-center text-slate-400 grayscale opacity-40 flex flex-col items-center">
                                                <span className="material-symbols-outlined text-4xl mb-2">folder_off</span>
                                                <p className="text-[10px] font-black uppercase tracking-widest">No active campaigns</p>
                                            </td></tr>
                                        ) : campaigns.map(c => (
                                            <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white leading-tight mb-1">{c.title}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                        {c.deadline ? `Due: ${new Date(c.deadline).toLocaleDateString()}` : 'No deadline'}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col gap-1.5 w-full max-w-[120px] mx-auto">
                                                        <div className="flex justify-between text-[9px] font-black text-slate-900 dark:text-white uppercase">
                                                            <span>${c.raisedAmount.toLocaleString()}</span>
                                                            <span className="text-[#13ec6d]">{Math.round((c.raisedAmount / (c.goalAmount || 1)) * 100)}%</span>
                                                        </div>
                                                        <div className="w-full bg-slate-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                                            <div
                                                                className="bg-[#13ec6d] h-full transition-all duration-700"
                                                                style={{ width: `${Math.min(100, (c.raisedAmount / (c.goalAmount || 1)) * 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(c)}
                                                            className="text-slate-400 hover:text-[#13ec6d] p-2 rounded-xl hover:bg-[#13ec6d]/10 transition-all font-black text-xs uppercase"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCampaign(c._id)}
                                                            className="text-slate-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-black text-xs uppercase"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Grid */}
                            <div className="sm:hidden divide-y divide-slate-50 dark:divide-slate-800/50">
                                {loading ? (
                                    <div className="p-10 text-center text-[10px] font-black uppercase tracking-widest text-[#13ec6d] animate-pulse">Syncing...</div>
                                ) : campaigns.length === 0 ? (
                                    <div className="p-10 text-center grayscale opacity-30 flex flex-col items-center">
                                        <span className="material-symbols-outlined text-4xl mb-2">folder_off</span>
                                        <p className="text-[10px] font-black uppercase tracking-widest">Empty</p>
                                    </div>
                                ) : campaigns.map(c => (
                                    <div key={c._id} className="p-5 flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">{c.title}</span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{c._id.substring(0, 8)}</span>
                                            </div>
                                            <span className="px-2 py-0.5 bg-[#13ec6d]/10 text-[#13ec6d] text-[8px] font-black uppercase tracking-widest rounded-md">Live</span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                                <span className="text-slate-400">Progress</span>
                                                <span className="text-[#13ec6d]">${c.raisedAmount.toLocaleString()} / ${(c.goalAmount || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="w-full bg-slate-50 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-[#13ec6d] h-full" style={{ width: `${Math.min(100, (c.raisedAmount / (c.goalAmount || 1)) * 100)}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-[9px] font-black text-slate-400 uppercase">{c.deadline ? `Until: ${new Date(c.deadline).toLocaleDateString()}` : 'No deadline'}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditClick(c)}
                                                    className="size-9 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button onClick={() => handleDeleteCampaign(c._id)} className="size-9 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center justify-center text-red-400">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignManagement;