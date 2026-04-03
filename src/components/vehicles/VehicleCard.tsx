import { memo } from 'react';
import { Car, Shield, User, ChevronRight, Activity } from 'lucide-react';
import type { Vehicle } from '../../types';

interface VehicleCardProps {
    vehicle: Vehicle;
    onClick?: () => void;
}

export const VehicleCard = memo(({ vehicle, onClick }: VehicleCardProps) => {
    return (
        <div 
            onClick={onClick}
            className="group bg-[#1e293b]/40 border border-slate-800 p-5 rounded-[2.5rem] flex flex-col gap-6 active:scale-[0.98] transition-all relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Car className="w-12 h-12 text-blue-500" />
            </div>
            
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl">
                        <Car className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">{vehicle.brand} {vehicle.model}</h3>
                        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{vehicle.plateNumber}</p>
                    </div>
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                    vehicle.isActive 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                }`}>
                    {vehicle.isActive ? 'Active' : 'Inactive'}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-3 h-3 text-blue-500" />
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Health</span>
                    </div>
                    <p className="text-sm font-black text-white italic">OPTIMAL</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-3 h-3 text-emerald-500" />
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Revenue</span>
                    </div>
                    <p className="text-sm font-black text-white italic">₦12.5k</p>
                </div>
            </div>

            {vehicle.userId && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-800 rounded-lg">
                            <User className="w-3 h-3 text-slate-400" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Assigned Driver</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
            )}
        </div>
    );
});
