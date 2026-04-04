import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';
import { useAuthStore } from '../store/useAuthStore';
import type { Vehicle } from '../types';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { AddVehicleModal } from '../components/vehicles/AddVehicleModal';
import { 
    Car, 
    Plus, 
    Search, 
    Filter, 
    Loader2,
    CheckCircle2,
    XCircle,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const MyFleetPage = () => {
    const user = useAuthStore(state => state.user);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
        queryKey: ['fleet-vehicles'],
        queryFn: () => user?.role === 'Driver' 
            ? vehicleService.getVehiclesByUserId(user.id) 
            : vehicleService.getVehicles(),
    });

    const filteredVehicles = Array.isArray(vehicles) 
        ? vehicles.filter(v => 
            v.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            v.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Fleet...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                        {user?.role === 'Driver' ? 'My\nVehicle' : 'Your\nFleet'}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">
                        {filteredVehicles.length} Assets Registered
                    </p>
                </div>
                {user?.role !== 'Driver' && (
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 p-4 rounded-3xl text-white shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Quick Stats Banner */}
            <div className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-[2rem] flex items-center justify-around">
                <div className="text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Active</p>
                    <div className="flex items-center justify-center gap-1.5 font-black text-white italic">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span className="text-xl leading-none">{filteredVehicles.filter(v => v.isActive).length}</span>
                    </div>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div className="text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Offline</p>
                    <div className="flex items-center justify-center gap-1.5 font-black text-white italic opacity-50">
                        <XCircle className="w-3 h-3 text-slate-500" />
                        <span className="text-xl leading-none">{filteredVehicles.filter(v => !v.isActive).length}</span>
                    </div>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div className="text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Health</p>
                    <div className="flex items-center justify-center gap-1.5 font-black text-emerald-500 italic">
                        <Activity className="w-3 h-3" />
                        <span className="text-xl leading-none">98%</span>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-4 bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-4">
                    <Search className="w-5 h-5 text-slate-600" />
                    <input 
                        type="text" 
                        placeholder="FILTER ASSETS..."
                        className="bg-transparent border-none text-xs font-bold text-white placeholder:text-slate-700 w-full focus:ring-0 uppercase tracking-widest pt-0.5"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-slate-500 active:scale-95 transition-all">
                    <Filter className="w-5 h-5" />
                </button>
            </div>

            {/* Fleet List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle, i) => (
                        <motion.div
                            key={vehicle.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <VehicleCard vehicle={vehicle} />
                        </motion.div>
                    ))
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <Car className="w-12 h-12 text-slate-800 mx-auto" />
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
                            No vehicles found in your fleet matching the current filter.
                        </p>
                    </div>
                )}
            </div>

            <AddVehicleModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
};

export default MyFleetPage;
