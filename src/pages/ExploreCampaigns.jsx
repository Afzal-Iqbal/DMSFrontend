import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/axios';

const ExploreCampaigns = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await API.get('/campaigns');
                setCampaigns(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching campaigns:", err);
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    if (loading) return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen bg-[#f8faf9] dark:bg-[#0a0f0c]">
            <div className="size-12 border-4 border-[#13ec6d]/20 border-t-[#13ec6d] rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Campaigns...</p>
        </div>
    );

    return (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-['Inter']">
            <div className="flex flex-col gap-2 sm:gap-4 mb-8 sm:mb-12 text-center md:text-left">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-tight">
                    Active <span className="text-[#13ec6d]">Campaigns</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto md:mx-0">
                    Explore our ongoing relief efforts and choose a cause to support. Every contribution brings us closer to our goal.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {campaigns.length > 0 ? campaigns.map((campaign, i) => (
                    <div
                        key={campaign._id}
                        className="bg-white dark:bg-[#111c16] rounded-3xl border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col group hover:scale-[1.02] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        <div className="p-6 sm:p-8 flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <div className="size-10 sm:size-12 bg-[#13ec6d]/10 rounded-2xl flex items-center justify-center text-[#13ec6d]">
                                    <span className="material-symbols-outlined text-xl sm:text-2xl font-bold">campaign</span>
                                </div>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-[#13ec6d] text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full">
                                    Active
                                </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-[#13ec6d] transition-colors line-clamp-2 leading-snug">
                                {campaign.title}
                            </h3>

                            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                                {campaign.description || "No description provided for this campaign. Join us in making a difference for this cause."}
                            </p>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] sm:text-xs font-black uppercase tracking-widest">
                                    <span className="text-slate-400">Raised</span>
                                    <span className="text-[#13ec6d]">${campaign.raisedAmount.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 sm:h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-[#13ec6d] h-full transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>{Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)}% Funded</span>
                                    <span>Goal: ${campaign.goalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 pt-0 mt-auto">
                            <button
                                onClick={() => navigate('/donate', { state: { campaign } })}
                                className="w-full h-12 sm:h-14 bg-slate-900 dark:bg-[#13ec6d] text-white dark:text-slate-900 font-black uppercase tracking-widest text-[10px] sm:text-xs rounded-2xl hover:bg-[#13ec6d] hover:text-slate-900 transition-all flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-[#13ec6d]/20 overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                                <span>Support Cause</span>
                                <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                            {campaign.deadline && (
                                <p className="text-center text-[9px] sm:text-[10px] text-slate-400 font-black mt-4 uppercase tracking-[0.2em]">
                                    Ends: {new Date(campaign.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 bg-white dark:bg-[#111c16] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-200">event_busy</span>
                        <div>
                            <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No active campaigns</p>
                            <p className="text-slate-400 text-sm font-medium">Check back later for new relief efforts.</p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ExploreCampaigns;
