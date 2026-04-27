import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Calendar, FileText, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { onboardingService } from '../services/onboardingService';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';

// Schema and type are now defined inside or handled via interfaces

const OnboardingScheduleCreate = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const { data: allSchedules } = useQuery({
        queryKey: ['onboardingSchedules'],
        queryFn: onboardingService.getAllSchedules,
    });

    const bookedDates = allSchedules?.map(s => {
        // Handle potential different date formats from API
        const dt = s.date || (s as any).dateTime; // Fallback for transition
        return dt.includes('T') ? dt.split('T')[0] : dt;
    }) || [];

    const onboardingSchema = z.object({
        date: z.string()
            .min(1, 'Please select a date')
            .refine(val => val >= tomorrowStr, { message: 'Date must be from tomorrow onwards' })
            .refine(val => !bookedDates.includes(val), { message: 'This date is already booked' }),
        time: z.string().min(1, 'Please select a time'),
        notes: z.string().optional(),
    });

    type OnboardingFormValues = z.infer<typeof onboardingSchema>;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(onboardingSchema),
    });

    const selectedTime = watch('time');

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00'
    ];

    const createMutation = useMutation({
        mutationFn: onboardingService.createSchedule,
        onSuccess: () => {
            alert('Onboarding schedule created successfully!');
            // After creation, navigate to the appropriate dashboard
            const roles = [user?.role?.toLowerCase()];
            let targetPath = '/driver';
            if (roles.includes('superadmin')) targetPath = '/superadmin';
            else if (roles.includes('admin')) targetPath = '/admin';
            else if (roles.includes('owner')) targetPath = '/owner';
            navigate(targetPath);
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to create schedule');
        },
    });

    const onSubmit = (data: OnboardingFormValues) => {
        if (!user?.id) {
            alert('User ID missing. Please log in again.');
            return;
        }
        const datePayload = `${data.date}T00:00:00Z`;
        const timePayload = `${data.date}T${data.time}:00Z`;
        
        createMutation.mutate({
            userId: user.id,
            date: datePayload,
            time: timePayload,
            additionalNotes: data.notes,
        });
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 safe-top pb-safe-bottom">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto"
            >
                <button 
                    onClick={() => navigate(-1)}
                    className="mb-8 p-2 hover:bg-slate-900 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-400" />
                </button>

                <div className="mb-10">
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Schedule Your<br />Onboarding</h1>
                    <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Select a convenient time to get started</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Onboarding Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 pointer-events-none" />
                            <input
                                {...register('date')}
                                type="date"
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                                min={tomorrowStr}
                                onClick={(e) => (e.target as any).showPicker?.()}
                            />
                        </div>
                        {errors.date && <p className="text-[10px] text-blue-500 font-bold mt-1 ml-1 uppercase">{errors.date.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Preferred Time</label>
                        <div className="grid grid-cols-3 gap-3">
                            {timeSlots.map((time) => (
                                <button
                                    key={time}
                                    type="button"
                                    onClick={() => setValue('time', time, { shouldValidate: true })}
                                    className={`py-3 rounded-xl font-bold text-xs transition-all border ${
                                        selectedTime === time
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40 translate-y-[-2px]'
                                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                    }`}
                                >
                                    {new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                </button>
                            ))}
                        </div>
                        {errors.time && <p className="text-[10px] text-blue-500 font-bold mt-1 ml-1 uppercase">{errors.time.message}</p>}
                    </div>



                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Additional Notes (Optional)</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-600" />
                            <textarea
                                {...register('notes')}
                                rows={4}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium resize-none"
                                placeholder="Any specific requirements or questions..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8 text-sm uppercase tracking-[0.2em]"
                    >
                        {createMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Confirm Schedule
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default OnboardingScheduleCreate;
