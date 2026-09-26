import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Users, UserCheck, AlertCircle, Heart, Radio,
  Filter, Phone, Calendar, MapPin, Stethoscope,
  ChevronDown, ChevronRight, RefreshCw
} from 'lucide-react';

const ROLE_LABELS = {
  STATION_COMMANDER: 'Station Commander',
  SCIENTIST: 'Scientist',
  ENGINEER: 'Engineer',
  DOCTOR: 'Doctor',
  COOK: 'Cook',
  TECHNICIAN: 'Technician',
};

const STATION_META = {
  'stn-bharati': { label: 'Bharati', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  'stn-maitri': { label: 'Maitri', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  'stn-dakshin-gangotri': { label: 'Dakshin Gangotri', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
};

function HealthBadge({ status }) {
  const map = {
    FIT: { label: 'Fit', cls: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
    REQUIRES_MONITORING: { label: 'Monitoring Required', cls: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
    MEDICAL_ATTENTION: { label: 'Medical Attention', cls: 'text-rose-400 bg-rose-500/15 border-rose-500/30' },
  };
  const d = map[status] || { label: status, cls: 'text-slate-400 bg-slate-700/40 border-slate-600/40' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${d.cls}`}>
      <Heart size={9} />
      {d.label}
    </span>
  );
}

function CommBadge({ status }) {
  const map = {
    REACHABLE: { label: 'Reachable', cls: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
    INTERMITTENT: { label: 'Intermittent', cls: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
    UNREACHABLE: { label: 'Unreachable', cls: 'text-rose-400 bg-rose-500/15 border-rose-500/30 animate-pulse' },
  };
  const d = map[status] || { label: status, cls: 'text-slate-400 bg-slate-700/40 border-slate-600/40' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${d.cls}`}>
      <Radio size={9} />
      {d.label}
    </span>
  );
}

function RoleBadge({ role }) {
  const colors = {
    STATION_COMMANDER: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
    SCIENTIST: 'text-violet-300 bg-violet-500/10 border-violet-500/30',
    ENGINEER: 'text-blue-300 bg-blue-500/10 border-blue-500/30',
    DOCTOR: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
    COOK: 'text-orange-300 bg-orange-500/10 border-orange-500/30',
    TECHNICIAN: 'text-teal-300 bg-teal-500/10 border-teal-500/30',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${colors[role] || 'text-slate-400 bg-slate-700 border-slate-600'}`}>
      {ROLE_LABELS[role] || role}
    </span>
  );
}

export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const [stationFilter, setStationFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [healthFilter, setHealthFilter] = useState('ALL');

  const fetchData = async () => {
    try {
      const params = {};
      if (stationFilter !== 'ALL') params.station_id = stationFilter;
      if (roleFilter !== 'ALL') params.role = roleFilter;
      if (healthFilter !== 'ALL') params.health_status = healthFilter;

      const [pRes, sRes] = await Promise.all([
        api.personnel.getAll(params),
        api.personnel.getSummary()
      ]);
      if (pRes.success) setPersonnel(pRes.data);
      if (sRes.success) setSummary(sRes.data);
    } catch (err) {
      console.error('Error fetching personnel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [stationFilter, roleFilter, healthFilter]);

  const stations = [
    { id: 'stn-bharati', name: 'Bharati', meta: STATION_META['stn-bharati'] },
    { id: 'stn-maitri', name: 'Maitri', meta: STATION_META['stn-maitri'] },
    { id: 'stn-dakshin-gangotri', name: 'Dakshin Gangotri', meta: STATION_META['stn-dakshin-gangotri'] },
  ];

  const unreachableCount = personnel.filter(p => p.comm_status === 'UNREACHABLE').length;
  const medicalCount = personnel.filter(p => p.health_status === 'MEDICAL_ATTENTION' || p.health_status === 'REQUIRES_MONITORING').length;

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 mb-1">
            <span>NCPOR</span><span className="text-slate-600">›</span>
            <span>Antarctic Mission Control</span><span className="text-slate-600">›</span>
            <span className="text-cyan-400">Personnel Registry</span>
          </div>
          <h1 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
            Personnel Registry
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            <span className="text-amber-400 font-bold">[DEMO SIMULATION]</span> — Deployed crew across all Indian Antarctic Research Stations
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-polar-800 border border-polar-700 text-xs font-mono text-slate-400 hover:text-cyan-300 transition"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* Alerts Banner */}
      {(unreachableCount > 0 || medicalCount > 0) && (
        <div className="flex gap-3 flex-wrap">
          {unreachableCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-rose-950/40 border border-rose-500/40 rounded-lg">
              <Radio size={14} className="text-rose-400 animate-pulse" />
              <span className="text-xs font-mono text-rose-400 font-bold">
                {unreachableCount} personnel UNREACHABLE — contact verification required
              </span>
            </div>
          )}
          {medicalCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-950/40 border border-amber-500/40 rounded-lg">
              <Stethoscope size={14} className="text-amber-400" />
              <span className="text-xs font-mono text-amber-400 font-bold">
                {medicalCount} personnel require health monitoring
              </span>
            </div>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stations.map(({ id, name, meta }) => {
          const s = summary[id] || {};
          return (
            <div key={id} className={`bg-polar-900 border ${meta.border} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className={meta.color} />
                  <span className={`text-sm font-mono font-bold ${meta.color}`}>{name}</span>
                </div>
                <span className={`text-2xl font-mono font-bold ${meta.color}`}>
                  {s.total ?? '—'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className={`rounded-lg py-2 px-1 ${meta.bg}`}>
                  <div className="text-base font-mono font-bold text-emerald-400">{s.fit ?? '—'}</div>
                  <div className="text-[10px] font-mono text-slate-500">Fit</div>
                </div>
                <div className={`rounded-lg py-2 px-1 ${meta.bg}`}>
                  <div className="text-base font-mono font-bold text-amber-400">{s.monitoring ?? '—'}</div>
                  <div className="text-[10px] font-mono text-slate-500">Monitoring</div>
                </div>
                <div className={`rounded-lg py-2 px-1 ${meta.bg}`}>
                  <div className="text-base font-mono font-bold text-rose-400">{s.unreachable ?? '—'}</div>
                  <div className="text-[10px] font-mono text-slate-500">Unreachable</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-polar-900/50 border border-polar-800 rounded-xl px-4 py-3">
        <Filter size={14} className="text-slate-500" />
        <select
          value={stationFilter}
          onChange={e => setStationFilter(e.target.value)}
          className="bg-polar-800 border border-polar-700 text-xs font-mono text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Stations</option>
          <option value="stn-bharati">Bharati</option>
          <option value="stn-maitri">Maitri</option>
          <option value="stn-dakshin-gangotri">Dakshin Gangotri</option>
        </select>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="bg-polar-800 border border-polar-700 text-xs font-mono text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Roles</option>
          {Object.entries(ROLE_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <select
          value={healthFilter}
          onChange={e => setHealthFilter(e.target.value)}
          className="bg-polar-800 border border-polar-700 text-xs font-mono text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Health Statuses</option>
          <option value="FIT">Fit</option>
          <option value="REQUIRES_MONITORING">Requires Monitoring</option>
          <option value="MEDICAL_ATTENTION">Medical Attention Needed</option>
        </select>
        <span className="ml-auto text-[11px] font-mono text-slate-500">
          {personnel.length} personnel
        </span>
      </div>

      {/* Personnel Table */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-mono text-sm">
          Loading personnel records...
        </div>
      ) : (
        <div className="bg-polar-900 border border-polar-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-2 border-b border-polar-800 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            <div className="col-span-3">Name / Designation</div>
            <div className="col-span-2">Station</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Deployment</div>
            <div className="col-span-1">Health</div>
            <div className="col-span-1">Comms</div>
            <div className="col-span-1 text-right">Details</div>
          </div>

          {personnel.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono text-sm">
              No personnel records match current filters.
            </div>
          ) : (
            <div className="divide-y divide-polar-800">
              {personnel.map((p) => {
                const stnMeta = STATION_META[p.station_id] || {};
                const isExpanded = expanded === p.id;
                const returnDate = new Date(p.expected_return);
                const daysLeft = Math.ceil((returnDate - new Date()) / 86400000);
                return (
                  <div key={p.id}>
                    <div
                      className={`grid grid-cols-12 px-4 py-3 items-center hover:bg-polar-800/40 cursor-pointer transition ${p.comm_status === 'UNREACHABLE' ? 'bg-rose-950/10' : ''}`}
                      onClick={() => setExpanded(isExpanded ? null : p.id)}
                    >
                      {/* Name */}
                      <div className="col-span-3">
                        <div className="text-sm font-mono font-semibold text-slate-200">{p.name}</div>
                        <div className="text-[10px] font-mono text-slate-500 truncate">{p.designation}</div>
                      </div>
                      {/* Station */}
                      <div className="col-span-2">
                        <span className={`text-xs font-mono font-semibold ${stnMeta.color || 'text-slate-400'}`}>
                          {p.station_code}
                        </span>
                      </div>
                      {/* Role */}
                      <div className="col-span-2">
                        <RoleBadge role={p.role} />
                      </div>
                      {/* Deployment */}
                      <div className="col-span-2">
                        <div className="text-[10px] font-mono text-slate-400">{p.deployment_start}</div>
                        <div className={`text-[10px] font-mono ${daysLeft < 30 ? 'text-amber-400' : 'text-slate-500'}`}>
                          Return: {p.expected_return} {daysLeft > 0 ? `(${daysLeft}d)` : '(due)'}
                        </div>
                      </div>
                      {/* Health */}
                      <div className="col-span-1">
                        <HealthBadge status={p.health_status} />
                      </div>
                      {/* Comms */}
                      <div className="col-span-1">
                        <CommBadge status={p.comm_status} />
                      </div>
                      {/* Expand */}
                      <div className="col-span-1 flex justify-end">
                        {isExpanded
                          ? <ChevronDown size={14} className="text-cyan-400" />
                          : <ChevronRight size={14} className="text-slate-600" />
                        }
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-6 py-4 bg-polar-950/60 border-t border-polar-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Notes</div>
                          <p className="text-xs font-mono text-slate-300">{p.notes}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Emergency Contact</div>
                          <div className="text-xs font-mono text-slate-300">
                            <div className="font-semibold text-slate-200">{p.emergency_contact?.name}</div>
                            <div className="text-slate-500">{p.emergency_contact?.relationship}</div>
                            <div className="flex items-center gap-1 mt-1 text-cyan-400">
                              <Phone size={10} />
                              <span>{p.emergency_contact?.phone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Deployment Timeline</div>
                          <div className="text-xs font-mono text-slate-300 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={10} className="text-slate-500" />
                              <span className="text-slate-500">Deployed:</span>
                              <span>{p.deployment_start}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar size={10} className="text-amber-400" />
                              <span className="text-slate-500">Expected Return:</span>
                              <span className={daysLeft < 30 ? 'text-amber-400 font-bold' : ''}>{p.expected_return}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
