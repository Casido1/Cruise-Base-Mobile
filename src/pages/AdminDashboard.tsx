import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';

import { 
    Users, 
    Car, 
    ShieldCheck, 
    TrendingUp, 
    AlertCircle, 
    Search,
    ChevronRight,
    Loader2,
    Activity,
    Building
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { Vehicle } from '../types';

import { useAuthStore } from '../store/useAuthStore';

const AdminDashboard = () => {
    const user = useAuthStore((state) => state.user);
    const { data: vehicles, isLoading: isVehiclesLoading } = useQuery<Vehicle[]>({
        queryKey: ['company-vehicles'],
        queryFn: vehicleService.getVehicles,
        enabled: !!user,
    });



    const activeVehicles = Array.isArray(vehicles) ? vehicles.filter(v => v.isActive).length : 0;
    const totalVehicles = Array.isArray(vehicles) ? vehicles.length : 0;

    if (isVehiclesLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-500">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest">Syncing Fleet Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">


            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-[2rem] flex flex-col gap-4"
                >
                    <div className="p-3 bg-blue-500/10 rounded-2xl w-fit">
                        <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Active Drivers</p>
                        <p className="text-2xl font-black text-white italic leading-tight">124</p>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-[2rem] flex flex-col gap-4"
                >
                    <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit">
                        <Car className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Company Fleet</p>
                        <p className="text-2xl font-black text-white italic leading-tight">{activeVehicles}/{totalVehicles}</p>
                    </div>
                </motion.div>
            </div>



            {/* Critical Alerts */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Operational Alerts
                    </h3>
                    <div className="px-2 py-0.5 bg-red-500 rounded-lg text-[8px] font-black text-white uppercase">Critical</div>
                </div>

                <div className="space-y-3">
                    <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-[2rem] flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-white uppercase tracking-tight">Contract Renewal</p>
                            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">4 Assets Expiring Soon</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-700" />
                    </div>
                </div>
            </div>

            {/* Search Launcher */}
            <button className="w-full bg-[#1e293b] border border-slate-700 rounded-2xl p-4 flex items-center gap-4 text-slate-500 active:scale-[0.98] transition-all">
                <Search className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest pt-0.5">Fleet Maintenance Audit</span>
            </button>
        </div>
    );
};

export default AdminDashboard;
