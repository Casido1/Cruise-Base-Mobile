import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { walletService } from '../../services/walletService';
import { X, Loader2, ArrowUpRight, ShieldCheck, Landmark, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const withdrawSchema = z.object({
    amount: z.number().min(100, 'Minimum withdrawal is ₦100'),
    bankAccountId: z.string().min(1, 'Please select a bank account'),
    pin: z.string().min(4, 'PIN must be at least 4 digits'),
});

type WithdrawFormValues = z.infer<typeof withdrawSchema>;

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    balance: number;
}

export const WithdrawalModal = ({ isOpen, onClose, balance }: WithdrawalModalProps) => {
    const queryClient = useQueryClient();
    const { data: bankAccounts } = useQuery({
        queryKey: ['bank-accounts'],
        queryFn: walletService.getUserBankAccounts,
        enabled: isOpen,
    });

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<WithdrawFormValues>({
        resolver: zodResolver(withdrawSchema),
    });

    const mutation = useMutation({
        mutationFn: (data: WithdrawFormValues) => 
            walletService.withdraw(data.amount, data.bankAccountId, data.pin),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            reset();
            onClose();
        },
    });

    const onSubmit = (data: WithdrawFormValues) => mutation.mutate(data);
    const amount = watch('amount') || 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg bg-[#0f172a] sm:rounded-[2.5rem] border-t sm:border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0f172a]/80 backdrop-blur-md z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-xl">
                                    <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-black text-white">Withdraw Funds</h3>
                            </div>
                            <button onClick={onClose} className="p-2 bg-slate-900 rounded-full text-slate-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 overflow-y-auto pb-10">
                            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[2rem] text-center">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Available Balance</p>
                                <p className="text-3xl font-black text-white">₦{balance.toLocaleString()}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Amount to Withdraw</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500 text-lg">₦</span>
                                        <input 
                                            type="number"
                                            {...register('amount', { valueAsNumber: true })} 
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-10 pr-4 py-4 text-white text-xl font-black focus:border-emerald-500 transition-colors" 
                                            placeholder="0.00" 
                                        />
                                    </div>
                                    {errors.amount && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.amount.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Destination Bank</label>
                                    <div className="relative">
                                        <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <select 
                                            {...register('bankAccountId')} 
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white text-sm focus:border-emerald-500 appearance-none transition-colors"
                                        >
                                            <option value="">Select Account</option>
                                            {bankAccounts?.map((acc: any) => (
                                                <option key={acc.id} value={acc.id}>{acc.bankName} - {acc.accountNumber}</option>
                                            ))}
                                            {!bankAccounts?.length && <option value="demo">Access Bank •••• 4589</option>}
                                        </select>
                                    </div>
                                    {errors.bankAccountId && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.bankAccountId.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Transaction PIN</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input 
                                            type="password"
                                            maxLength={4}
                                            {...register('pin')} 
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white text-center text-2xl tracking-[1rem] focus:border-emerald-500 transition-colors" 
                                            placeholder="••••" 
                                        />
                                    </div>
                                    {errors.pin && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.pin.message}</p>}
                                </div>

                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-3">
                                    <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                        Withdrawals are processed instantly. Please ensure your bank details are correct before proceeding.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={mutation.isPending || amount > balance || amount <= 0}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 mt-4"
                            >
                                {mutation.isPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Confirm Withdrawal
                                        <ArrowUpRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
