import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import {
    LayoutDashboard,
    Wallet,
    Car,
    Users,
    LogOut,
    Bell,
    User as UserIcon,
    Menu,
    X,
    Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationBell } from './NotificationBell';

export const Layout = () => {
    const { user, logout } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { data: userDetails } = useQuery({
        queryKey: ['userDetails'],
        queryFn: authService.getUserDetails,
        enabled: !!user,
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: user?.role === 'SuperAdmin' ? '/superadmin' : `/${user?.role?.toLowerCase()}`, icon: LayoutDashboard, roles: ['Admin', 'SuperAdmin', 'Owner', 'Driver'] },
        { name: 'Wallet', path: '/wallet', icon: Wallet, roles: ['Owner', 'Driver'] },
        { name: 'Fleet', path: user?.role === 'Driver' ? '/driver/vehicle' : user?.role === 'SuperAdmin' ? '/superadmin/vehicles' : user?.role === 'Admin' ? '/admin/vehicles' : '/owner/fleet', icon: Car, roles: ['Admin', 'SuperAdmin', 'Owner', 'Driver'] },
        { name: 'Profile', path: '/profile', icon: UserIcon, roles: ['Admin', 'SuperAdmin', 'Owner', 'Driver'] },
    ].filter(link => !link.roles || (user && link.roles.includes(user.role)));

    const adminLinks = [
        { name: 'Company Oversight', path: '/superadmin/companies', icon: Building, roles: ['SuperAdmin'] },
        { name: 'User Management', path: '/admin/users', icon: Users, roles: ['Admin', 'SuperAdmin'] },
        { name: 'Fleet Management', path: '/admin/vehicles', icon: Car, roles: ['Admin', 'SuperAdmin'] },
    ].filter(link => !link.roles || (user && link.roles.includes(user.role)));

    return (
        <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-200">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 h-16 bg-[#1e293b]/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 safe-top">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-xs">
                        CB
                    </div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        CruiseBase
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationBell />
                    {(user?.role === 'Admin' || user?.role === 'SuperAdmin') && (
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pb-24 overflow-x-hidden">
                <div className="p-5 max-w-md mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation Tab Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1e293b]/95 backdrop-blur-lg border-t border-slate-800 pb-safe-bottom">
                <div className="flex justify-around items-center h-16 px-2">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`flex flex-col items-center justify-center flex-1 transition-all duration-200 relative ${
                                    isActive ? 'text-blue-500' : 'text-slate-500'
                                }`}
                            >
                                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : 'scale-100'}`} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{link.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -top-[1px] left-1/4 right-1/4 h-0.5 bg-blue-500 rounded-full"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Admin Side Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 z-[70] w-3/4 max-w-sm bg-[#1e293b] shadow-2xl border-l border-slate-800"
                        >
                            <div className="flex flex-col h-full p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-white">Admin Menu</h3>
                                    <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-2 flex-1">
                                    {adminLinks.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <button
                                                key={link.path}
                                                onClick={() => {
                                                    navigate(link.path);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-medium"
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span>{link.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="mt-auto w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
