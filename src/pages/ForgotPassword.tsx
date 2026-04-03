import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ChevronLeft, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordValues) => {
        console.log('Forgot password request:', data);
        alert('If an account exists with this email, you will receive reset instructions.');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-black flex flex-col p-6 safe-top pb-safe-bottom">
            <button onClick={() => navigate(-1)} className="mb-10 p-2 -ml-2 text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest mt-0.5">Back</span>
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
            >
                <div className="mb-12">
                    <div className="size-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
                        <Mail className="w-6 h-6 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Forgot<br />Password?</h1>
                    <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Enter your email to reset</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                            <input
                                {...register('email')}
                                type="email"
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                                placeholder="name@company.com"
                            />
                        </div>
                        {errors.email && <p className="text-[10px] text-blue-500 font-bold mt-1 ml-1 uppercase">{errors.email.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 text-sm uppercase tracking-[0.2em]"
                    >
                        Send Instructions
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
