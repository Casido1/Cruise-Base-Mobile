import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicleService';
import type { Vehicle } from '../types';
import { ContractProgressBar } from '../components/vehicles/ContractProgressBar';
import { useAuthStore } from '../store/useAuthStore';
import { Building, TrendingUp, Users, PieChart, Briefcase, Loader2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const OwnerDashboard = () => {
    const user = useAuthStore((state) => state.user);
    
    const { data: vehicles, isLoading: isVehiclesLoading } = useQuery({
        queryKey: ['fleet-vehicles'],
        queryFn: () => (user?.role === 'Owner')
            ? vehicleService.getVehiclesByUserId('current') 
            : vehicleService.getVehicles(),
        enabled: !!user,
    });

    // Fetch progress for the first vehicle as a representative example 
    // or we could aggregate, but for now let's use the first one if available.
    const firstVehicleId = vehicles?.[0]?.id;
    const { data: progress, isLoading: isProgressLoading } = useQuery({
        queryKey: ['owner-progress', firstVehicleId],
        queryFn: () => vehicleService.getOwnerProgress(firstVehicleId!),
        enabled: !!firstVehicleId,
    });

    if (isVehiclesLoading || (firstVehicleId && isProgressLoading)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loading Overview...</p>
            </div>
        );
    }

    const totalEarnings = vehicles?.reduce((acc: number, v: Vehicle) => acc + (v.totalEarned || 0), 0) || 0;
    const activeDrivers = vehicles?.filter((v: Vehicle) => v.driverId && (v.status ?? v.isActive)).length || 0;
    const fleetHealth = 98; // Calculate health if we have more data, for now placeholder
    const totalVehicles = vehicles?.length || 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">


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
                    <p className="text-lg font-black text-white mt-1 italic">₦{(totalEarnings / 1000000).toFixed(1)}M</p>
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
                    <p className="text-lg font-black text-white mt-1 italic">{activeDrivers}</p>
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
                        <span className="text-xl font-black text-white italic tracking-tighter">{fleetHealth}%</span>
                        <span className="text-[8px] text-emerald-500 font-black uppercase">+4%</span>
                    </div>
                </div>
                <div className="p-5 bg-slate-800/30 rounded-[2rem] border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                        <Plus className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Pipeline</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-xl font-black text-white italic tracking-tighter">{totalVehicles} Total</span>
                        <span className="text-[8px] text-blue-500 font-black uppercase">Assets</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
