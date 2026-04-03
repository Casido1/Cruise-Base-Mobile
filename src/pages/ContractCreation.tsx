import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';
import { userService } from '../services/userService';
import type { Vehicle } from '../types';
import { useState } from 'react';
import { 
    FileText, 
    Calendar, 
    CreditCard, 
    User, 
    Car, 
    ChevronLeft, 
    Loader2, 
    CheckCircle2,
    Search,
    History
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const contractSchema = z.object({
    vehicleId: z.string().min(1, 'Please select a vehicle'),
    driverId: z.string().min(1, 'Please select a driver'),
    totalValue: z.number().min(1000, 'Minimum value ₦1,000'),
    tenure: z.number().min(1, 'Minimum tenure 1 month'),
    paymentAmount: z.number().min(100, 'Minimum payment ₦100'),
    paymentFrequency: z.enum(['Daily', 'Weekly', 'Monthly']),
    startDate: z.string().min(1, 'Start date is required'),
});

type ContractFormValues = z.infer<typeof contractSchema>;

const ContractCreationPage = () => {
    const navigate = useNavigate();
    const [driverSearch, setDriverSearch] = useState('');

    const { data: vehicles } = useQuery<Vehicle[]>({
        queryKey: ['available-vehicles'],
        queryFn: vehicleService.getVehicles,
    });

    const { data: drivers } = useQuery({
        queryKey: ['driver-search', driverSearch],
        queryFn: () => userService.searchUser(driverSearch),
        enabled: driverSearch.length > 2,
    });

    const { register, handleSubmit, formState: { errors } } = useForm<ContractFormValues>({
        resolver: zodResolver(contractSchema),
        defaultValues: {
            paymentFrequency: 'Weekly',
            startDate: new Date().toISOString().split('T')[0]
        }
    });

    const mutation = useMutation({
        mutationFn: (data: ContractFormValues) => vehicleService.createContract(data),
        onSuccess: () => {
            toast.success('Contract created successfully');
            navigate('/admin');
        },
        onError: () => toast.error('Failed to create contract'),
    });

    const onSubmit = (data: ContractFormValues) => mutation.mutate(data);

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-700">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Back</span>
            </button>

            <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Draft<br />Contract</h2>
                <div className="flex items-center gap-2 mt-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Hire Purchase Agreement</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Vehicle Section */}
                <div className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-[2rem] space-y-5">
                    <div className="flex items-center gap-3 text-slate-400">
                        <Car className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Vehicle Asset</span>
                    </div>
                    <select 
                        {...register('vehicleId')}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white appearance-none focus:border-blue-500"
                    >
                        <option value="">Select Asset</option>
                        {vehicles?.map(v => (
                            <option key={v.id} value={v.id}>{v.plateNumber} - {v.brand} {v.model}</option>
                        ))}
                    </select>
                </div>

                {/* Driver Section */}
                <div className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-[2rem] space-y-5">
                    <div className="flex items-center gap-3 text-slate-400">
                        <User className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Primary Driver</span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input 
                            type="text" 
                            placeholder="SEARCH BY NAME OR EMAIL..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-[10px] font-black placeholder:text-slate-700 text-white focus:border-blue-500 uppercase tracking-widest"
                            onChange={(e) => setDriverSearch(e.target.value)}
                        />
                    </div>
                    <select 
                        {...register('driverId')}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white appearance-none focus:border-blue-500"
                    >
                        <option value="">Select Driver From Search</option>
                        {drivers?.map((d: any) => (
                            <option key={d.id} value={d.id}>{d.firstName} {d.lastName} ({d.email})</option>
                        ))}
                        {driverSearch === '' && <option disabled>Type to see results...</option>}
                    </select>
                </div>

                {/* Financial Section */}
                <div className="bg-[#1e293b]/50 border border-slate-800 p-8 rounded-[2.5rem] space-y-8">
                    <div className="flex items-center gap-3 text-slate-400">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Financial Terms</span>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Valuation</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-600 text-sm">₦</span>
                                    <input 
                                        type="number" 
                                        {...register('totalValue', { valueAsNumber: true })}
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-10 pr-4 py-4 text-sm font-black text-white" 
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Tenure (Mos)</label>
                                <div className="relative">
                                    <History className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <input 
                                        type="number" 
                                        {...register('tenure', { valueAsNumber: true })}
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-white" 
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Freq. Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-600 text-sm">₦</span>
                                    <input 
                                        type="number" 
                                        {...register('paymentAmount', { valueAsNumber: true })}
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-10 pr-4 py-4 text-sm font-black text-white" 
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Frequency</label>
                                <select 
                                    {...register('paymentFrequency')}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-[10px] font-bold text-white uppercase tracking-widest"
                                >
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input 
                                    type="date" 
                                    {...register('startDate')}
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-white uppercase"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
                >
                    {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                            Finalize Contract
                            <CheckCircle2 className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ContractCreationPage;
