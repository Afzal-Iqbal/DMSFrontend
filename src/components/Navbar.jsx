import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logout, user, isAdmin } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Dashboard', path: isAdmin ? '/admin/dashboard' : '/dashboard', show: true },
        { name: 'Explore', path: '/campaigns', show: true },
        { name: 'Donate', path: '/donate', show: !isAdmin }, // Hide donate from admin if they primarily manage
        { name: 'Reviews', path: '/reviews', show: true },
        { name: 'Contact Us', path: '/contact', show: true },
        { name: 'Manage Campaigns', path: '/admin/campaigns', show: isAdmin, special: 'amber' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0f0c]/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 font-['Inter']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-4 lg:gap-8">
                        <Link to="/dashboard" className="flex items-center gap-2 group min-w-fit">
                            <div className="size-8 sm:size-9 bg-[#13ec6d] rounded-xl flex items-center justify-center shadow-lg shadow-[#13ec6d]/20 transition-transform group-hover:rotate-6">
                                <span className="material-symbols-outlined text-slate-900 text-[18px] sm:text-[20px] font-bold">volunteer_activism</span>
                            </div>
                            <span className="text-lg sm:text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase transition-colors group-hover:text-[#13ec6d]">
                                Don<span className="md:hidden">.</span><span className="hidden md:inline">ation</span><span className="text-[#13ec6d] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Hub</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.filter(l => l.show).map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive(link.path)
                                        ? (link.special === 'blue' ? 'bg-blue-600/10 text-blue-600' : link.special === 'amber' ? 'bg-amber-600/10 text-amber-600' : 'bg-[#13ec6d]/10 text-[#13ec6d]')
                                        : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden xs:flex flex-col items-end mr-1 sm:mr-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#13ec6d]">
                                {isAdmin ? 'Administrator' : 'Donator'}
                            </span>
                            <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-none truncate max-w-[100px]">
                                {user?.name || 'User Account'}
                            </span>
                        </div>

                        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="hidden sm:flex h-9 px-3 sm:px-4 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            <span className="hidden md:inline">Logout</span>
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden size-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400"
                        >
                            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 w-full bg-white dark:bg-[#0d1611] border-b border-slate-200 dark:border-slate-800/50 shadow-2xl animate-in slide-in-from-top duration-300">
                    <div className="p-4 space-y-2">
                        {navLinks.filter(l => l.show).map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${isActive(link.path)
                                    ? (link.special === 'blue' ? 'bg-blue-600 text-white' : link.special === 'amber' ? 'bg-amber-600 text-white' : 'bg-[#13ec6d] text-slate-900')
                                    : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {link.path === '/dashboard' ? 'dashboard' : link.path === '/campaigns' ? 'explore' : link.path === '/donate' ? 'favorite' : link.path === '/reviews' ? 'reviews' : link.path === '/contact' ? 'contact_support' : 'admin_panel_settings'}
                                </span>
                                {link.name}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-red-50 dark:bg-red-900/10 text-red-600 transition-all"
                        >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            Logout Session
                        </button>

                        <div className="xs:hidden pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between px-2 text-slate-400">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#13ec6d]">Active User</span>
                                <span className="text-[11px] font-bold text-slate-900 dark:text-white">{user?.name}</span>
                            </div>
                            <div className="size-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black text-xs">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;