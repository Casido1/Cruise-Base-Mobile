import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Mail, Lock, User, Phone, Briefcase, ChevronRight, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().min(10, 'Invalid phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['Owner', 'Driver']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'Driver',
        },
    });

    const selectedRole = watch('role');

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
            alert('Registration successful! Please login.');
            navigate('/login');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Registration failed');
        },
    });

    const onSubmit = (data: RegisterFormValues) => {
        const payload = {
            ...data,
            role: data.role === 'Owner' ? 0 : 1 // 0 for Owner, 1 for Driver
        };
        registerMutation.mutate(payload);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col p-6 safe-top pb-safe-bottom overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto w-full py-10"
            >
                <div className="mb-10">
                    <div className="size-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/40">
                        <span className="text-xl font-black text-white italic">CB</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Create<br />Account</h1>
                    <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Join the network</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">First Name</label>
                            <input
                                {...register('firstName')}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-4 text-white focus:border-emerald-600 transition-all font-medium text-sm"
                                placeholder="John"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Last Name</label>
                            <input
                                {...register('lastName')}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-4 text-white focus:border-emerald-600 transition-all font-medium text-sm"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                {...register('username')}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-emerald-600 transition-all font-medium text-sm"
                                placeholder="john_doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                {...register('email')}
                                type="email"
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-emerald-600 transition-all font-medium text-sm"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                {...register('phoneNumber')}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-emerald-600 transition-all font-medium text-sm"
                                placeholder="+234..."
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                {...register('password')}
                                type="password"
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-emerald-600 transition-all font-medium text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Select Account Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="cursor-pointer">
                                <input type="radio" {...register('role')} value="Driver" className="peer sr-only" />
                                <div className="p-4 border border-slate-800 bg-slate-900/30 rounded-2xl peer-checked:border-emerald-600 peer-checked:bg-emerald-600/10 transition-all text-center group">
                                    <Briefcase className={`w-6 h-6 mx-auto mb-2 ${selectedRole === 'Driver' ? 'text-emerald-500' : 'text-slate-600'}`} />
                                    <span className={`text-[10px] font-black uppercase ${selectedRole === 'Driver' ? 'text-emerald-500' : 'text-slate-500'}`}>Driver</span>
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" {...register('role')} value="Owner" className="peer sr-only" />
                                <div className="p-4 border border-slate-800 bg-slate-900/30 rounded-2xl peer-checked:border-white peer-checked:bg-white/5 transition-all text-center group">
                                    <ShieldCheck className={`w-6 h-6 mx-auto mb-2 ${selectedRole === 'Owner' ? 'text-white' : 'text-slate-600'}`} />
                                    <span className={`text-[10px] font-black uppercase ${selectedRole === 'Owner' ? 'text-white' : 'text-slate-500'}`}>Owner</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 text-sm uppercase tracking-[0.1em]"
                    >
                        {registerMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Create Account
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center pb-10">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-white hover:text-emerald-500 transition-colors ml-1"
                        >
                            Log In
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
