import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import {
  Radio,
  Thermometer,
  Wind,
  Zap,
  Users,
  Compass,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function StationsPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStations = async () => {
    try {
      const res = await api.stations.getAll();
      if (res.success) {
        setStations(res.data);
      }
    } catch (err) {
      console.error('Error fetching stations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
    const interval = setInterval(fetchStations, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-polar-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-wide flex items-center gap-2">
            <Radio size={22} className="text-cyan-400" />
            ANTARCTIC RESEARCH STATIONS MONITORING
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time telemetry, life-support subsystems, and operational readiness index
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Auto-refreshed via Satellite Telemetry Relay</span>
        </div>
      </div>

      {/* Stations Full Cards List */}
      <div className="space-y-6">
        {stations.map((stn) => {
          const tel = stn.telemetry;
          const status = stn.operational_status || stn.status;

          return (
            <div
              key={stn.id}
              className="bg-polar-900/90 border border-polar-800 hover:border-cyan-500/50 rounded-xl p-6 shadow-xl transition-all"
            >
              {/* Top Details Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-polar-800 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-mono font-bold text-white tracking-wide">
                      {stn.name}
                    </h2>
                    <StatusBadge status={status} size="md" />
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30">
                      EST. {stn.established_year}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-3">
                    <span>Coordinates: <strong className="text-slate-200">{stn.latitude}° S, {stn.longitude}° E</strong></span>
                    <span>•</span>
                    <span>Location: <strong className="text-slate-200">{stn.location_description}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/stations/${stn.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-mono font-semibold text-xs tracking-wider uppercase transition shadow-[0_0_12px_rgba(0,229,255,0.2)]"
                  >
                    <span>Launch Station Console</span>
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>

              {/* Station Description & Specs */}
              <p className="text-xs font-mono text-slate-300 mt-3.5 leading-relaxed bg-polar-950/50 p-3 rounded-lg border border-polar-800/80">
                {stn.habitat_description}
              </p>

              {/* Telemetry Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 text-xs font-mono">
                {/* Outdoor Climate */}
                <div className="bg-polar-950 p-3 rounded-lg border border-polar-800">
                  <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                    <Thermometer size={13} className="text-cyan-400" />
                    Outdoor Temp
                  </div>
                  <div className="text-lg font-bold text-slate-100 mt-1">
                    {tel?.outdoor_temp_c !== undefined ? `${tel.outdoor_temp_c}°C` : '--'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Wind: {tel?.wind_speed_knots || '--'} kts ({tel?.wind_direction || '--'})
                  </div>
                </div>

                {/* Indoor Habitat */}
                <div className="bg-polar-950 p-3 rounded-lg border border-polar-800">
                  <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                    <Thermometer size={13} className="text-emerald-400" />
                    Habitat Indoor
                  </div>
                  <div className="text-lg font-bold text-emerald-300 mt-1">
                    {tel?.indoor_temp_c !== undefined ? `+${tel.indoor_temp_c}°C` : '--'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Pressure: {tel?.atmospheric_pressure_hpa || '--'} hPa
                  </div>
                </div>

                {/* Power Output */}
                <div className="bg-polar-950 p-3 rounded-lg border border-polar-800">
                  <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                    <Zap size={13} className="text-amber-400" />
                    Generator Load
                  </div>
                  <div className="text-lg font-bold text-amber-300 mt-1">
                    {tel?.generator_load_kw !== undefined ? `${tel.generator_load_kw} kW` : '--'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Cap: {tel?.generator_capacity_pct || '--'}% load
                  </div>
                </div>

                {/* Fuel Reserves */}
                <div className="bg-polar-950 p-3 rounded-lg border border-polar-800">
                  <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                    <Zap size={13} className="text-rose-400" />
                    Fuel Reserve
                  </div>
                  <div className="text-lg font-bold text-slate-100 mt-1">
                    {tel?.fuel_level_pct !== undefined ? `${tel.fuel_level_pct}%` : '--'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Batt: {tel?.battery_reserve_pct || '--'}% backup
                  </div>
                </div>

                {/* Satellite Comms */}
                <div className="bg-polar-950 p-3 rounded-lg border border-polar-800">
                  <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                    <Radio size={13} className="text-cyan-400" />
                    Comms Uplink
                  </div>
                  <div className="text-lg font-bold text-slate-100 mt-1">
                    {tel?.satellite_latency_ms ? `${tel.satellite_latency_ms} ms` : '--'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Bandwidth: {tel?.satellite_bandwidth_mbps || 0} Mbps
                  </div>
                </div>

                {/* Personnel */}
                <div className="bg-polar-950 p-3 rounded-lg border border-polar-800">
                  <div className="text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                    <Users size={13} className="text-cyan-400" />
                    Crew Headcount
                  </div>
                  <div className="text-lg font-bold text-slate-100 mt-1">
                    {stn.personnel_count} <span className="text-xs text-slate-400 font-normal">/ {stn.max_capacity}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Life-Support: {tel?.life_support_status || 'NOMINAL'}
                  </div>
                </div>
              </div>

              {/* Sub-bar with comms & alert count */}
              <div className="mt-4 pt-3 border-t border-polar-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
                <div className="flex items-center gap-2">
                  <Radio size={13} className="text-cyan-400" />
                  <span>Architecture: <strong className="text-slate-300">{stn.comms_type}</strong></span>
                </div>
                <div className="flex items-center gap-4">
                  {stn.active_alerts_count > 0 ? (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <AlertTriangle size={13} /> {stn.active_alerts_count} Active Warnings ({stn.critical_alerts_count} Critical)
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck size={13} /> All Systems Nominal
                    </span>
                  )}
                  <span>Last Update: {new Date(stn.last_ping_at || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
