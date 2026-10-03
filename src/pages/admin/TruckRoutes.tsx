import {
  Truck, MapPin, Clock, Gauge, Package, CheckCircle2, Navigation,
} from 'lucide-react';
import { truckRoutes, binCapacities } from '@/data/adminData';
import type { TruckRoute } from '@/data/adminData';

const statusConfig: Record<TruckRoute['status'], { bg: string; text: string; dot: string; label: string }> = {
  'En Route': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'En Route' },
  'Collecting': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Collecting' },
  'Returning to Facility': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Returning' },
};

function fillColor(level: number) {
  if (level >= 85) return { bar: 'bg-red-500', text: 'text-red-600', label: 'Critical' };
  if (level >= 60) return { bar: 'bg-amber-500', text: 'text-amber-600', label: 'High' };
  if (level >= 30) return { bar: 'bg-emerald-500', text: 'text-emerald-600', label: 'Moderate' };
  return { bar: 'bg-slate-300', text: 'text-slate-500', label: 'Low' };
}

export default function AdminTruckRoutes() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Truck Routes & Collections</h2>
        <p className="text-sm text-slate-500 mt-0.5">Monitor active collection vehicles and bin capacities across campus zones</p>
      </div>

      {/* Truck route cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {truckRoutes.map((truck) => {
          const status = statusConfig[truck.status];
          return (
            <div key={truck.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Truck className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{truck.routeName}</p>
                    <p className="text-xs text-slate-500">{truck.driver}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                  {status.label}
                </span>
              </div>

              {/* Progress: bins collected */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> Bins Collected
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{truck.binsCollected} / {truck.totalBins}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(truck.binsCollected / truck.totalBins) * 100}%` }}
                  />
                </div>
              </div>

              {/* Truck capacity */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5" /> Truck Capacity
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{truck.capacity}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${truck.capacity >= 85 ? 'bg-red-500' : truck.capacity >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${truck.capacity}%` }}
                  />
                </div>
              </div>

              {/* Zone & ETA */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {truck.zone}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  ETA {truck.eta}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live map placeholder + bin capacities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Live Campus Map</h3>
              <p className="text-xs text-slate-500 mt-0.5">Bin capacities across all zones — updated every 30 seconds</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="relative h-[340px] bg-slate-100 flex items-center justify-center">
            {/* Stylized map background */}
            <div className="absolute inset-0 opacity-[0.07]" style={{
              backgroundImage: `linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }} />
            <div className="absolute top-1/4 left-1/4 w-32 h-24 bg-emerald-200/40 rounded-2xl" />
            <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-blue-200/40 rounded-full" />
            <div className="absolute bottom-1/4 left-1/3 w-36 h-20 bg-amber-200/40 rounded-xl" />

            {/* Bin markers */}
            {binCapacities.slice(0, 8).map((bin, i) => {
              const fill = fillColor(bin.fillLevel);
              const positions = [
                { top: '20%', left: '15%' }, { top: '30%', left: '45%' },
                { top: '55%', left: '20%' }, { top: '45%', left: '55%' },
                { top: '25%', left: '70%' }, { top: '65%', left: '50%' },
                { top: '70%', left: '75%' }, { top: '40%', left: '30%' },
              ];
              const pos = positions[i];
              return (
                <div
                  key={bin.id}
                  className="absolute group"
                  style={pos}
                >
                  <div className={`w-5 h-5 ${fill.bar} rounded-full border-2 border-white shadow-sm flex items-center justify-center`}>
                    <span className="text-[8px] text-white font-bold">{bin.fillLevel}</span>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap pointer-events-none z-10">
                    <p className="font-semibold">{bin.location}</p>
                    <p className="text-slate-300">{bin.zone} · {bin.type}</p>
                  </div>
                </div>
              );
            })}

            {/* Center label */}
            <div className="relative z-0 text-center">
              <Navigation className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-400">Interactive Map Placeholder</p>
              <p className="text-xs text-slate-400 mt-1">Hover over markers to see bin details</p>
            </div>
          </div>
        </div>

        {/* Bin capacity list */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Bin Capacities</h3>
          <p className="text-xs text-slate-500 mb-4">All smart bins across campus</p>
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {binCapacities.map((bin) => {
              const fill = fillColor(bin.fillLevel);
              return (
                <div key={bin.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${fill.bar} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-700 truncate">{bin.location}</p>
                      <span className={`text-xs font-bold ${fill.text}`}>{bin.fillLevel}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{bin.zone} · {bin.type}</p>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div className={`h-full rounded-full ${fill.bar}`} style={{ width: `${bin.fillLevel}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center gap-x-6 gap-y-2 justify-center">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-xs text-slate-600"><strong className="text-slate-900">{truckRoutes.reduce((s, t) => s + t.binsCollected, 0)}</strong> bins collected today</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-slate-600"><strong className="text-slate-900">{truckRoutes.length}</strong> trucks active</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-slate-600"><strong className="text-slate-900">{binCapacities.length}</strong> smart bins monitored</span>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-red-500" />
          <span className="text-xs text-slate-600"><strong className="text-slate-900">{binCapacities.filter(b => b.fillLevel >= 85).length}</strong> bins need urgent collection</span>
        </div>
      </div>
    </div>
  );
}
