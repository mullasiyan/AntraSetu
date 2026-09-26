import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import SeverityBadge from '../components/common/SeverityBadge';
import MetricCard from '../components/common/MetricCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import {
  ArrowLeft,
  Thermometer,
  Wind,
  Zap,
  Users,
  Radio,
  Boxes,
  Wrench,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function StationDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await api.stations.getById(id);
      if (res.success && res.data) {
        setData(res.data);
        // Format history for recharts
        const chartData = (res.data.telemetry_history || []).map((t, idx) => ({
          time: new Date(t.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          outdoor: t.outdoor_temp_c,
          indoor: t.indoor_temp_c,
          fuel: t.fuel_level_pct,
          battery: t.battery_reserve_pct,
          wind: t.wind_speed_knots,
          gen_load: t.generator_load_kw
        }));
        setHistory(chartData);
      }
    } catch (err) {
      console.error('Error fetching station details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    const interval = setInterval(fetchDetail, 8000);
    return () => clearInterval(interval);
  }, [id]);

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await api.alerts.acknowledge(alertId);
      fetchDetail();
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 font-mono text-sm">
        <Radio size={32} className="mx-auto text-cyan-400 animate-pulse mb-3" />
        Acquiring satellite telemetry stream for Antarctic station...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-24 text-center text-slate-400 font-mono">
        <p className="text-base text-rose-400 font-bold">Antarctic research station not found.</p>
        <Link to="/stations" className="text-cyan-400 underline mt-2 inline-block">
          Return to Stations Directory
        </Link>
      </div>
    );
  }

  const { station, telemetry, alerts, incidents, maintenance_tasks, inventory } = data;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Station Identity */}
      <div>
        <Link
          to="/stations"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 mb-2 transition"
        >
          <ArrowLeft size={14} /> Back to Stations Overview
        </Link>

        <div className="bg-polar-900/90 border border-polar-800 rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wide">
                {station.name}
              </h1>
              <StatusBadge status={station.operational_status || station.status} size="md" />
              <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded">
                CODE: {station.code}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-300 mt-1.5">
              {station.location_description} • Coordinates: {station.latitude}° S, {station.longitude}° E
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-right">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">SAT-UPLINK</div>
              <div className="text-slate-200 font-bold">{station.comms_status}</div>
            </div>
            <div className="border-l border-polar-800 pl-4">
              <div className="text-[10px] text-slate-400 uppercase">CREW STATUS</div>
              <div className="text-slate-200 font-bold">{station.personnel_count} / {station.max_capacity} souls</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Outdoor Temperature"
          value={telemetry?.outdoor_temp_c !== undefined ? telemetry.outdoor_temp_c : '--'}
          unit="°C"
          subtext={`Wind: ${telemetry?.wind_speed_knots || '--'} kts ${telemetry?.wind_direction || ''}`}
          icon={Thermometer}
          status={telemetry?.outdoor_temp_c < -40 ? 'critical' : telemetry?.outdoor_temp_c < -30 ? 'warning' : 'cyan'}
        />

        <MetricCard
          label="Habitat Indoor Climate"
          value={telemetry?.indoor_temp_c !== undefined ? `+${telemetry.indoor_temp_c}` : '--'}
          unit="°C"
          subtext={`Pressure: ${telemetry?.atmospheric_pressure_hpa || '--'} hPa • RH ${telemetry?.humidity_pct || '--'}%`}
          icon={Thermometer}
          status="nominal"
        />

        <MetricCard
          label="Diesel Generator Fuel"
          value={telemetry?.fuel_level_pct !== undefined ? telemetry.fuel_level_pct : '--'}
          unit="%"
          subtext={`Load: ${telemetry?.generator_load_kw || 0} kW (${telemetry?.generator_capacity_pct || 0}%)`}
          icon={Zap}
          status={telemetry?.fuel_level_pct < 25 ? 'critical' : telemetry?.fuel_level_pct < 40 ? 'warning' : 'nominal'}
        />

        <MetricCard
          label="Satellite Latency"
          value={telemetry?.satellite_latency_ms || '--'}
          unit="MS"
          subtext={`Bandwidth: ${telemetry?.satellite_bandwidth_mbps || 0} Mbps`}
          icon={Radio}
          status={telemetry?.satellite_latency_ms > 1500 ? 'warning' : 'nominal'}
        />
      </div>

      {/* Historical Telemetry Curves (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature History Chart */}
        <div className="bg-polar-900/90 border border-polar-800 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-polar-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Thermometer size={18} className="text-cyan-400" />
              <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wider">
                Temperature Telemetry Curve (°C)
              </h3>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-0.5 bg-cyan-400"></span> Outdoor
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-0.5 bg-emerald-400"></span> Habitat Indoor
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#091325', borderColor: '#1E3A8A', fontFamily: 'monospace', fontSize: 11 }}
                  labelStyle={{ color: '#93C5FD' }}
                />
                <Line type="monotone" dataKey="outdoor" stroke="#00E5FF" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="indoor" stroke="#10B981" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Power & Fuel Reserves Chart */}
        <div className="bg-polar-900/90 border border-polar-800 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-polar-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wider">
                Fuel Reserves & Battery Backup (%)
              </h3>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-0.5 bg-amber-400"></span> Fuel %
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2.5 h-0.5 bg-cyan-300"></span> Battery %
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#091325', borderColor: '#1E3A8A', fontFamily: 'monospace', fontSize: 11 }}
                  labelStyle={{ color: '#93C5FD' }}
                />
                <Area type="monotone" dataKey="fuel" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.15} strokeWidth={2} isAnimationActive={false} />
                <Area type="monotone" dataKey="battery" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.1} strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subsystem Readiness Matrix */}
      <div className="bg-polar-900/90 border border-polar-800 rounded-xl p-5 shadow-xl">
        <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wider border-b border-polar-800 pb-3 mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-cyan-400" />
          Subsystem Operational Readiness Matrix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-polar-950 p-3.5 rounded-lg border border-polar-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">HVAC & Habitat Climate</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-2">
              CO2 Level: {telemetry?.air_quality_co2_ppm || 500} ppm • Redundant blowers armed.
            </div>
          </div>

          <div className="bg-polar-950 p-3.5 rounded-lg border border-polar-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Power Cogeneration</span>
              <span className={telemetry?.fuel_level_pct < 25 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                {telemetry?.fuel_level_pct < 25 ? 'FUEL CONSERV' : 'NOMINAL'}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 mt-2">
              Load: {telemetry?.generator_load_kw || 0} kW • Pressure: {telemetry?.fuel_pressure_psi || 40} PSI
            </div>
          </div>

          <div className="bg-polar-950 p-3.5 rounded-lg border border-polar-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Water Treatment & Storage</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-2">
              Freshwater Reserve: {telemetry?.freshwater_litres?.toLocaleString() || 12000} L stored.
            </div>
          </div>

          <div className="bg-polar-950 p-3.5 rounded-lg border border-polar-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Airlocks & Polar Seals</span>
              <span className="text-cyan-400 font-bold">SECURED</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-2">
              Threshold heat tracing energized. Code Red storm seals active.
            </div>
          </div>
        </div>
      </div>

      {/* Station Active Alerts & Open Maintenance Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts for this station */}
        <div className="bg-polar-900/90 border border-polar-800 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-polar-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-400" />
              <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wider">
                Station Active Alerts ({alerts.length})
              </h3>
            </div>
            <Link to="/alerts" className="text-xs font-mono text-cyan-400 hover:underline">
              Alerts Desk
            </Link>
          </div>

          {alerts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 font-mono text-xs">
              <CheckCircle size={28} className="mx-auto text-emerald-400 mb-2 opacity-80" />
              No active alerts for {station.name}.
            </div>
          ) : (
            <div className="space-y-2.5 font-mono text-xs max-h-[300px] overflow-y-auto pr-1">
              {alerts.map((alt) => (
                <div key={alt.id} className="p-3 bg-polar-950 rounded-lg border border-polar-800">
                  <div className="flex items-center justify-between gap-2">
                    <SeverityBadge severity={alt.severity} />
                    <span className="text-[10px] text-slate-400">
                      {new Date(alt.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-100 mt-1">{alt.title}</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{alt.message}</p>
                  {!alt.is_acknowledged && (
                    <button
                      onClick={() => handleAcknowledgeAlert(alt.id)}
                      className="mt-2 px-2.5 py-1 bg-polar-800 hover:bg-polar-700 text-slate-200 rounded text-[11px] font-semibold border border-polar-700"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance Tasks for this station */}
        <div className="bg-polar-900/90 border border-polar-800 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-polar-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Wrench size={18} className="text-cyan-400" />
              <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wider">
                Maintenance Schedule ({maintenance_tasks.length})
              </h3>
            </div>
            <Link to="/maintenance" className="text-xs font-mono text-cyan-400 hover:underline">
              Task Board
            </Link>
          </div>

          <div className="space-y-2.5 font-mono text-xs max-h-[300px] overflow-y-auto pr-1">
            {maintenance_tasks.map((task) => (
              <div key={task.id} className="p-3 bg-polar-950 rounded-lg border border-polar-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-200 truncate">{task.title}</span>
                  <StatusBadge status={task.status} size="sm" pulse={false} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Assigned: {task.assigned_person}</span>
                  <span className={task.is_overdue ? 'text-rose-400 font-bold' : ''}>
                    Due: {task.due_date} {task.is_overdue && '(OVERDUE)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
