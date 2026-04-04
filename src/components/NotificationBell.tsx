import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signalRService } from '../services/signalRService';
import { useAuthStore } from '../store/useAuthStore';

export const NotificationBell = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const accessToken = useAuthStore(state => state.accessToken);
    const lastNotifIdRef = useRef<string | null>(null);

    const { data: notifications } = useQuery({
        queryKey: ['notifications'],
        queryFn: notificationService.getUserNotifications,
    });

    useEffect(() => {
        if (!accessToken) return;

        signalRService.startConnection(accessToken);

        const unsubscribe = signalRService.onReceiveNotification(() => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        });

        return () => {
            unsubscribe();
            signalRService.stopConnection();
        };
    }, [accessToken, queryClient]);

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;
    const latestNotification = notifications && notifications.length > 0 ? notifications[0] : null;

    // Toast logic for new notifications
    useEffect(() => {
        if (latestNotification && !latestNotification.isRead) {
            if (lastNotifIdRef.current !== latestNotification.id) {
                // Show brief notification toast
                toast.custom((t) => (
                    <div
                        className={`${
                            t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-[#1e293b] shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-blue-500/30 backdrop-blur-md`}
                    >
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/40">
                                        <Bell className="h-5 w-5 text-blue-500" />
                                    </div>
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">
                                        Security Alert
                                    </p>
                                    <p className="text-[11px] font-bold text-white truncate uppercase">
                                        {latestNotification.title}
                                    </p>
                                    <p className="mt-1 text-[10px] text-slate-400 line-clamp-1">
                                        {latestNotification.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-slate-800">
                            <button
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    navigate('/notifications');
                                }}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 focus:outline-none"
                            >
                                View
                            </button>
                        </div>
                    </div>
                ), { duration: 4000 });
                
                lastNotifIdRef.current = latestNotification.id;
            }
        } else if (latestNotification?.isRead) {
            // Update ref even if read to avoid re-toasting if it becomes unread somehow
            lastNotifIdRef.current = latestNotification.id;
        }
    }, [latestNotification, navigate]);

    return (
        <button 
            onClick={() => navigate('/notifications')}
            className="relative p-2.5 text-slate-400 hover:text-white transition-all hover:bg-slate-800/50 rounded-xl border border-transparent hover:border-slate-700/50 group"
        >
            <Bell className={`w-5 h-5 transition-transform duration-300 ${unreadCount > 0 ? 'group-hover:rotate-12' : ''}`} />
            {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1e293b] ring-2 ring-red-500/20 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            )}
        </button>
    );
};
