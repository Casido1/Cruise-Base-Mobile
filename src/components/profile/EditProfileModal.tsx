import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { X, Loader2, User, Mail, Phone, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const profileSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().min(10, 'Invalid phone number'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: any;
}

export const EditProfileModal = ({ isOpen, onClose, initialData }: EditProfileModalProps) => {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: initialData?.firstName || '',
            lastName: initialData?.lastName || '',
            email: initialData?.email || '',
            phoneNumber: initialData?.phoneNumber || '',
        }
    });

    const updateMutation = useMutation({
        mutationFn: authService.updateUserDetails,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userDetails'] });
            toast.success('Profile updated successfully');
            onClose();
        },
        onError: () => toast.error('Failed to update profile'),
    });

    const photoMutation = useMutation({
        mutationFn: authService.uploadProfilePicture,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userDetails'] });
            toast.success('Photo updated');
        },
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) photoMutation.mutate(file);
    };

    const onSubmit = (data: ProfileFormValues) => updateMutation.mutate(data);

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
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0f172a]/80 backdrop-blur-md z-10">
                            <h3 className="text-xl font-black text-white">Edit Profile</h3>
                            <button onClick={onClose} className="p-2 bg-slate-900 rounded-full text-slate-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto pb-10">
                            {/* Avatar section */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative group">
                                    <div className="size-28 rounded-full bg-slate-800 border-2 border-blue-500/30 overflow-hidden relative">
                                        {photoMutation.isPending && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                                            </div>
                                        )}
                                        {initialData?.profilePicture ? (
                                            <img src={initialData.profilePicture} className="size-full object-cover" />
                                        ) : (
                                            <div className="size-full flex items-center justify-center text-3xl font-black text-slate-500">
                                                {initialData?.firstName?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full border-4 border-[#0f172a] cursor-pointer hover:bg-blue-500 transition-colors">
                                        <Camera className="w-4 h-4 text-white" />
                                        <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                                    </label>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4">Profile Photo</p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input {...register('firstName')} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-blue-500" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input {...register('lastName')} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-blue-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input {...register('email')} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-blue-500" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input {...register('phoneNumber')} className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-blue-500" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="w-full bg-slate-100 hover:bg-white text-black font-black py-4 rounded-2xl shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                                >
                                    {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
