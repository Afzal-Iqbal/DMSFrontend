import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/axios';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from '@/context/AuthContext';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [donations, setDonations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, count: 0 });

  const handleDownloadReceipt = (donation) => {
    if (donation.status !== 'Verified') {
      alert("Receipt available only for verified donations.");
      return;
    }
    const doc = new jsPDF();

    // Header
    doc.setFillColor(19, 236, 109);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("DONATION RECEIPT", 105, 25, { align: "center" });

    // Meta Info
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Receipt ID: ${donation._id.substring(0, 8).toUpperCase()}`, 105, 50, { align: "center" });
    doc.text(`Issued on: ${new Date().toLocaleDateString()}`, 105, 55, { align: "center" });

    // Donor Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Donor Information", 20, 75);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${user?.name || ''}`, 20, 85);
    doc.text(`Email: ${user?.email || ''}`, 20, 92);

    // Table
    autoTable(doc, {
      startY: 110,
      head: [['Description', 'Details']],
      body: [
        ['Date', new Date(donation.createdAt).toLocaleDateString()],
        ['Campaign', donation.campaign?.title || 'General Fund'],
        ['Category', donation.category],
        ['Type', donation.type],
        ['Payment Method', donation.paymentMethod || 'Online'],
        ['Status', donation.status]
      ],
      theme: 'grid',
      headStyles: { fillColor: [19, 236, 109] },
      columnStyles: { 0: { fontStyle: 'bold', width: 50 } }
    });

    const finalY = doc.lastAutoTable.finalY + 15;

    // Total Amount Box
    doc.setFillColor(245, 245, 245);
    doc.rect(20, finalY, 170, 20, 'F');
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: $${donation.amount.toFixed(2)}`, 105, finalY + 13, { align: "center" });

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your generous contribution to DonationHub!", 105, finalY + 45, { align: "center" });
    doc.text("Empowering change, one contribution at a time.", 105, finalY + 50, { align: "center" });

    if (donation.status === 'Verified') {
      doc.setTextColor(19, 236, 109);
      doc.setFont("helvetica", "bold");
      doc.text("VERIFIED BY ADMIN", 105, finalY + 30, { align: "center" });
    }

    doc.save(`DonationHub_Receipt_${donation._id.substring(0, 8)}.pdf`);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get('/donations/my-donations');
        const donationData = response.data.data;
        setDonations(donationData);
        const totalImpact = donationData.reduce((acc, curr) => acc + curr.amount, 0);
        setStats({ total: totalImpact, count: donationData.length });
        setDataLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setDataLoading(false);
      }
    };
    if (user) fetchDashboardData();
  }, [user]);

  if (loading || dataLoading) return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen bg-[#f8faf9] dark:bg-[#0a0f0c]">
      <div className="size-12 border-4 border-[#13ec6d]/20 border-t-[#13ec6d] rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Impact...</p>
    </div>
  );

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-['Inter']">

      {isAdmin && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
            <div className="size-10 bg-blue-600/10 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-blue-600">admin_panel_settings</span>
            </div>
            <div>
              <p className="text-sm font-black text-blue-900 dark:text-blue-100 uppercase tracking-wide">Administrator Controls</p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400">Access management dashboard and system metrics</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="w-full sm:w-auto text-[10px] font-black uppercase tracking-[0.2em] bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all"
          >
            Enter Admin Suite
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
        <div className="flex flex-col gap-1 sm:gap-2 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Welcome back, <br className="sm:hidden" />
            <span className="text-[#13ec6d]">{user?.name.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg">
            You've contributed to <span className="font-bold text-slate-900 dark:text-slate-200">{stats.count}</span> impactful causes.
          </p>
        </div>
        <button
          onClick={() => navigate('/donate')}
          className="group relative flex items-center justify-center gap-3 h-12 sm:h-14 px-6 sm:px-8 rounded-2xl bg-slate-900 dark:bg-[#13ec6d] text-white dark:text-slate-900 font-black uppercase tracking-widest text-[10px] sm:text-xs hover:scale-[1.02] transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">favorite</span>
          <span>Start New Donation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="md:col-span-2 relative overflow-hidden bg-white dark:bg-[#111c16] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/50 dark:shadow-none group">
          <div className="absolute -right-12 -top-12 size-36 sm:size-48 bg-[#13ec6d]/10 rounded-full blur-3xl group-hover:bg-[#13ec6d]/20 transition-colors"></div>
          <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[9px] sm:text-[10px] mb-2">Total Financial Impact</p>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
              ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-green-600 dark:text-[#13ec6d] text-[10px] sm:text-xs font-bold">
            <span className="material-symbols-outlined text-[14px] sm:text-[16px]">trending_up</span>
            100% Tax Deductible
          </div>
        </div>

        <div className="bg-[#13ec6d] dark:bg-[#13ec6d]/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-[#13ec6d]/20 group">
          <div className="flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start">
            <div className="size-10 sm:size-12 bg-white/20 rounded-2xl flex items-center justify-center text-slate-900 mb-0 md:mb-6 group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined text-xl sm:text-2xl">volunteer_activism</span>
            </div>
            <div className="text-right md:text-left">
              <p className="text-slate-900/60 font-black uppercase tracking-widest text-[9px] sm:text-[10px] mb-1">Contributions</p>
              <p className="text-3xl sm:text-4xl font-black text-slate-900">{stats.count}</p>
            </div>
          </div>
          <p className="hidden md:block text-xs text-slate-900/70 font-medium leading-relaxed mt-6">
            Your consistent support helps us change lives every day.
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Donations</h3>
          <button className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#13ec6d] transition-colors">View All History</button>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block bg-white dark:bg-[#111c16] border border-slate-100 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="py-5 px-8">Date</th>
                  <th className="py-5 px-8">Cause / Category</th>
                  <th className="py-5 px-8">Amount</th>
                  <th className="py-5 px-8">Status</th>
                  <th className="py-5 px-8 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {donations.length > 0 ? donations.map((d, i) => (
                  <tr key={d._id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="py-5 px-8 text-sm text-slate-500 dark:text-slate-400 font-medium tabular-nums">
                      {new Date(d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-200">{d.campaign?.title || 'General Fund'}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{d.category}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-sm font-black text-slate-900 dark:text-white tabular-nums">
                      ${d.amount.toFixed(2)}
                    </td>
                    <td className="py-5 px-8">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${d.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        <span className={`size-1.5 rounded-full bg-current ${d.status === 'Verified' ? '' : 'animate-pulse'}`}></span>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <button
                        onClick={() => handleDownloadReceipt(d)}
                        className="size-9 bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-[#13ec6d] hover:bg-[#13ec6d]/10 rounded-xl transition-all flex items-center justify-center ml-auto"
                      >
                        <span className="material-symbols-outlined text-[20px]">file_download</span>
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 grayscale opacity-30">
                        <span className="material-symbols-outlined text-6xl">history</span>
                        <p className="text-sm font-bold uppercase tracking-widest">No history found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-3">
          {donations.length > 0 ? donations.map((d, i) => (
            <div key={d._id} className="bg-white dark:bg-[#111c16] p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {new Date(d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {d.campaign?.title || 'General Fund'}
                  </span>
                  <span className="text-[9px] font-black uppercase text-[#13ec6d] tracking-[0.2em]">{d.category}</span>
                </div>
                <span className="text-lg font-black text-slate-900 dark:text-white">${d.amount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/50">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${d.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  <span className={`size-1 rounded-full bg-current ${d.status === 'Verified' ? '' : 'animate-pulse'}`}></span>
                  {d.status}
                </span>
                <button
                  onClick={() => handleDownloadReceipt(d)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500"
                >
                  <span className="material-symbols-outlined text-[16px]">file_download</span>
                  Receipt
                </button>
              </div>
            </div>
          )) : (
            <div className="bg-white dark:bg-[#111c16] p-10 rounded-3xl text-center grayscale opacity-30">
              <span className="material-symbols-outlined text-5xl mb-2">history</span>
              <p className="text-xs font-black uppercase tracking-widest">No history yet</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default UserDashboard;