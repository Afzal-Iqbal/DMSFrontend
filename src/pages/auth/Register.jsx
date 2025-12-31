import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import API from '@/api/axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Register = () => {
    const navigate = useNavigate();
    const [systemCode, setSystemCode] = useState('');

    useEffect(() => {
        // Generate random 6 character string
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setSystemCode(code);
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            adminCode: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Full name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
            password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm your password'),
            adminCode: Yup.string().optional()
        }),
        onSubmit: async (values) => {
            try {
                const { name, email, password, phone, adminCode } = values;
                await API.post('/auth/register', { name, email, password, phone, adminCode });
                alert("Account created successfully! Please sign in.");
                navigate('/login');
            } catch (err) {
                alert(err.response?.data?.message || "Registration failed. Please try again.");
            }
        },
    });

    return (
        <main className="flex min-h-screen bg-slate-50 dark:bg-[#0a0f0c] font-['Inter']">
            {/* Left Hero Side - Visible only on Desktop */}
            <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://placehold.co/600x800?text=Donation+System"
                        alt="Join our mission"
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                </div>

                {/* Brand Overlay */}
                <div className="relative z-10">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="size-10 bg-[#13ec6d] rounded-xl flex items-center justify-center shadow-lg shadow-[#13ec6d]/20 transition-transform group-hover:rotate-6">
                            <span className="material-symbols-outlined text-slate-900 text-[24px] font-bold">volunteer_activism</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white uppercase">
                            Donation<span className="text-[#13ec6d]">Hub</span>
                        </span>
                    </div>
                </div>

                {/* Testimonial & Features */}
                <div className="relative z-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-lg mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="flex h-2 w-2 rounded-full bg-[#13ec6d] animate-ping"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#13ec6d]">Community Growth</span>
                        </div>
                        <h2 className="text-3xl font-black text-white leading-tight mb-6">
                            "Being part of this community has been the most rewarding experience of my life."
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-full bg-blue-500 flex items-center justify-center font-black text-white">MK</div>
                            <div>
                                <p className="text-sm font-bold text-white leading-none">Marcus Knight</p>
                                <p className="text-xs text-slate-400 mt-1">Founding Member</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                            <div className="size-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-500">
                                <span className="material-symbols-outlined text-[20px]">groups</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-white tracking-widest">Global</p>
                                <p className="text-[9px] text-slate-400">10k+ Donors</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                            <div className="size-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                                <span className="material-symbols-outlined text-[20px]">stars</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-white tracking-widest">Impact</p>
                                <p className="text-[9px] text-slate-400">200+ Campaigns</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Side */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="w-full max-w-[480px]">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Join our Community</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Start making a difference today. Manage your donations easily.</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                            <div className="relative group">
                                <Input
                                    name="name"
                                    placeholder="Enter your full name"
                                    className="h-12 pl-11 bg-white dark:bg-[#0d1611] border-slate-200 dark:border-slate-800 focus:ring-[#13ec6d] rounded-2xl text-sm font-bold"
                                    {...formik.getFieldProps('name')}
                                />
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13ec6d] transition-colors text-[20px]">person</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="h-12 pl-11 bg-white dark:bg-[#0d1611] border-slate-200 dark:border-slate-800 focus:ring-[#13ec6d] rounded-2xl text-sm font-bold"
                                        {...formik.getFieldProps('email')}
                                    />
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13ec6d] transition-colors text-[20px]">mail</span>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Input
                                        name="phone"
                                        placeholder="+1 (555) 000-0000"
                                        className="h-12 pl-11 bg-white dark:bg-[#0d1611] border-slate-200 dark:border-slate-800 focus:ring-[#13ec6d] rounded-2xl text-sm font-bold"
                                        {...formik.getFieldProps('phone')}
                                    />
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13ec6d] transition-colors text-[20px]">phone</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                <div className="relative group">
                                    <Input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-12 pl-11 bg-white dark:bg-[#0d1611] border-slate-200 dark:border-slate-800 focus:ring-[#13ec6d] rounded-2xl text-sm font-bold"
                                        {...formik.getFieldProps('password')}
                                    />
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13ec6d] transition-colors text-[20px]">lock</span>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-12 pl-11 bg-white dark:bg-[#0d1611] border-slate-200 dark:border-slate-800 focus:ring-[#13ec6d] rounded-2xl text-sm font-bold"
                                        {...formik.getFieldProps('confirmPassword')}
                                    />
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13ec6d] transition-colors text-[20px]">lock_clock</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5 pb-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Code (Optional)</label>
                                <span className="text-[9px] font-black text-[#13ec6d] uppercase bg-[#13ec6d]/10 px-2 py-0.5 rounded">Session: {systemCode}</span>
                            </div>
                            <Input
                                name="adminCode"
                                type="password"
                                placeholder="Enter system secret for admin access"
                                className="h-12 px-5 bg-white dark:bg-[#0d1611] border-slate-200 dark:border-slate-800 focus:ring-[#13ec6d] rounded-2xl text-sm font-bold"
                                {...formik.getFieldProps('adminCode')}
                            />
                            <p className="text-[9px] text-slate-500 mt-1 pl-1 italic">
                                * To join as Admin, use the backend secret code.
                            </p>
                        </div>

                        <div className="px-1 flex items-start gap-2">
                            <input type="checkbox" required className="mt-1 size-4 rounded accent-[#13ec6d]" />
                            <p className="text-[11px] text-slate-500 font-medium">
                                I agree to the <span className="text-[#13ec6d] font-bold cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[#13ec6d] font-bold cursor-pointer hover:underline">Privacy Policy</span>.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full h-14 bg-[#13ec6d] text-slate-900 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-[#10d460] shadow-xl shadow-[#13ec6d]/20 transition-all mt-4"
                        >
                            {formik.isSubmitting ? "Generating Account..." : "Create Free Account"}
                        </Button>

                        <div className="text-center pt-8">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Already have an account?{" "}
                                <Link to="/login" className="text-[#13ec6d] font-black hover:underline">
                                    Log In
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Register;