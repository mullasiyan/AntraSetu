import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import SeverityBadge from '../components/common/SeverityBadge';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import {
  AlertTriangle,
  CheckCircle,
  Filter,
  Check,
  PlusCircle,
  ShieldAlert,
  Flame,
  Radio,
  Thermometer,
  Boxes,
  Wrench,
  Clock
} from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('active'); // 'active', 'resolved', 'all'
  const [stationFilter, setStationFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals
  const [selectedAlertForResolve, setSelectedAlertForResolve] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    station_id: 'stn-bharati',
    category: 'TEMPERATURE',
    severity: 'HIGH',
    title: '',
    message: ''
  });

  const fetchAlertsData = async () => {
    try {
      const [alertsRes, stnRes] = await Promise.all([
        api.alerts.getAll({
          severity: severityFilter !== 'ALL' ? severityFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          station_id: stationFilter !== 'ALL' ? stationFilter : undefined,
          category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
        }),
        api.stations.getAll()
      ]);

      if (alertsRes.success) setAlerts(alertsRes.data);
      if (stnRes.success) setStations(stnRes.data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsData();
    const interval = setInterval(fetchAlertsData, 8000);
    return () => clearInterval(interval);
  }, [severityFilter, statusFilter, stationFilter, categoryFilter]);

  const handleAcknowledge = async (id) => {
    try {
      await api.alerts.acknowledge(id);
      fetchAlertsData();
    } catch (err) {
      alert('Error acknowledging alert: ' + err.message);
    }
  };

  const handleOpenResolve = (alert) => {
    setSelectedAlertForResolve(alert);
    setResolutionNotes('');
    setIsResolveModalOpen(true);
  };

  const handleConfirmResolve = async (e) => {
    e.preventDefault();
    if (!selectedAlertForResolve) return;
    try {
      await api.alerts.resolve(selectedAlertForResolve.id, resolutionNotes);
      setIsResolveModalOpen(false);
      setSelectedAlertForResolve(null);
      fetchAlertsData();
    } catch (err) {
      alert('Error resolving alert: ' + err.message);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      await api.alerts.create(createForm);
      setIsCreateModalOpen(false);
      setCreateForm({
        station_id: 'stn-bharati',
        category: 'TEMPERATURE',
        severity: 'HIGH',
        title: '',
        message: ''
      });
      fetchAlertsData();
    } catch (err) {
      alert('Error creating alert: ' + err.message);
    }
  };

  const categoryIcons = {
    TEMPERATURE: Thermometer,
    FUEL: Flame,
    POWER: Flame,
    COMMS: Radio,
    INVENTORY: Boxes,
    MAINTENANCE: Wrench,
    MANUAL: ShieldAlert
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-polar-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-wide flex items-center gap-2">
            <AlertTriangle size={22} className="text-rose-400" />
            ALERT INTELLIGENCE & SAFETY WARNING MATRIX
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Automated threshold safety engine • Temperature, Fuel, Comms, Inventory & Maintenance Alarms
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-polar-900 hover:bg-polar-800 border border-polar-700 text-slate-200 text-xs font-mono font-semibold transition"
        >
          <PlusCircle size={15} className="text-cyan-400" />
          <span>Simulate Emergency Drill Alert</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-polar-900/90 border border-polar-800 rounded-xl p-4 shadow-lg flex flex-wrap items-center gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-400 mr-2">
          <Filter size={15} />
          <span>Filters:</span>
        </div>

        {/* Status Filter */}
        <div className="flex items-center rounded-lg bg-polar-950 p-1 border border-polar-800">
          {['active', 'resolved', 'all'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded text-xs uppercase font-bold transition ${
                statusFilter === st
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Severity Filter */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="bg-polar-950 border border-polar-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical Alarms</option>
          <option value="HIGH">High Severity</option>
          <option value="MEDIUM">Medium Severity</option>
          <option value="LOW">Low Advisory</option>
        </select>

        {/* Station Filter */}
        <select
          value={stationFilter}
          onChange={(e) => setStationFilter(e.target.value)}
          className="bg-polar-950 border border-polar-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
        >
          <option value="ALL">All Antarctic Stations</option>
          {stations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-polar-950 border border-polar-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
        >
          <option value="ALL">All Categories</option>
          <option value="TEMPERATURE">Temperature Breaches</option>
          <option value="FUEL">Fuel Depletion</option>
          <option value="COMMS">Satellite Comms</option>
          <option value="INVENTORY">Resource Low Stock</option>
          <option value="MAINTENANCE">Maintenance Overdue</option>
        </select>
      </div>

      {/* Alerts Table / Matrix */}
      <div className="bg-polar-900/90 border border-polar-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-polar-950 border-b border-polar-800 text-[11px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Station</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Alert Title & Operational Message</th>
                <th className="py-3 px-4">Triggered Time</th>
                <th className="py-3 px-4">Status & Ack</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-polar-800/80">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <CheckCircle size={32} className="mx-auto text-emerald-400 mb-2 opacity-80" />
                    No alerts found matching current filter parameters.
                  </td>
                </tr>
              ) : (
                alerts.map((alt) => {
                  const CatIcon = categoryIcons[alt.category] || ShieldAlert;
                  return (
                    <tr
                      key={alt.id}
                      className={`hover:bg-polar-850/60 transition ${
                        alt.severity === 'CRITICAL' && !alt.is_resolved
                          ? 'bg-rose-950/20'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <SeverityBadge severity={alt.severity} />
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-cyan-300">
                          {alt.station_code || 'ALL_FLEET'}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <CatIcon size={14} className="text-cyan-400" />
                          <span>{alt.category}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-md">
                        <div className="font-bold text-slate-100">{alt.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {alt.message}
                        </div>
                        {alt.resolution_notes && (
                          <div className="text-[10px] text-emerald-300 bg-emerald-950/40 p-1 rounded mt-1 border border-emerald-500/20">
                            Resolution Notes: {alt.resolution_notes}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                        <div>{new Date(alt.created_at).toLocaleDateString()}</div>
                        <div className="text-slate-500">
                          {new Date(alt.created_at).toLocaleTimeString()}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {alt.is_resolved ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                            <Check size={12} /> RESOLVED
                          </span>
                        ) : alt.is_acknowledged ? (
                          <span className="inline-flex items-center gap-1 text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                            ACKNOWLEDGED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40 animate-pulse">
                            UNACKNOWLEDGED
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-right space-x-2">
                        {!alt.is_acknowledged && !alt.is_resolved && (
                          <button
                            onClick={() => handleAcknowledge(alt.id)}
                            className="px-2.5 py-1 bg-polar-800 hover:bg-polar-700 text-slate-200 rounded text-[11px] font-semibold border border-polar-700 transition"
                          >
                            Ack
                          </button>
                        )}

                        {!alt.is_resolved && (
                          <button
                            onClick={() => handleOpenResolve(alt)}
                            className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded text-[11px] font-bold border border-emerald-500/40 transition"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolve Alert Modal */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title="Resolve Polar Operations Alert"
        subtitle={selectedAlertForResolve?.title}
      >
        <form onSubmit={handleConfirmResolve} className="space-y-4 font-mono text-xs">
          <div>
            <p className="text-slate-300 mb-2">
              Mark alert as mitigated and restore nominal life-support index for {selectedAlertForResolve?.station_code}.
            </p>
            <label className="block text-slate-300 mb-1 font-bold uppercase">
              Resolution Action Summary *
            </label>
            <textarea
              required
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. De-icing heaters energized, fuel bunker transfer completed successfully, nominal pressure restored."
              className="w-full p-2.5 bg-polar-950 border border-polar-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-polar-800">
            <button
              type="button"
              onClick={() => setIsResolveModalOpen(false)}
              className="px-4 py-2 bg-polar-800 hover:bg-polar-700 rounded-lg text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
            >
              Confirm Alert Resolution
            </button>
          </div>
        </form>
      </Modal>

      {/* Simulate Drill Alert Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Simulate Mission Alert / Safety Drill"
        subtitle="Inject a simulated environmental or subsystem alert into the operations matrix"
      >
        <form onSubmit={handleCreateAlert} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">Target Research Station *</label>
            <select
              value={createForm.station_id}
              onChange={(e) => setCreateForm({ ...createForm, station_id: e.target.value })}
              className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
            >
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Alert Category</label>
              <select
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              >
                <option value="TEMPERATURE">Temperature / Freeze</option>
                <option value="FUEL">Fuel / Power</option>
                <option value="COMMS">Satellite Comms</option>
                <option value="INVENTORY">Inventory Depletion</option>
                <option value="MAINTENANCE">Maintenance Overdue</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Severity Tier</label>
              <select
                value={createForm.severity}
                onChange={(e) => setCreateForm({ ...createForm, severity: e.target.value })}
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              >
                <option value="CRITICAL">Critical (Life-Support)</option>
                <option value="HIGH">High Severity</option>
                <option value="MEDIUM">Medium Warning</option>
                <option value="LOW">Low Advisory</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">Alert Title *</label>
            <input
              type="text"
              required
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="e.g. Sub-zero Katabatic Freeze on Hab Exhaust Vent"
              className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">Message & Instructions</label>
            <textarea
              rows={2}
              value={createForm.message}
              onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
              placeholder="Enter operational warning details..."
              className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-polar-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 bg-polar-800 hover:bg-polar-700 rounded-lg text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold"
            >
              Trigger Alert
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
