import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Calendar, FileText, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { onboardingService } from '../services/onboardingService';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';

type OnboardingFormValues = {
    date: string;
    time: string;
    notes?: string;
};

const OnboardingScheduleCreate = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
    } = useForm<OnboardingFormValues>();

    const selectedDate = watch('date');
    const selectedTime = watch('time');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const { data: allSchedules } = useQuery({
        queryKey: ['onboardingSchedules'],
        queryFn: onboardingService.getAllSchedules,
    });

    const bookedSchedules = allSchedules || [];

    // Extract booked dates (YYYY-MM-DD) from all schedules
    const bookedDates = bookedSchedules.map(s => {
        const dt = s.date || (s as any).dateTime;
        if (!dt) return '';
        return dt.includes('T') ? dt.split('T')[0] : dt.split(' ')[0];
    }).filter(Boolean);

    // Extract booked times (HH:mm) for the currently selected date
    const bookedTimesForSelectedDate = selectedDate
        ? bookedSchedules
            .filter(s => {
                const dt = s.date || (s as any).dateTime;
                if (!dt) return false;
                const dateStr = dt.includes('T') ? dt.split('T')[0] : dt.split(' ')[0];
                return dateStr === selectedDate;
            })
            .map(s => {
                const t = s.time || (s as any).dateTime;
                if (!t) return '';
                const dateObj = new Date(t);
                const hours = dateObj.getHours().toString().padStart(2, '0');
                const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
            })
            .filter(Boolean)
        : [];

    // Check if selected date already has any booking
    const isSelectedDateBooked = selectedDate ? bookedDates.includes(selectedDate) : false;

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00'
    ];

    const createMutation = useMutation({
        mutationFn: onboardingService.createSchedule,
        onSuccess: () => {
            alert('Onboarding schedule created successfully!');
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
        if (!data.date || data.date < tomorrowStr) {
            alert('Please select a valid date from tomorrow onwards');
            return;
        }
        if (bookedDates.includes(data.date)) {
            alert('This date is already booked');
            return;
        }
        if (!data.time) {
            alert('Please select a time slot');
            return;
        }
        if (bookedTimesForSelectedDate.includes(data.time)) {
            alert('This time slot is already booked');
            return;
        }

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
                        {isSelectedDateBooked && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase italic">⚠ This date is already booked</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Preferred Time</label>
                        <div className="grid grid-cols-3 gap-3">
                            {timeSlots.map((time) => {
                                const isBooked = bookedTimesForSelectedDate.includes(time);
                                return (
                                    <button
                                        key={time}
                                        type="button"
                                        disabled={isBooked}
                                        onClick={() => setValue('time', time, { shouldValidate: true })}
                                        className={`py-3 rounded-xl font-bold text-xs transition-all border ${
                                            selectedTime === time
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40 translate-y-[-2px]'
                                                : isBooked
                                                    ? 'bg-slate-900/20 border-slate-900 text-slate-700 cursor-not-allowed opacity-50 line-through'
                                                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                        }`}
                                    >
                                        {new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                    </button>
                                );
                            })}
                        </div>
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
