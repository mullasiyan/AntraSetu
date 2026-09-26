import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import SeverityBadge from '../components/common/SeverityBadge';
import AntarcticPolarMap from '../components/map/AntarcticPolarMap';
import Modal from '../components/common/Modal';
import {
  Thermometer,
  Zap,
  Radio,
  AlertTriangle,
  Boxes,
  Users,
  Activity,
  PlusCircle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Wrench,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const [stations, setStations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Action Modal states
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    station_id: 'stn-bharati',
    title: '',
    description: '',
    priority: 'P2_HIGH',
    assigned_team: 'Station Engineering Team'
  });
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [stnRes, altRes, invRes, actRes] = await Promise.all([
        api.stations.getAll(),
        api.alerts.getAll({ status: 'active' }),
        api.inventory.getAll(),
        api.activity.getRecent(12)
      ]);

      if (stnRes.success) setStations(stnRes.data);
      if (altRes.success) setAlerts(altRes.data);
      if (invRes.success) setInventory(invRes.data);
      if (actRes.success) setActivity(actRes.data);
    } catch (err) {
      console.error('Error fetching dashboard operations data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 8000); // 8-second refresh loop
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await api.alerts.acknowledge(alertId);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    setSubmittingAction(true);
    try {
      await api.incidents.create(incidentForm);
      setIsIncidentModalOpen(false);
      setIncidentForm({
        station_id: 'stn-bharati',
        title: '',
        description: '',
        priority: 'P2_HIGH',
        assigned_team: 'Station Engineering Team'
      });
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to submit incident');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Derived Critical Metrics
  const activeCriticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');
  const activeHighAlerts = alerts.filter(a => a.severity === 'HIGH');
  const totalPersonnel = stations.reduce((sum, s) => sum + (s.personnel_count || 0), 0);
  
  // Calculate average external temperature across occupied stations
  const occupiedStations = stations.filter(s => s.telemetry?.outdoor_temp_c !== undefined);
  const avgTemp = occupiedStations.length > 0
    ? (occupiedStations.reduce((acc, s) => acc + s.telemetry.outdoor_temp_c, 0) / occupiedStations.length).toFixed(1)
    : '--';

  // Lowest runway inventory items
  const lowestRunwayItems = inventory
    .filter(i => i.days_remaining !== undefined)
    .sort((a, b) => a.days_remaining - b.days_remaining)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-polar-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-wide">
              POLAR FLEET OPERATIONS COCKPIT
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time remote telemetry & life-support monitoring • Indian Antarctic Research Bases
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsIncidentModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-200 text-xs font-mono font-semibold transition"
          >
            <ShieldAlert size={15} />
            <span>Log Emergency Incident</span>
          </button>

          <Link
            to="/inventory"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-polar-900 hover:bg-polar-800 border border-polar-700 text-slate-200 text-xs font-mono transition"
          >
            <Boxes size={15} className="text-cyan-400" />
            <span>Manage Inventory</span>
          </Link>

          <Link
            to="/reports"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold transition"
          >
            <span>Generate Brief</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* Critical Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Active Polar Alerts"
          value={alerts.length}
          unit="ALERTS"
          subtext={`${activeCriticalAlerts.length} Critical • ${activeHighAlerts.length} High`}
          icon={AlertTriangle}
          status={activeCriticalAlerts.length > 0 ? 'critical' : alerts.length > 0 ? 'warning' : 'nominal'}
        />

        <MetricCard
          label="Average Ambient Temp"
          value={avgTemp}
          unit="°C"
          subtext="Extreme sub-zero range"
          icon={Thermometer}
          status={avgTemp < -35 ? 'warning' : 'cyan'}
        />

        <MetricCard
          label="Expedition Crew On-Ice"
          value={totalPersonnel}
          unit="SOULS"
          subtext="Bharati: 28 • Maitri: 22"
          icon={Users}
          status="nominal"
        />

        <MetricCard
          label="Comms Uplink Health"
          value="100%"
          unit="UPTIME"
          subtext="Ku-Band VSAT Dedicated"
          icon={Radio}
          status="nominal"
        />
      </div>

      {/* Research Stations Snapshot Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-cyan-400"></span>
            Antarctic Research Stations Telemetry Status
          </h2>
          <Link to="/stations" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            All Station Telemetry <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stations.map((stn) => {
            const tel = stn.telemetry;
            return (
              <div
                key={stn.id}
                className="bg-polar-900/90 border border-polar-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-lg relative overflow-hidden"
              >
                {/* Station Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-polar-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono font-bold text-slate-100 text-sm">{stn.name}</h3>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                        {stn.location_description}
                      </div>
                    </div>
                    <StatusBadge status={stn.operational_status || stn.status} size="sm" />
                  </div>

                  {/* Core Telemetry Readouts */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                    <div className="bg-polar-950 p-2.5 rounded border border-polar-800">
                      <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
                        <Thermometer size={12} className="text-cyan-400" /> Outdoor Temp
                      </div>
                      <div className="text-base font-bold text-slate-100 mt-1">
                        {tel?.outdoor_temp_c !== undefined ? `${tel.outdoor_temp_c}°C` : '--'}
                      </div>
                    </div>

                    <div className="bg-polar-950 p-2.5 rounded border border-polar-800">
                      <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
                        <Thermometer size={12} className="text-emerald-400" /> Habitat Indoor
                      </div>
                      <div className="text-base font-bold text-emerald-300 mt-1">
                        {tel?.indoor_temp_c !== undefined ? `+${tel.indoor_temp_c}°C` : '--'}
                      </div>
                    </div>

                    <div className="bg-polar-950 p-2.5 rounded border border-polar-800">
                      <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
                        <Zap size={12} className="text-amber-400" /> Generator Fuel
                      </div>
                      <div className="text-base font-bold text-amber-300 mt-1">
                        {tel?.fuel_level_pct !== undefined ? `${tel.fuel_level_pct}%` : '--'}
                      </div>
                    </div>

                    <div className="bg-polar-950 p-2.5 rounded border border-polar-800">
                      <div className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
                        <Users size={12} className="text-cyan-400" /> Personnel
                      </div>
                      <div className="text-base font-bold text-slate-100 mt-1">
                        {stn.personnel_count} <span className="text-[10px] font-normal text-slate-400">/ {stn.max_capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="mt-4 pt-3 border-t border-polar-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">
                    Ping: <strong className="text-slate-200">{tel?.satellite_latency_ms || 350} ms</strong>
                  </span>
                  <Link
                    to={`/stations/${stn.id}`}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    Open Console <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mid Section: Interactive Polar Radar Map & Active Alerts Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Antarctic Radar Map View (7 cols) */}
        <div className="lg:col-span-7">
          <AntarcticPolarMap stations={stations} />
        </div>

        {/* Immediate Alert Triage (5 cols) */}
        <div className="lg:col-span-5 bg-polar-900/90 border border-polar-800 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-polar-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-rose-400" />
                <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wider">
                  Active Alert Triage ({alerts.length})
                </h3>
              </div>
              <Link to="/alerts" className="text-xs font-mono text-cyan-400 hover:underline">
                View All
              </Link>
            </div>

            {alerts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-mono text-xs">
                <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2 opacity-80" />
                No active polar hazards. All life-support systems nominal.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {alerts.slice(0, 5).map((alt) => (
                  <div
                    key={alt.id}
                    className={`p-3 rounded-lg border text-xs font-mono transition ${
                      alt.severity === 'CRITICAL'
                        ? 'bg-rose-950/40 border-rose-500/50 text-rose-100'
                        : alt.severity === 'HIGH'
                        ? 'bg-orange-950/30 border-orange-500/40 text-orange-100'
                        : 'bg-polar-950 border-polar-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={alt.severity} />
                        <span className="font-bold text-cyan-400">{alt.station_code}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(alt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-100 mt-1.5">{alt.title}</div>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {alt.message}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-polar-800/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {alt.is_acknowledged ? (
                          <span className="text-emerald-400 font-semibold">✓ Acknowledged</span>
                        ) : (
                          <span className="text-amber-400">● Unacknowledged</span>
                        )}
                      </span>

                      {!alt.is_acknowledged && (
                        <button
                          onClick={() => handleAcknowledgeAlert(alt.id)}
                          className="px-2.5 py-1 bg-polar-800 hover:bg-polar-700 text-slate-100 rounded text-[11px] font-semibold border border-polar-700 transition"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-polar-800 text-right">
            <Link
              to="/alerts"
              className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
            >
              Open Alert Command Matrix <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Resource Runway Warnings & Recent Station Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lowest Inventory Runway Card */}
        <div className="bg-polar-900/90 border border-polar-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-polar-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Boxes size={18} className="text-cyan-400" />
              <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wider">
                Critical Consumables Runway (Days Remaining)
              </h3>
            </div>
            <Link to="/inventory" className="text-xs font-mono text-cyan-400 hover:underline">
              Inventory Table
            </Link>
          </div>

          <div className="space-y-3 font-mono">
            {lowestRunwayItems.map((item) => {
              const pct = Math.min(100, Math.max(5, (item.days_remaining / 60) * 100));
              const isUrgent = item.days_remaining <= 25;

              return (
                <div key={item.id} className="bg-polar-950 p-3 rounded-lg border border-polar-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-100 truncate max-w-[220px]">
                      {item.name}
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        isUrgent ? 'bg-rose-950 text-rose-300 border border-rose-500/50' : 'bg-polar-800 text-slate-300'
                      }`}
                    >
                      {item.days_remaining} DAYS REMAINING
                    </span>
                  </div>

                  <div className="mt-2 w-full bg-polar-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isUrgent ? 'bg-rose-500' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>Station: <strong className="text-slate-200">{item.station_code || 'BHARATI'}</strong></span>
                    <span>Stock: {item.quantity} {item.unit} (Min: {item.min_threshold})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Station Operational Activity */}
        <div className="bg-polar-900/90 border border-polar-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-polar-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-emerald-400" />
                <h3 className="font-mono font-bold text-sm text-slate-100 uppercase tracking-wider">
                  Live Operations Audit Feed
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                LIVE LOG
              </span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 font-mono text-xs">
              {activity.map((act) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded bg-polar-950 border border-polar-800 flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400">
                      <span className="font-bold text-cyan-400">
                        [{act.station_code}] {act.action}
                      </span>
                      <span>
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] mt-0.5 line-clamp-1">
                      {act.details}
                    </p>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Logged by: {act.user_name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log Emergency Incident Modal */}
      <Modal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        title="Log Emergency Station Incident"
        subtitle="Report equipment anomaly, blizzard damage, or life-support failure"
      >
        <form onSubmit={handleCreateIncident} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">
              Target Antarctic Station *
            </label>
            <select
              value={incidentForm.station_id}
              onChange={(e) => setIncidentForm({ ...incidentForm, station_id: e.target.value })}
              className="w-full p-2.5 bg-polar-950 border border-polar-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
            >
              <option value="stn-bharati">Bharati Station (Larsemann Hills)</option>
              <option value="stn-maitri">Maitri Station (Schirmacher Oasis)</option>
              <option value="stn-dakshin-gangotri">Dakshin Gangotri Depot</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">
              Incident Title *
            </label>
            <input
              type="text"
              required
              value={incidentForm.title}
              onChange={(e) => setIncidentForm({ ...incidentForm, title: e.target.value })}
              placeholder="e.g. Blizzard door pneumatic seal breach"
              className="w-full p-2.5 bg-polar-950 border border-polar-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">
                Priority Tier *
              </label>
              <select
                value={incidentForm.priority}
                onChange={(e) => setIncidentForm({ ...incidentForm, priority: e.target.value })}
                className="w-full p-2.5 bg-polar-950 border border-polar-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="P1_CRITICAL">P1 - Critical (Immediate Hazard)</option>
                <option value="P2_HIGH">P2 - High (Subsystem Degraded)</option>
                <option value="P3_MEDIUM">P3 - Medium (Maintenance Required)</option>
                <option value="P4_LOW">P4 - Low (Advisory / Inspection)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">
                Assigned Team *
              </label>
              <input
                type="text"
                value={incidentForm.assigned_team}
                onChange={(e) => setIncidentForm({ ...incidentForm, assigned_team: e.target.value })}
                placeholder="Station Engineering Team"
                className="w-full p-2.5 bg-polar-950 border border-polar-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">
              Detailed Description & Observation *
            </label>
            <textarea
              required
              rows={3}
              value={incidentForm.description}
              onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
              placeholder="Provide technical specifics, sensor anomalies, and immediate containment measures taken..."
              className="w-full p-2.5 bg-polar-950 border border-polar-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-polar-800">
            <button
              type="button"
              onClick={() => setIsIncidentModalOpen(false)}
              className="px-4 py-2 bg-polar-800 hover:bg-polar-700 rounded-lg text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingAction}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shadow-lg shadow-rose-900/30"
            >
              {submittingAction ? 'Broadcasting...' : 'File Mission Incident'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
