import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '../services/companyService';
import { 
    Building2, 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    MoreVertical,
    Activity,
    ShieldCheck,
    Loader2,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CompanyList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 10;

    const { data: companies, isLoading } = useQuery({
        queryKey: ['companies-list', page, searchTerm],
        queryFn: () => companyService.getAllCompanies({ 
            pageNumber: page, 
            pageSize, 
            searchTerm 
        }),
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 hover:text-blue-500 transition-colors"
                    >
                        <ChevronLeft className="w-3 h-3" /> Back to Dashboard
                    </button>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Company<br />Directory</h2>
                </div>
                <button className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
                    <Plus className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search companies by name..."
                    className="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white placeholder:text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all uppercase tracking-widest"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            {/* Results Section */}
            <div className="space-y-4 min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Register...</p>
                    </div>
                ) : Array.isArray(companies) && companies.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        {companies.map((company, i) => (
                            <motion.div
                                key={company.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-[#1e293b]/40 border border-slate-800 p-5 rounded-[2rem] flex items-center justify-between group active:bg-slate-800/60 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="size-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner group-hover:border-blue-500/30 transition-colors overflow-hidden">
                                        {company.logoUrl ? (
                                            <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="w-6 h-6 text-slate-500" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-tight">{company.name}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Activity className="w-3 h-3 text-emerald-500" />
                                                <span className="text-[8px] font-black text-emerald-500/80 uppercase">Active Nodes</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3 text-blue-500" />
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Verified</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-600 hover:text-white transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-[2.5rem]">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">No Directory Entries Found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {Array.isArray(companies) && companies.length > 0 && (
                <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 mt-auto">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className={`p-3 rounded-xl transition-all ${page === 1 ? 'text-slate-800' : 'text-white bg-slate-800 hover:bg-slate-700'}`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-0.5">Deployment Page</p>
                        <p className="text-sm font-black text-white italic">{page}</p>
                    </div>
                    <button 
                        disabled={Array.isArray(companies) && companies.length < pageSize}
                        onClick={() => setPage(p => p + 1)}
                        className={`p-3 rounded-xl transition-all ${Array.isArray(companies) && companies.length < pageSize ? 'text-slate-800' : 'text-white bg-slate-800 hover:bg-slate-700'}`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CompanyList;
