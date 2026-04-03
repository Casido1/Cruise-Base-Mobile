import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';
import { walletService } from '../services/walletService';
import { companyService } from '../services/companyService';
import { 
    Users, 
    Car, 
    ShieldCheck, 
    TrendingUp, 
    Activity,
    Globe,
    Building2,
    BarChart3,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Vehicle, Company } from '../types';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const { data: vehicles, isLoading: isVehiclesLoading } = useQuery<Vehicle[]>({
        queryKey: ['all-vehicles-global'],
        queryFn: vehicleService.getVehicles,
    });

    const { data: companies, isLoading: isCompaniesLoading } = useQuery<Company[]>({
        queryKey: ['all-companies-global'],
        queryFn: () => companyService.getAllCompanies(),
    });

    const { data: wallet } = useQuery({
        queryKey: ['global-revenue'],
        queryFn: walletService.getBalance,
    });

    const totalActive = Array.isArray(vehicles) ? vehicles.filter(v => v.isActive).length : 0;
    const totalFleet = Array.isArray(vehicles) ? vehicles.length : 0;
    const totalCompanies = Array.isArray(companies) ? companies.length : 0;

    if (isVehiclesLoading || isCompaniesLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="mb-2">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Global<br />Command</h2>
                <div className="flex items-center gap-2 mt-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Status: Online</p>
                </div>
            </div>

            {/* Global Revenue Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
            >
                <div className="absolute -right-10 -top-10 size-48 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <p className="text-indigo-100/80 text-[10px] font-black uppercase tracking-widest mb-1">Total System Revenue</p>
                    <h2 className="text-4xl font-black text-white tracking-tight">₦{(wallet?.balance || 24500000).toLocaleString()}</h2>
                    <div className="mt-6 flex gap-4">
                        <div className="px-3 py-1.5 bg-white/10 rounded-xl flex items-center gap-2 backdrop-blur-md">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] font-black text-white uppercase">+12.5%</span>
                        </div>
                        <div className="px-3 py-1.5 bg-white/10 rounded-xl flex items-center gap-2 backdrop-blur-md">
                            <BarChart3 className="w-3 h-3 text-blue-300" />
                            <span className="text-[10px] font-black text-white uppercase">TOP TIER</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Global Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => navigate('/superadmin/companies')}
                    className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-[2rem] text-left active:scale-[0.98] hover:border-blue-500/30 transition-all cursor-pointer overflow-hidden group"
                >
                    <div className="p-3 bg-blue-500/10 rounded-2xl w-fit mb-4 group-hover:bg-blue-500/20 transition-colors">
                        <Building2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Companies</p>
                    <p className="text-2xl font-black text-white italic">{totalCompanies}</p>
                </button>
                <div className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-[2rem]">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit mb-4">
                        <Car className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Global Assets</p>
                    <p className="text-2xl font-black text-white italic">{totalActive}/{totalFleet}</p>
                </div>
            </div>

            {/* System Health */}
            <div className="bg-[#1e293b]/30 border border-slate-800 p-8 rounded-[2.5rem]">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6 text-center justify-center">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Node Performance
                </h3>
                <div className="space-y-4">
                    {[
                        { label: 'Company A (Lagos)', status: 'Optimal', load: '12%' },
                        { label: 'Company B (Abuja)', status: 'High Load', load: '84%' },
                        { label: 'Company C (Ibadan)', status: 'Optimal', load: '05%' },
                    ].map((node, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800/50">
                            <div>
                                <p className="text-[10px] font-black text-white uppercase">{node.label}</p>
                                <p className={`text-[8px] font-bold mt-0.5 uppercase ${node.status === 'Optimal' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {node.status}
                                </p>
                            </div>
                            <span className="text-[10px] font-black text-slate-500 italic">{node.load}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
                <button className="w-full bg-slate-900 border border-slate-800 p-5 rounded-[2rem] flex items-center justify-between active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl">
                            <ShieldCheck className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="text-sm font-bold text-slate-300">Security Audit Logs</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-700" />
                </button>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
