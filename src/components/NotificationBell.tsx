import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { Bell, X, CheckCheck, Loader2, Info, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from '../utils/time';

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: notificationService.getUserNotifications,
        refetchInterval: 30000, // Poll every 30 seconds
    });

    const markReadMutation = useMutation({
        mutationFn: notificationService.markAsRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    });

    const markAllReadMutation = useMutation({
        mutationFn: notificationService.markAllAsRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    });

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    const getIcon = (type: string) => {
        switch (type) {
            case 'Success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'Warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'Error': return <ShieldAlert className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-[#1e293b] text-[8px] font-black text-white flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-12 z-[70] w-80 bg-[#1e293b] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Notifications</h3>
                                <div className="flex items-center gap-3">
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={() => markAllReadMutation.mutate()}
                                            className="text-[8px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
                                        >
                                            Mark All Read
                                        </button>
                                    )}
                                    <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="max-h-96 overflow-y-auto no-scrollbar">
                                {isLoading ? (
                                    <div className="p-10 flex flex-col items-center justify-center gap-3">
                                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Syncing...</span>
                                    </div>
                                ) : notifications?.length === 0 ? (
                                    <div className="p-10 text-center">
                                        <div className="size-12 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                                            <Bell className="w-6 h-6 text-slate-600" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Alerts Found</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-800/50">
                                        {notifications?.map((notif) => (
                                            <div 
                                                key={notif.id}
                                                onClick={() => !notif.isRead && markReadMutation.mutate(notif.id)}
                                                className={`p-5 transition-all cursor-pointer ${notif.isRead ? 'opacity-60' : 'bg-blue-500/5 border-l-2 border-blue-500'}`}
                                            >
                                                <div className="flex gap-4">
                                                    <div className="mt-1">{getIcon(notif.type)}</div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="text-[11px] font-black text-white uppercase tracking-tight">{notif.title}</h4>
                                                            <span className="text-[8px] font-bold text-slate-500 uppercase italic">
                                                                {formatDistanceToNow(new Date(notif.createdAt))}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{notif.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-slate-900/50 border-t border-slate-800 text-center">
                                <button className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">
                                    View Security Logs
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
