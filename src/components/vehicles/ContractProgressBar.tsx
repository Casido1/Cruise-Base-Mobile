import { motion } from 'framer-motion';

interface ContractProgressBarProps {
    label: string;
    totalValue: number;
    paidAmount: number;
    percentage: number;
    color: string;
}

import { memo } from 'react';

export const ContractProgressBar = memo(({ label, totalValue, paidAmount, percentage, color }: ContractProgressBarProps) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-2xl font-black text-white">
                        ₦{paidAmount.toLocaleString()} 
                        <span className="text-sm font-medium text-slate-500 ml-2">/ ₦{totalValue.toLocaleString()}</span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black italic" style={{ color }}>{percentage}%</p>
                </div>
            </div>

            <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-1">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    style={{ backgroundColor: color }}
                />
            </div>

            <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                <span>Initial Deposit</span>
                <span>Fully Owned</span>
            </div>
        </div>
    );
});
