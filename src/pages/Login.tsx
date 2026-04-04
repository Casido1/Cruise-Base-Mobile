import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LogIn, Loader2, Mail, Lock, ChevronRight } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
    const navigate = useNavigate();
    const setCredentials = useAuthStore((state) => state.setCredentials);
    const setUser = useAuthStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: async (data) => {
            setCredentials(data.accessToken, data.refreshToken);

            try {
                const userDetails = await authService.getUserDetails();
                const roles = (userDetails.roles || []).map((r: string) => r.toLowerCase());
                let mappedRole: 'Admin' | 'SuperAdmin' | 'Owner' | 'Driver' = 'Driver';
                let targetPath = '/driver';

                if (roles.includes('superadmin')) {
                    mappedRole = 'SuperAdmin';
                    targetPath = '/superadmin';
                } else if (roles.includes('admin')) {
                    mappedRole = 'Admin';
                    targetPath = '/admin';
                } else if (roles.includes('owner')) {
                    mappedRole = 'Owner';
                    targetPath = '/owner';
                }

                setUser({
                    id: userDetails.id,
                    email: userDetails.email,
                    fullName: `${userDetails.firstName} ${userDetails.lastName}`,
                    role: mappedRole,
                    profilePicture: userDetails.pictures?.pictureUrl
                });

                navigate(targetPath);
            } catch (error) {
                console.error('Failed to fetch user details', error);
                navigate('/');
            }
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Login failed');
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col p-6 safe-top pb-safe-bottom">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
            >
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Welcome<br />Back</h1>
                    <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Sign in to your account</p>
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

                    <div className="space-y-2">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
                            <Link to="/forgot-password" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400">
                                Forgot?
                            </Link>
                        </div>
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

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 text-sm uppercase tracking-[0.2em]"
                    >
                        {loginMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Log In
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-white hover:text-blue-500 transition-colors ml-1"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
