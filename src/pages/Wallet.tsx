import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { walletService } from '../services/walletService';
import type { Wallet } from '../types';
import { BalanceCard } from '../components/wallet/BalanceCard';
import { TransactionHistory } from '../components/wallet/TransactionHistory';
import { WithdrawalModal } from '../components/wallet/WithdrawalModal';
import { 
    Search, 
    Filter, 
    ArrowUpRight, 
    History, 
    CreditCard, 
    Loader2,
    Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';

const WalletPage = () => {
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: wallet, isLoading: isWalletLoading } = useQuery<Wallet>({
        queryKey: ['wallet-balance'],
        queryFn: walletService.getBalance,
    });

    const { data: transactionsData, isLoading: isTxLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => walletService.getTransactionHistory(1, 20),
    });

    if (isWalletLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-[10px] font-black uppercase tracking-widest">Initializing Wallet...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Your<br />Wallet</h2>
                <div className="flex items-center gap-2 mt-2">
                    <History className="w-4 h-4 text-blue-500" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Activity: 2 Hours Ago</p>
                </div>
            </div>

            {/* Balance Card Section */}
            <BalanceCard
                balance={wallet?.balance || 0}
                showFundButton={true}
                onFundClick={() => alert('Funding via Paystack coming soon')}
                onWithdraw={() => setIsWithdrawModalOpen(true)}
            />

            {/* Quick Actions Scroll */}
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-5 px-5 no-scrollbar">
                {[
                    { label: 'Bank Details', icon: CreditCard, color: 'emerald' },
                    { label: 'Statements', icon: Briefcase, color: 'blue' },
                    { label: 'Settings', icon: Filter, color: 'slate' }
                ].map((action, i) => (
                    <motion.button
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex-none bg-[#1e293b]/50 border border-slate-800 p-5 rounded-3xl flex flex-col items-center gap-3 min-w-[100px] active:scale-95 transition-all"
                    >
                        <div className={`p-3 bg-${action.color}-500/10 rounded-2xl`}>
                            <action.icon className={`w-5 h-5 text-${action.color}-500`} />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{action.label}</span>
                    </motion.button>
                ))}
            </div>

            {/* Transactions Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-4">
                    <Search className="w-5 h-5 text-slate-600" />
                    <input 
                        type="text" 
                        placeholder="SEARCH TRANSACTIONS..."
                        className="bg-transparent border-none text-xs font-bold text-white placeholder:text-slate-700 w-full focus:ring-0 uppercase tracking-widest"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <TransactionHistory 
                    transactions={transactionsData?.transactions || []} 
                />
            </div>

            <WithdrawalModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                balance={wallet?.balance || 0}
            />
        </div>
    );
};

export default WalletPage;
