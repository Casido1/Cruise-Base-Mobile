import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';
import { telemetryService } from '../services/telemetryService';
import { signalRService } from '../services/signalRService';
import type { TelemetryDTO } from '../types';
import { 
    Car, 
    ChevronLeft, 
    MapPin, 
    Shield, 
    Calendar, 
    Hash, 
    Palette,
    Activity,
    Loader2,
    Zap,
    Navigation,
    PowerOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const VehicleDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const { data: vehicle, isLoading: isVehicleLoading } = useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => vehicleService.getVehicleById(id!),
        enabled: !!id,
    });

    const { data: telemetry, isLoading: isTelemetryLoading } = useQuery({
        queryKey: ['vehicle-telemetry', id],
        queryFn: () => telemetryService.getLatestTelemetry(id!),
        enabled: !!id,
    });

    useEffect(() => {
        if (!id) return;

        // Join the specific vehicle room for real-time updates
        signalRService.joinVehicleRoom(id);

        const unsubscribe = signalRService.onReceiveTelemetry(id, (data: TelemetryDTO) => {
            // Update the React Query cache immediately with the new telemetry data
            queryClient.setQueryData(['vehicle-telemetry', id], data);
        });

        return () => {
            unsubscribe();
            signalRService.leaveVehicleRoom(id);
        };
    }, [id, queryClient]);

    const stopEngineMutation = useMutation({
        mutationFn: () => telemetryService.stopVehicle(id!),
        onSuccess: () => {
            toast.success('Engine stop command sent');
            queryClient.invalidateQueries({ queryKey: ['vehicle-telemetry', id] });
        },
        onError: () => {
            toast.error('Failed to send engine stop command');
        }
    });

    if (isVehicleLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Locating Asset...</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Car className="w-10 h-10 text-slate-700" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vehicle Not Found</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-4"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Use real-time coordinates or Lagos default
    const lat = telemetry?.latitude || 6.5244;
    const lng = telemetry?.longitude || 3.3792;
    
    // OpenStreetMap Embed URL using bbox for framing and marker for position
    const displayMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="size-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-white active:scale-90 transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">Vehicle Details</h2>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Live Asset Tracking</p>
                </div>
            </div>

            {/* Map Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full aspect-video rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl relative bg-slate-800"
            >
                <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={displayMapUrl}
                    allowFullScreen
                    className="opacity-90"
                />
                
                {/* Custom Car Pin Overlay - Centered since bbox centers the map */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative size-12 bg-blue-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
                        <Car className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Tracking</span>
                </div>
            </motion.div>

            {/* Vehicle Info Grid */}
            <div className="grid grid-cols-1 gap-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-[2rem] relative overflow-hidden"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="size-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                            <Car className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Model & Make</p>
                            <h4 className="text-lg font-black text-white uppercase">{vehicle.brand} {vehicle.model || vehicle.name}</h4>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                <Hash className="w-3 h-3" />
                                Plate Number
                            </div>
                            <p className="text-sm font-black text-white tracking-widest">{vehicle.plateNumber}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                <Palette className="w-3 h-3" />
                                Color
                            </div>
                            <p className="text-sm font-black text-white uppercase italic">{vehicle.color}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                <Shield className="w-3 h-3" />
                                Status
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-500">
                                <Activity className="w-3 h-3" />
                                <span className="text-xs font-black uppercase italic">Active</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                <Calendar className="w-3 h-3" />
                                Registered
                            </div>
                            <p className="text-xs font-black text-white uppercase italic">Mar 2024</p>
                        </div>
                    </div>
                </motion.div>

                {/* Additional Details Placeholder */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900/30 border border-slate-800 p-6 rounded-[2rem]"
                >
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Asset Security</h5>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/20 rounded-2xl border border-slate-800">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Geofencing</span>
                            </div>
                            <span className="text-[8px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 py-1 rounded-lg">Enabled</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-800/20 rounded-2xl border border-slate-800">
                            <div className="flex items-center gap-3">
                                <Shield className="w-4 h-4 text-blue-500" />
                                <div className="space-y-0.5">
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block">Remote Immobilizer</span>
                                    <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Auth Required</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    if(confirm('Are you sure you want to stop the engine? This command will be sent immediately.')) {
                                        stopEngineMutation.mutate();
                                    }
                                }}
                                disabled={stopEngineMutation.isPending}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-500 text-[8px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                                {stopEngineMutation.isPending ? 'Sending...' : 'Stop Engine'}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Real-time Telemetry Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#1e293b]/50 border border-slate-800 p-5 rounded-[2rem]"
                    >
                        <div className="flex items-center gap-2 mb-3 text-slate-500">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Current Speed</span>
                        </div>
                        <p className="text-xl font-black text-white italic tracking-tighter">
                            {telemetry?.speed ? `${telemetry.speed.toFixed(1)} KM/H` : '0 KM/H'}
                        </p>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#1e293b]/50 border border-slate-800 p-5 rounded-[2rem]"
                    >
                        <div className="flex items-center gap-2 mb-3 text-slate-500">
                            <Navigation className="w-4 h-4 text-blue-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Heading</span>
                        </div>
                        <p className="text-xl font-black text-white italic tracking-tighter">
                            {telemetry?.heading ? `${telemetry.heading}°` : 'N/A'}
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetails;
