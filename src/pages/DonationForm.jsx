import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import API from '@/api/axios';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from '@/context/AuthContext';

const DonationForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [amount, setAmount] = useState('50');
    const [donationType, setDonationType] = useState('Zakat');
    const [category, setCategory] = useState(location.state?.campaign?.defaultCategory || '');
    const [paymentMethod, setPaymentMethod] = useState('Online');
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(location.state?.campaign?._id || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const chips = ['10', '50', '100', '200', 'Custom'];

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await API.get('/campaigns');
                setCampaigns(res.data.data);
            } catch (err) {
                console.error("Error fetching campaigns:", err);
            }
        };
        fetchCampaigns();
    }, []);

    const handleDownloadReceipt = (donation) => {
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
        doc.text(`Receipt ID: ${donation._id?.substring(0, 8).toUpperCase() || 'NEW'}`, 105, 50, { align: "center" });
        doc.text(`Issued on: ${new Date().toLocaleDateString()}`, 105, 55, { align: "center" });

        // Donor Info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Donor Information", 20, 75);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${user.name}`, 20, 85);
        doc.text(`Email: ${user.email}`, 20, 92);

        // Table
        autoTable(doc, {
            startY: 110,
            head: [['Description', 'Details']],
            body: [
                ['Date', new Date(donation.date || Date.now()).toLocaleDateString()],
                ['Campaign', campaigns.find(c => c._id === selectedCampaign)?.title || 'General Fund'],
                ['Category', donation.category],
                ['Type', donation.type],
                ['Payment Method', donation.paymentMethod || 'Online'],
                ['Status', donation.status || 'Pending']
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
        doc.text(`Total Amount: $${Number(donation.amount).toFixed(2)}`, 105, finalY + 13, { align: "center" });

        // Footer
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("Thank you for your generous contribution to DonationHub!", 105, finalY + 45, { align: "center" });
        doc.text("Empowering change, one contribution at a time.", 105, finalY + 50, { align: "center" });

        doc.save(`DonationHub_Receipt_${donation._id?.substring(0, 8) || 'new'}.pdf`);
    };

    const handleSubmit = async () => {
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        setIsSubmitting(true);
        try {
            const donationData = {
                amount: Number(amount),
                type: donationType,
                category: category || 'General',
                paymentMethod: paymentMethod,
                campaignId: selectedCampaign || null
            };
            const response = await API.post('/donations/submit', donationData);
            if (window.confirm("Thank you! Your donation was successful. Would you like to download your receipt now?")) {
                handleDownloadReceipt(response.data.data);
            }
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || "Transaction failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex-1 flex flex-col items-center justify-start py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-[#f6f8f7] dark:bg-[#102218] min-h-screen font-['Inter']">
            <div className="w-full max-w-[800px] flex flex-col gap-4 sm:gap-6">

                <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-[#13ec6d] transition-colors w-fit group">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Back to Dashboard</span>
                </Link>

                <div className="flex flex-col gap-1 sm:gap-2 text-center sm:text-left mb-2">
                    <h1 className="text-slate-900 dark:text-white text-2xl sm:text-4xl font-black tracking-tight leading-tight">Make a Difference Today</h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm sm:text-base">Complete the secure form below to contribute to our cause.</p>
                </div>

                <div className="bg-white dark:bg-[#152a1f] rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 p-5 sm:p-8">

                    {/* Amount Section */}
                    <div className="mb-6 sm:mb-8">
                        <label className="block text-slate-900 dark:text-white text-xs sm:text-sm font-black uppercase tracking-widest mb-3">Donation Amount ($)</label>
                        <div className="relative mb-4">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white font-bold text-xl">$</span>
                            <input
                                id="amount-input"
                                className="form-input flex w-full rounded-2xl text-slate-900 dark:text-white border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#102218] focus:border-[#13ec6d] h-14 sm:h-16 pl-10 pr-4 text-xl sm:text-2xl font-black outline-none transition-all"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 sm:gap-3 flex-wrap">
                            {chips.map(val => (
                                <button
                                    key={val}
                                    onClick={() => {
                                        if (val === 'Custom') {
                                            document.getElementById('amount-input').focus();
                                        } else {
                                            setAmount(val);
                                        }
                                    }}
                                    className={`flex h-10 sm:h-11 items-center justify-center rounded-xl px-4 sm:px-6 border text-[11px] sm:text-xs font-black uppercase tracking-widest transition-all ${amount === val || (val === 'Custom' && !['10', '50', '100', '200'].includes(amount)) ? 'bg-[#13ec6d] border-[#13ec6d] text-slate-900' : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-400 hover:text-[#13ec6d] hover:bg-[#13ec6d]/10'}`}
                                    type="button"
                                >
                                    {val === 'Custom' ? 'Custom' : `$${val}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
                        {/* Campaign Selection */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-900 dark:text-white text-[10px] sm:text-xs font-black uppercase tracking-widest">Target Campaign</label>
                            <div className="relative">
                                <select
                                    value={selectedCampaign}
                                    onChange={(e) => setSelectedCampaign(e.target.value)}
                                    className="w-full h-14 rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#102218] text-slate-900 dark:text-white text-sm font-bold focus:border-[#13ec6d] px-4 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">General Fund (No Specific Campaign)</option>
                                    {campaigns.map(c => (
                                        <option key={c._id} value={c._id}>{c.title}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</span>
                            </div>
                        </div>

                        {/* Donation Type Selection */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-900 dark:text-white text-[10px] sm:text-xs font-black uppercase tracking-widest">Donation Type</label>
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                {['Zakat', 'Sadqah', 'Fitra', 'General'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setDonationType(type)}
                                        className={`flex flex-col items-center justify-center h-16 sm:h-20 rounded-2xl border transition-all ${donationType === type ? 'border-[#13ec6d] bg-[#13ec6d]/5 text-[#13ec6d]' : 'border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#102218] text-slate-400'}`}
                                        type="button"
                                    >
                                        <span className="material-symbols-outlined mb-1 text-[20px] sm:text-[24px]">{type === 'Zakat' ? 'volunteer_activism' : 'payments'}</span>
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-8">
                        {/* Category Dropdown */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-900 dark:text-white text-[10px] sm:text-xs font-black uppercase tracking-widest">Category</label>
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full h-14 rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#102218] text-slate-900 dark:text-white text-sm font-bold focus:border-[#13ec6d] px-4 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">Select a category</option>
                                    <option value="Food">Food & Hunger Relief</option>
                                    <option value="Education">Education & Schooling</option>
                                    <option value="Medical">Medical & Healthcare</option>
                                    <option value="Meal">Meal Distribution</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</span>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-900 dark:text-white text-[10px] sm:text-xs font-black uppercase tracking-widest">Payment Method</label>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {['Online', 'Bank', 'Cash'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`flex flex-col items-center justify-center h-14 sm:h-14 rounded-2xl border transition-all ${paymentMethod === method ? 'border-[#13ec6d] bg-[#13ec6d]/5 text-[#13ec6d]' : 'border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#102218] text-slate-400'}`}
                                        type="button"
                                    >
                                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{method}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submission Button */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full relative flex items-center justify-center gap-3 h-14 sm:h-16 bg-[#13ec6d] hover:bg-green-400 text-slate-900 font-black text-xs sm:text-sm uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-[#13ec6d]/20 transition-all disabled:opacity-50 overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <span className="material-symbols-outlined text-[20px] sm:text-[24px]">favorite</span>
                            <span>{isSubmitting ? "Processing Transaction..." : "Complete Donation"}</span>
                        </button>
                        <p className="text-center text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            Secure 256-bit encrypted transaction
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DonationForm;