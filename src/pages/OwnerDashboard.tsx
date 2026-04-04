import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicleService';
import { ContractProgressBar } from '../components/vehicles/ContractProgressBar';
import { useAuthStore } from '../store/useAuthStore';
import { Building, TrendingUp, Users, PieChart, Briefcase, Loader2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const OwnerDashboard = () => {
    const user = useAuthStore((state) => state.user);
    const { data: progress, isLoading: isProgressLoading } = useQuery({
        queryKey: ['owner-progress'],
        queryFn: () => vehicleService.getOwnerProgress('fleet-1'),
    });

    if (isProgressLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loading Overview...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                {user?.companyLogo ? (
                    <img src={user.companyLogo} alt={user.companyName} className="size-14 rounded-2xl object-cover shadow-xl border border-slate-800" />
                ) : (
                    <div className="size-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <Building className="w-7 h-7 text-white" />
                    </div>
                )}
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">{user?.companyName || 'Fleet Overview'}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <Briefcase className="w-3 h-3 text-emerald-500" />
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Partner Dashboard</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-[2rem] relative overflow-hidden"
                >
                    <div className="absolute -right-6 -bottom-6 opacity-5">
                        <TrendingUp className="size-20 text-emerald-500" />
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit mb-4">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-[9px] text-slate-500 font-black tracking-widest uppercase">Total Earnings</p>
                    <p className="text-lg font-black text-white mt-1 italic">₦12.4M</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-[2rem] relative overflow-hidden"
                >
                    <div className="absolute -right-6 -bottom-6 opacity-5">
                        <Users className="size-20 text-blue-500" />
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-2xl w-fit mb-4">
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-[9px] text-slate-500 font-black tracking-widest uppercase">Active Drivers</p>
                    <p className="text-lg font-black text-white mt-1 italic">14</p>
                </motion.div>
            </div>

            {/* Revenue Payout Progress */}
            <div className="space-y-5">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-emerald-500" />
                        Net Revenue Progress
                    </h3>
                </div>

                <div className="bg-[#1e293b]/50 border border-slate-800 p-8 rounded-[2.5rem]">
                    <ContractProgressBar
                        label="Net Payout (Owner)"
                        totalValue={progress?.totalValue || 4050000}
                        paidAmount={progress?.paidAmount || 1080000}
                        percentage={progress?.percentage || 26.7}
                        color="#10b981"
                    />
                </div>
            </div>

            {/* Fleet Status Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-slate-800/30 rounded-[2rem] border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                        <PieChart className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Fleet Status</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-xl font-black text-white italic tracking-tighter">92%</span>
                        <span className="text-[8px] text-emerald-500 font-black uppercase">+4%</span>
                    </div>
                </div>
                <div className="p-5 bg-slate-800/30 rounded-[2rem] border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                        <Plus className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Pipeline</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-xl font-black text-white italic tracking-tighter">3 NEW</span>
                        <span className="text-[8px] text-blue-500 font-black uppercase">Acquiring</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
