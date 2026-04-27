import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { Bell, CheckCheck, Loader2, Info, AlertTriangle, CheckCircle2, ShieldAlert, ChevronLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from '../utils/time';
import { motion } from 'framer-motion';

export const NotificationsPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: notificationService.getUserNotifications,
    });

    const markReadMutation = useMutation({
        mutationFn: notificationService.markAsRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    });

    const markAllReadMutation = useMutation({
        mutationFn: notificationService.markAllAsRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: notificationService.deleteNotification,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    });

    const unreadCount = (Array.isArray(notifications) ? notifications : [])?.filter(n => !n.isRead).length || 0;

    const getIcon = (type: string) => {
        switch (type) {
            case 'Success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'Warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'Error': return <ShieldAlert className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syncing Inbox...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 bg-slate-800/50 rounded-xl border border-slate-700/50 text-slate-400 hover:text-white transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Security Alerts</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {unreadCount} UNREAD NOTIFICATIONS
                        </p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button 
                        onClick={() => markAllReadMutation.mutate()}
                        className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-500 uppercase tracking-widest hover:bg-blue-500/20 transition-all flex items-center gap-2"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark All Read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            {(!notifications || notifications.length === 0) ? (
                <div className="py-20 text-center">
                    <div className="size-16 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
                        <Bell className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">All Clear</h3>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Your inbox is empty</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {Array.isArray(notifications) && notifications.map((notif, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={notif.id}
                            onClick={() => !notif.isRead && markReadMutation.mutate(notif.id)}
                            className={`group relative p-5 rounded-2xl border transition-all cursor-pointer ${
                                notif.isRead 
                                ? 'bg-slate-800/20 border-slate-800/50' 
                                : 'bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                            }`}
                        >
                            <div className="flex gap-4">
                                <div className={`size-10 rounded-xl flex items-center justify-center border transition-colors ${
                                    notif.isRead ? 'bg-slate-800/50 border-slate-700/30' : 'bg-blue-500/20 border-blue-500/40'
                                }`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-tight truncate mr-2">
                                            {notif.title}
                                        </h4>
                                        <span className="text-[8px] font-black text-slate-500 uppercase italic shrink-0">
                                            {formatDistanceToNow(new Date(notif.createdAt))}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                        {notif.message}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteMutation.mutate(notif.id);
                                        }}
                                        className="p-1.5 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            {!notif.isRead && (
                                <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
