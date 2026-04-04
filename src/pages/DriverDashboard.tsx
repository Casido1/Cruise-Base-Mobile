import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';
import type { ContractProgress } from '../types';
import { ContractProgressBar } from '../components/vehicles/ContractProgressBar';
import { Building, Car, Calendar, CreditCard, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';

const DriverDashboard = () => {
    const user = useAuthStore((state) => state.user);
    const { data: progress, isLoading: isProgressLoading } = useQuery<ContractProgress>({
        queryKey: ['driver-progress'],
        queryFn: () => vehicleService.getDriverProgress('current'),
    });

    if (isProgressLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                {user?.companyLogo ? (
                    <img src={user.companyLogo} alt={user.companyName} className="size-14 rounded-2xl object-cover shadow-xl border border-slate-800" />
                ) : (
                    <div className="size-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <Building className="w-7 h-7 text-white" />
                    </div>
                )}
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">{user?.companyName || 'Driver Dashboard'}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Partner</p>
                    </div>
                </div>
            </div>

            {/* Ownership Progress */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1e293b]/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md relative overflow-hidden"
            >
                <div className="absolute -right-20 -top-20 size-60 bg-blue-500/5 rounded-full blur-3xl" />
                <ContractProgressBar
                    label="Ownership Progress"
                    totalValue={progress?.totalValue || 4500000}
                    paidAmount={progress?.paidAmount || 1200000}
                    percentage={progress?.percentage || 26.7}
                    color="#3b82f6"
                />
                <div className="mt-8 p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase tracking-[0.05em]">
                        Legal ownership transfers to you at <span className="text-blue-500 font-black">100%</span>.
                    </p>
                </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-[2rem] flex flex-col gap-4"
                >
                    <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit">
                        <Calendar className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Next Payment</p>
                        <p className="text-lg font-black text-white italic leading-tight">FEB 15</p>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-[2rem] flex flex-col gap-4"
                >
                    <div className="p-3 bg-blue-500/10 rounded-2xl w-fit">
                        <CreditCard className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Weekly Target</p>
                        <p className="text-lg font-black text-white italic leading-tight">₦45,000</p>
                    </div>
                </motion.div>
            </div>

            {/* Active Vehicle Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-slate-900/50 to-slate-800/20 border border-slate-800 p-6 rounded-[2.5rem] flex items-center justify-between group active:scale-[0.98] transition-all"
            >
                <div className="flex items-center gap-5">
                    <div className="size-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800">
                        <Car className="w-6 h-6 text-slate-500 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Current Vehicle</p>
                        <h4 className="text-lg font-black text-white">TOYOTA COROLLA</h4>
                        <p className="text-[10px] text-slate-600 font-bold tracking-widest">LND-458-KY • BLACK</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
            </motion.div>
        </div>
    );
};

export default DriverDashboard;
