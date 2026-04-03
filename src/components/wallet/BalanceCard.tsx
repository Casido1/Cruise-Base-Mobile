import { memo } from 'react';
import { TrendingUp, Wallet, ArrowUpRight, BarChart3, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface BalanceCardProps {
    balance: number;
    onWithdraw?: () => void;
    onFundClick?: () => void;
    showFundButton?: boolean;
}

export const BalanceCard = memo(({ 
    balance, 
    onWithdraw, 
    onFundClick, 
    showFundButton = false 
}: BalanceCardProps) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b] p-8 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl" />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-600/10 rounded-2xl">
                            <Wallet className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Total Balance</p>
                            <p className="text-[10px] font-bold text-blue-500/80 uppercase tracking-widest mt-0.5">NGN Account</p>
                        </div>
                    </div>
                    <div className="px-3 py-1.5 bg-emerald-500/10 rounded-xl flex items-center gap-2 border border-emerald-500/10">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase">+2.4%</span>
                    </div>
                </div>

                <div className="mb-10">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-500 italic">₦</span>
                        <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
                            {balance.toLocaleString()}
                        </h2>
                    </div>
                </div>

                <div className="flex gap-4">
                    {showFundButton && (
                        <button 
                            onClick={onFundClick}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black p-4 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    )}
                    <button 
                        onClick={onWithdraw}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
                    >
                        Withdraw
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button 
                        className="px-6 bg-slate-900 hover:bg-slate-800 text-slate-300 font-black rounded-2xl border border-slate-800 active:scale-[0.98] transition-all flex items-center justify-center"
                    >
                        <BarChart3 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
});
