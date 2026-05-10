import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';
import { telemetryService } from '../services/telemetryService';
import { signalRService } from '../services/signalRService';
import { geofenceService } from '../services/geofenceService';
import type { TelemetryDTO, Geofence } from '../types';
import { useState } from 'react';
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
import { MapContainer, TileLayer, Marker, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom component to handle map recentering
const MapAutoRecenter = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

const VehicleDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isGeofenceViewOpen, setIsGeofenceViewOpen] = useState(false);
    const [newGeofenceName, setNewGeofenceName] = useState('');
    const [newGeofenceRadius, setNewGeofenceRadius] = useState(500);

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

    const { data: geofences, isLoading: isGeofencesLoading } = useQuery({
        queryKey: ['vehicle-geofences', id],
        queryFn: () => geofenceService.getGeofencesByVehicleId(id!),
        enabled: !!id,
    });

    const createGeofenceMutation = useMutation({
        mutationFn: (data: { name: string; radius: number }) => 
            geofenceService.createGeofence({
                vehicleId: id!,
                name: data.name,
                radius: data.radius,
                latitude: lat,
                longitude: lng
            }),
        onSuccess: () => {
            toast.success('Geofence created successfully');
            queryClient.invalidateQueries({ queryKey: ['vehicle-geofences', id] });
            setNewGeofenceName('');
            setIsGeofenceViewOpen(false);
        },
        onError: () => {
            toast.error('Failed to create geofence');
        }
    });

    const deleteGeofenceMutation = useMutation({
        mutationFn: (geofenceId: string) => geofenceService.deleteGeofence(geofenceId),
        onSuccess: () => {
            toast.success('Geofence deleted');
            queryClient.invalidateQueries({ queryKey: ['vehicle-geofences', id] });
        },
        onError: () => {
            toast.error('Failed to delete geofence');
        }
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
    const heading = telemetry?.heading || 0;

    // Create a custom car icon using divIcon for rotation
    const carIcon = L.divIcon({
        html: `<div style="transform: rotate(${heading - 90}deg); transition: transform 0.5s ease-in-out, left 0.5s linear, top 0.5s linear;" class="flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill: rgba(59, 130, 246, 0.4)">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                    <circle cx="7" cy="17" r="2"></circle>
                    <path d="M9 17h6"></path>
                    <circle cx="17" cy="17" r="2"></circle>
                </svg>
              </div>`,
        className: 'custom-car-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

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
                className="w-full aspect-video rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl relative bg-slate-900"
            >
                <MapContainer 
                    center={[lat, lng]} 
                    zoom={15} 
                    scrollWheelZoom={true}
                    zoomControl={true}
                    style={{ height: '300px', width: '100%', borderRadius: '2rem' }}
                    className="w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[lat, lng]} icon={carIcon} />
                    {geofences?.map((gf: Geofence) => (
                        <Circle 
                            key={gf.id}
                            center={[gf.latitude, gf.longitude]}
                            radius={gf.radius}
                            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.1 }}
                        />
                    ))}
                    <MapAutoRecenter center={[lat, lng]} />
                </MapContainer>

                <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
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
                        <div 
                            onClick={() => setIsGeofenceViewOpen(!isGeofenceViewOpen)}
                            className="flex flex-col gap-3 p-4 bg-slate-800/20 rounded-2xl border border-slate-800 cursor-pointer hover:bg-slate-800/40 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Geofencing</span>
                                </div>
                                <span className="text-[8px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 py-1 rounded-lg">
                                    {geofences?.length || 0} Active
                                </span>
                            </div>

                            {isGeofenceViewOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4 pt-2 border-t border-slate-800"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Create Form */}
                                    <div className="space-y-3">
                                        <input 
                                            type="text" 
                                            placeholder="GEOFENCE NAME (e.g. Home, Office)"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                                            value={newGeofenceName}
                                            onChange={(e) => setNewGeofenceName(e.target.value)}
                                        />
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 space-y-1">
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Radius: {newGeofenceRadius}m</p>
                                                <input 
                                                    type="range" 
                                                    min="100" 
                                                    max="5000" 
                                                    step="100"
                                                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                    value={newGeofenceRadius}
                                                    onChange={(e) => setNewGeofenceRadius(parseInt(e.target.value))}
                                                />
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    if(!newGeofenceName) return toast.error('Enter geofence name');
                                                    createGeofenceMutation.mutate({ name: newGeofenceName, radius: newGeofenceRadius });
                                                }}
                                                disabled={createGeofenceMutation.isPending}
                                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                                            >
                                                {createGeofenceMutation.isPending ? '...' : 'Add'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* List */}
                                    <div className="space-y-2">
                                        {geofences?.map((gf: Geofence) => (
                                            <div key={gf.id} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                                                <div>
                                                    <p className="text-[9px] font-black text-white uppercase tracking-tight">{gf.name}</p>
                                                    <p className="text-[8px] text-slate-500 font-bold uppercase">{gf.radius}m Radius</p>
                                                </div>
                                                <button 
                                                    onClick={() => deleteGeofenceMutation.mutate(gf.id)}
                                                    className="text-red-500 hover:text-red-400 p-1"
                                                >
                                                    <PowerOff className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
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
