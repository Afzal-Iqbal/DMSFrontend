import { useEffect, useState } from 'react';
import API from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";

const AdminOverview = () => {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [stats, setStats] = useState({
        totalDonations: 0,
        pendingReviews: 0,
        totalDonors: 0,
        avgDonation: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await API.put(`/admin/donations/${id}/status`, { status: newStatus });
            const [donationsRes, statsRes] = await Promise.all([
                API.get('/admin/donations'),
                API.get('/admin/stats')
            ]);
            setDonations(donationsRes.data.data);
            setStats(statsRes.data.data);
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update status");
        }
    };

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [donationsRes, statsRes] = await Promise.all([
                    API.get('/admin/donations'),
                    API.get('/admin/stats')
                ]);
                setDonations(donationsRes.data.data);
                setStats(statsRes.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
                setLoading(false);
            }
        };

        fetchAdminData();
        const interval = setInterval(fetchAdminData, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const filteredDonations = donations.filter(d =>
        d.donor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.campaign?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen bg-[#f8faf9] dark:bg-[#0a0f0c]">
            <div className="size-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Admin Suite...</p>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#f8faf9] dark:bg-[#0a0f0c] font-['Inter']">
            {/* Admin Top Header */}
            <div className="bg-white dark:bg-[#111c16] border-b border-slate-200 dark:border-slate-800/50 sticky top-16 z-10 shadow-sm shadow-slate-200/20 dark:shadow-none">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                            <div className="size-2 bg-blue-600 rounded-full animate-pulse"></div>
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Command Center</h2>
                            <span className="px-2 py-0.5 bg-blue-600/10 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-md animate-pulse">Live</span>
                        </div>
                        <p className="hidden xs:block text-slate-400 font-medium text-[9px] sm:text-xs uppercase tracking-widest sm:pl-4">Real-time system health and metrics</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/campaigns')}
                        className="w-full sm:w-auto bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        New Campaign
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
                    <div className="bg-white dark:bg-[#111c16] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/40 dark:shadow-none">
                        <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-4">Volume</p>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter truncate">${stats.totalDonations.toLocaleString()}</p>
                    </div>

                    <div className="bg-white dark:bg-[#111c16] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all hover:scale-[1.02]">
                        <p className="text-amber-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-4">Pending</p>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.pendingReviews}</p>
                    </div>

                    <div className="hidden xs:block bg-white dark:bg-[#111c16] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/40 dark:shadow-none">
                        <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-4">Donors</p>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.totalDonors}</p>
                    </div>

                    <div className="hidden lg:block bg-white dark:bg-[#111c16] rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/40 dark:shadow-none">
                        <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-4">Avg Ticket</p>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${stats.avgDonation.toFixed(2)}</p>
                    </div>
                </div>

                {/* Donation Log Section */}
                <div className="bg-white dark:bg-[#111c16] border border-slate-100 dark:border-slate-800/50 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
                    <div className="p-5 sm:p-6 border-b border-slate-50 dark:border-slate-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
                        <h3 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Transaction Log</h3>
                        <div className="relative group w-full sm:w-auto">
                            <Input
                                className="pl-10 pr-4 h-11 w-full sm:w-64 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl text-xs transition-all group-hover:border-blue-500/50"
                                placeholder="Search by donor or cause..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden lg:block">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 dark:border-slate-800/50">
                                    <th className="py-5 px-8">Donor</th>
                                    <th className="py-5 px-8">Campaign / Category</th>
                                    <th className="py-5 px-8">Amount</th>
                                    <th className="py-5 px-8">Status</th>
                                    <th className="py-5 px-8 text-right">Audit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {filteredDonations.map((d, i) => {
                                    const isRecent = new Date() - new Date(d.date || d.createdAt) < 5 * 60 * 1000;
                                    return (
                                        <tr key={d._id} className={`${isRecent ? 'bg-blue-50/50 dark:bg-blue-900/5' : ''} hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group animate-in fade-in slide-in-from-bottom-2 duration-300`} style={{ animationDelay: `${i * 30}ms` }}>
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-xl bg-blue-600/10 flex items-center justify-center font-black text-xs text-blue-600">
                                                        {d.donor?.name?.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none mb-1">{d.donor?.name}</span>
                                                        <span className="text-[10px] font-medium text-slate-400 lowercase">{d.donor?.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none mb-1">{d.campaign?.title || 'General Fund'}</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{d.category}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8 font-black text-slate-900 dark:text-white tabular-nums">
                                                ${d.amount.toFixed(2)}
                                            </td>
                                            <td className="py-5 px-8">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${d.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    <span className={`size-1.5 rounded-full ${d.status === 'Verified' ? 'bg-green-600' : 'bg-amber-600 animate-pulse'}`}></span>
                                                    {d.status}
                                                </span>
                                            </td>
                                            <td className="py-5 px-8 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleStatusUpdate(d._id, 'Verified')} className="size-8 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[18px]">verified</span>
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(d._id, 'Pending')} className="size-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[18px]">flag</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile/Tablet Cards */}
                    <div className="lg:hidden divide-y divide-slate-50 dark:divide-slate-800/50">
                        {filteredDonations.length > 0 ? filteredDonations.map((d, i) => (
                            <div key={d._id} className="p-5 flex flex-col gap-4 bg-white dark:bg-[#111c16]">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 rounded-xl bg-blue-600/10 flex items-center justify-center font-black text-xs text-blue-600">
                                            {d.donor?.name?.charAt(0)}
                                        </div>
                                        <div className="flex flex-col leading-tight">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{d.donor?.name}</span>
                                            <span className="text-[10px] text-slate-400">{d.campaign?.title || 'General Fund'}</span>
                                        </div>
                                    </div>
                                    <span className="text-base font-black text-slate-900 dark:text-white">${d.amount.toFixed(2)}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${d.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        <span className={`size-1 rounded-full ${d.status === 'Verified' ? 'bg-green-600' : 'bg-amber-600'}`}></span>
                                        {d.status}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleStatusUpdate(d._id, 'Verified')} className="h-9 px-4 bg-green-50 dark:bg-green-900/10 text-green-600 rounded-xl text-[9px] font-black uppercase tracking-widest">Verify</button>
                                        <button onClick={() => handleStatusUpdate(d._id, 'Pending')} className="h-9 px-4 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest">Flag</button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center grayscale opacity-30 px-5">
                                <span className="material-symbols-outlined text-5xl mb-2">database_off</span>
                                <p className="text-[10px] font-black uppercase tracking-widest">No matching records found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;