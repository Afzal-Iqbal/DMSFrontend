import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import API from '@/api/axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, token, user } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token && user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [token, user, navigate]);

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().required('Email or Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                setError('');
                const res = await API.post('/auth/login', values);
                login(res.data.user, res.data.token);

                if (res.data.user.role === 'admin') {
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    navigate('/dashboard', { replace: true });
                }
            } catch (err) {
                setError(err.response?.data?.message || "Invalid credentials. Please try again.");
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
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#13ec6d]">Verified Impact</span>
                        </div>
                        <h2 className="text-3xl font-black text-white leading-tight mb-6">
                            "Joining DonationHub connected me with causes I truly care about. It's seamless and transparent."
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-full bg-[#13ec6d] flex items-center justify-center font-black text-slate-900">SJ</div>
                            <div>
                                <p className="text-sm font-bold text-white leading-none">Sarah Jenkins</p>
                                <p className="text-xs text-slate-400 mt-1">Community Member since 2021</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                            <div className="size-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-white tracking-widest">Secure</p>
                                <p className="text-[9px] text-slate-400">Encrypted data</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                            <div className="size-10 bg-[#13ec6d]/20 rounded-xl flex items-center justify-center text-[#13ec6d]">
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-white tracking-widest">Transparent</p>
                                <p className="text-[9px] text-slate-400">Track your impact</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Side */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="w-full max-w-[400px]">
                    {/* Mobile Only Brand */}
                    <div className="lg:hidden flex justify-center mb-10">
                        <div className="flex items-center gap-2">
                            <div className="size-9 bg-[#13ec6d] rounded-xl flex items-center justify-center shadow-lg shadow-[#13ec6d]/20">
                                <span className="material-symbols-outlined text-slate-900 text-[20px] font-bold">volunteer_activism</span>
                            </div>
                            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                                DonationHub
                            </span>
                        </div>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Continue your journey of making a difference today.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-xs flex items-center gap-3 font-bold">
                            <span className="material-symbols-outlined text-[20px]">error_outline</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <Input
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder="name@example.com"
                                    className={`h-14 pl-12 bg-white dark:bg-[#0d1611] border-slate-200 dark:border-slate-800 focus:ring-[#13ec6d] text-sm font-bold transition-all rounded-2xl ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'group-hover:border-[#13ec6d]/50'}`}
                                    {...formik.getFieldProps('email')}
                                />
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13ec6d] transition-colors text-[20px]">
                                    mail
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                            </div>
                            <div className="relative group">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`h-14 pl-12 pr-12 bg-white dark:bg-[#0d1611] border-slate-200 dark:border-slate-800 focus:ring-[#13ec6d] text-sm font-bold transition-all rounded-2xl ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'group-hover:border-[#13ec6d]/50'}`}
                                    {...formik.getFieldProps('password')}
                                />
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13ec6d] transition-colors text-[20px]">
                                    lock
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#13ec6d] transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? 'visibility' : 'visibility_off'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="size-4 rounded border-slate-200 group-hover:border-[#13ec6d] transition-all accent-[#13ec6d]" />
                                <span className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">Remember me</span>
                            </label>
                            <button type="button" className="text-xs font-black uppercase tracking-widest text-[#13ec6d] hover:underline">
                                Forgot password?
                            </button>
                        </div>

                        <Button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full h-14 bg-[#13ec6d] text-slate-900 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-[#10d460] shadow-xl shadow-[#13ec6d]/20 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {formik.isSubmitting ? "Authenticating..." : "Sign In to Account"}
                        </Button>



                        <div className="text-center pt-8">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-[#13ec6d] font-black hover:underline">
                                    Create one now
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Login;