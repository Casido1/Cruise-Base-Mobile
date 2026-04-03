import { ArrowUpRight, ArrowDownLeft, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Transaction } from '../../types';

interface TransactionHistoryProps {
    transactions: Transaction[];
    limit?: number;
}

export const TransactionHistory = ({ transactions, limit }: TransactionHistoryProps) => {
    const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

    if (transactions.length === 0) {
        return (
            <div className="bg-[#1e293b]/30 border border-slate-800 rounded-[2rem] p-10 flex flex-col items-center text-center">
                <Clock className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">No activities yet</p>
                <p className="text-slate-600 text-xs mt-1">Your transaction history will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h3>
                {limit && (
                    <button className="text-xs font-bold text-blue-500 uppercase">See All</button>
                )}
            </div>

            <div className="bg-[#1e293b]/50 border border-slate-800 rounded-[2rem] overflow-hidden divide-y divide-slate-800/50">
                {displayTransactions.map((tx) => {
                    const isCredit = tx.type === 'Collection' || tx.type === 'Split';
                    return (
                        <div key={tx.id} className="p-5 flex items-center gap-4 active:bg-slate-800/50 transition-colors">
                            <div className={`p-3 rounded-2xl ${isCredit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{tx.description}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-medium mt-0.5 tracking-wider">
                                    {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-black ${isCredit ? 'text-emerald-500' : 'text-white'}`}>
                                    {isCredit ? '+' : '-'}₦{tx.amount.toLocaleString()}
                                </p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    {tx.status === 'Completed' ? (
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    ) : tx.status === 'Failed' ? (
                                        <AlertCircle className="w-3 h-3 text-red-500" />
                                    ) : (
                                        <Clock className="w-3 h-3 text-amber-500" />
                                    )}
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
