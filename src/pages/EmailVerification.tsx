import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmailVerificationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isSuccess = searchParams.get('status') === 'success';
    const isError = searchParams.get('status') === 'error';

    return (
        <div className="min-h-screen bg-black flex flex-col p-6 safe-top pb-safe-bottom">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col justify-center items-center text-center max-w-md mx-auto w-full"
            >
                <div className={`size-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl ${
                    isSuccess ? 'bg-emerald-600 shadow-emerald-900/30' : 
                    isError ? 'bg-red-600 shadow-red-900/30' : 'bg-slate-800'
                }`}>
                    {isSuccess ? <CheckCircle2 className="w-12 h-12 text-white" /> :
                     isError ? <XCircle className="w-12 h-12 text-white" /> :
                     <Mail className="w-12 h-12 text-blue-500" />}
                </div>

                <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">
                    {isSuccess ? 'Email Verified!' : 
                     isError ? 'Verification Failed' : 'Check Your Email'}
                </h1>

                <p className="text-slate-500 font-bold text-sm tracking-widest uppercase leading-relaxed px-4">
                    {isSuccess ? 'Your account is now fully activated and ready to use.' :
                     isError ? 'Something went wrong with the link. It might be expired.' :
                     'We have sent a verification link to your email address.'}
                </p>

                <button
                    onClick={() => navigate('/login')}
                    className="w-full mt-12 bg-white text-black font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
                >
                    {isSuccess ? 'Go to Login' : 'Try Logging In'}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
};
