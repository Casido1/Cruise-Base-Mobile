import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../../services/vehicleService';
import { X, Loader2, Car, Palette, Hash, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const vehicleSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    brand: z.string().min(2, 'Brand is required'),
    model: z.string().min(2, 'Model is required'),
    plateNumber: z.string().min(2, 'Plate number is required'),
    color: z.string().min(2, 'Color is required'),
    ownerPercentage: z.number().min(0).max(100).optional(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddVehicleModal = ({ isOpen, onClose }: AddVehicleModalProps) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: { ownerPercentage: 90 }
    });

    const mutation = useMutation({
        mutationFn: vehicleService.createVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-vehicles'] });
            reset();
            onClose();
        },
    });

    const onSubmit = (data: VehicleFormValues) => mutation.mutate(data);

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
                                <div className="p-2 bg-blue-500/10 rounded-xl">
                                    <Car className="w-5 h-5 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-black text-white">Add Vehicle</h3>
                            </div>
                            <button onClick={onClose} className="p-2 bg-slate-900 rounded-full text-slate-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 overflow-y-auto pb-10">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Brand</label>
                                        <div className="relative">
                                            <input {...register('brand')} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-sm focus:border-blue-500 transition-colors" placeholder="Toyota" />
                                        </div>
                                        {errors.brand && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.brand.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Model</label>
                                        <div className="relative">
                                            <input {...register('model')} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-sm focus:border-blue-500 transition-colors" placeholder="Corolla" />
                                        </div>
                                        {errors.model && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.model.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Display Name</label>
                                    <div className="relative">
                                        <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input {...register('name')} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-blue-500 transition-colors" placeholder="Owner's Primary Car" />
                                    </div>
                                    {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.name.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Plate Number</label>
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input {...register('plateNumber')} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-blue-500 transition-colors" placeholder="LND-123-XY" />
                                        </div>
                                        {errors.plateNumber && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.plateNumber.message}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Color</label>
                                        <div className="relative">
                                            <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input {...register('color')} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-blue-500 transition-colors" placeholder="Black" />
                                        </div>
                                        {errors.color && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.color.message}</p>}
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-2 text-blue-400">
                                        <User className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Revenue Allocation</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="range" 
                                            {...register('ownerPercentage', { valueAsNumber: true })} 
                                            className="flex-1 accent-blue-500 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer"
                                        />
                                        <span className="text-sm font-black text-white min-w-[3rem] text-right">90%</span>
                                    </div>
                                    <p className="text-[9px] text-slate-500 mt-2">Owner receives 90% of revenue after platform fees.</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 mt-4"
                            >
                                {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Vehicle'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
