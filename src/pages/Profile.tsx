import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import type { User } from '../types';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { 
    User as UserIcon, 
    Mail, 
    Phone, 
    Calendar, 
    Shield, 
    LogOut, 
    ChevronRight, 
    Camera,
    Loader2,
    MapPin,
    Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    const { logout } = useAuthStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { data: userDetails, isLoading } = useQuery<User & { firstName?: string; lastName?: string; phoneNumber?: string; roles?: string[]; pictures?: { pictureUrl: string }[] }>({
        queryKey: ['userDetails'],
        queryFn: authService.getUserDetails,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syncing Profile...</p>
            </div>
        );
    }

    const menuItems = [
        { label: 'Security & Privacy', icon: Shield, color: 'blue' },
        { label: 'Address & Locations', icon: MapPin, color: 'emerald' },
        { label: 'App Settings', icon: Settings, color: 'slate' },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header / Hero Section */}
            <div className="relative pt-6 pb-2 px-2 text-center">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative inline-block mx-auto"
                >
                    <div className="size-32 rounded-full border-4 border-[#1e293b] p-1 bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-2xl shadow-blue-900/20">
                        {userDetails?.pictures?.[0]?.pictureUrl ? (
                            <img src={userDetails.pictures[0].pictureUrl} className="size-full rounded-full object-cover" />
                        ) : (
                            <div className="size-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-black text-white">
                                {userDetails?.firstName?.[0]}
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="absolute bottom-1 right-1 p-2 bg-white rounded-full text-black shadow-lg hover:scale-110 active:scale-95 transition-all"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                </motion.div>

                <div className="mt-6">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                        {userDetails?.firstName} {userDetails?.lastName}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md">
                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{userDetails?.roles?.[0] || 'Member'}</span>
                        </div>
                        <span className="text-slate-700">•</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID: {userDetails?.id?.slice(0, 8)}</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1e293b]/50 border border-slate-800 p-5 rounded-3xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Member Since</p>
                    <p className="text-sm font-black text-white mt-1 uppercase italic">Oct 2023</p>
                </div>
                <div className="bg-[#1e293b]/50 border border-slate-800 p-5 rounded-3xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Trusted Score</p>
                    <p className="text-sm font-black text-emerald-500 mt-1 uppercase italic">4.9 / 5.0</p>
                </div>
            </div>

            {/* Profile Info Section */}
            <div className="bg-[#1e293b]/50 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Contact Information</h3>
                    <button onClick={() => setIsEditModalOpen(true)} className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Edit</button>
                </div>
                <div className="divide-y divide-slate-800/50">
                    {[
                        { label: 'Email Address', value: userDetails?.email, icon: Mail },
                        { label: 'Phone Number', value: userDetails?.phoneNumber, icon: Phone },
                        { label: 'Primary Region', value: 'Lagos, NG', icon: Calendar },
                    ].map((item, i) => (
                        <div key={i} className="px-6 py-5 flex items-start gap-4">
                            <div className="p-2.5 bg-slate-900 rounded-xl text-slate-500">
                                <item.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{item.label}</p>
                                <p className="text-sm font-bold text-white truncate">{item.value || 'Not Configured'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Settings & Menu Section */}
            <div className="space-y-3">
                {menuItems.map((item, i) => (
                    <button key={i} className="w-full bg-[#1e293b]/30 border border-slate-800 px-6 py-5 rounded-[2rem] flex items-center justify-between group active:scale-[0.98] transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 bg-${item.color}-500/10 rounded-xl`}>
                                <item.icon className={`w-4 h-4 text-${item.color}-500`} />
                            </div>
                            <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-700" />
                    </button>
                ))}
            </div>

            {/* Logout Button */}
            <button 
                onClick={logout}
                className="w-full bg-red-500/5 border border-red-500/10 py-5 rounded-[2rem] flex items-center justify-center gap-3 text-red-500 active:bg-red-500 active:text-white transition-all mb-10"
            >
                <LogOut className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-[0.2em] pt-0.5">Secure Log Out</span>
            </button>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={userDetails}
            />
        </div>
    );
};

export default ProfilePage;
