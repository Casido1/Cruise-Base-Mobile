import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = (data: ResetPasswordValues) => {
        console.log('Reset password request:', { ...data, token, email });
        alert('Password has been successfully reset. Please log in.');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-black flex flex-col p-6 safe-top pb-safe-bottom">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
            >
                <div className="mb-12">
                    <div className="size-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-900/40">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Reset<br />Password</h1>
                    <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Secure your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                            <input
                                {...register('password')}
                                type="password"
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="text-[10px] text-blue-500 font-bold mt-1 ml-1 uppercase">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.confirmPassword && <p className="text-[10px] text-blue-500 font-bold mt-1 ml-1 uppercase">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 text-sm uppercase tracking-[0.2em]"
                    >
                        Update Password
                        <CheckCircle2 className="w-5 h-5" />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
