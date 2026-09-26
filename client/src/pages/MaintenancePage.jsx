import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/common/Modal';
import StatusBadge from '../components/common/StatusBadge';
import SeverityBadge from '../components/common/SeverityBadge';
import {
  Wrench,
  ShieldAlert,
  PlusCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  Check,
  ChevronRight
} from 'lucide-react';

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState('incidents'); // 'incidents' or 'tasks'
  const [incidents, setIncidents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stationFilter, setStationFilter] = useState('ALL');

  // Modals
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    station_id: 'stn-bharati',
    title: '',
    description: '',
    priority: 'P2_HIGH',
    assigned_team: 'Station Engineering Team',
    category: 'HABITAT_ELECTRICAL'
  });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    station_id: 'stn-bharati',
    title: '',
    description: '',
    system_type: 'POWER_GEN',
    priority: 'HIGH',
    due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    assigned_person: 'Er. Sandeep Rawat'
  });

  const fetchData = async () => {
    try {
      const [incRes, taskRes, stnRes] = await Promise.all([
        api.incidents.getAll({
          station_id: stationFilter !== 'ALL' ? stationFilter : undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined
        }),
        api.maintenance.getAll({
          station_id: stationFilter !== 'ALL' ? stationFilter : undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined
        }),
        api.stations.getAll()
      ]);

      if (incRes.success) setIncidents(incRes.data);
      if (taskRes.success) setTasks(taskRes.data);
      if (stnRes.success) setStations(stnRes.data);
    } catch (err) {
      console.error('Error fetching maintenance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [stationFilter, statusFilter]);

  const handleUpdateIncidentStatus = async (id, newStatus) => {
    try {
      await api.incidents.update(id, { status: newStatus });
      fetchData();
    } catch (err) {
      alert('Error updating incident: ' + err.message);
    }
  };

  const handleUpdateTaskStatus = async (id, newStatus) => {
    try {
      await api.maintenance.update(id, { status: newStatus });
      fetchData();
    } catch (err) {
      alert('Error updating task: ' + err.message);
    }
  };

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    try {
      await api.incidents.create(incidentForm);
      setIsIncidentModalOpen(false);
      setIncidentForm({
        station_id: 'stn-bharati',
        title: '',
        description: '',
        priority: 'P2_HIGH',
        assigned_team: 'Station Engineering Team',
        category: 'HABITAT_ELECTRICAL'
      });
      fetchData();
    } catch (err) {
      alert('Error creating incident: ' + err.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.maintenance.create(taskForm);
      setIsTaskModalOpen(false);
      setTaskForm({
        station_id: 'stn-bharati',
        title: '',
        description: '',
        system_type: 'POWER_GEN',
        priority: 'HIGH',
        due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        assigned_person: 'Er. Sandeep Rawat'
      });
      fetchData();
    } catch (err) {
      alert('Error scheduling maintenance task: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-polar-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-wide flex items-center gap-2">
            <Wrench size={22} className="text-cyan-400" />
            STATION MAINTENANCE & INCIDENT TRIAGE
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Emergency anomaly mitigation, scheduled preventative maintenance & overdue lifecycle tracking
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsIncidentModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-200 text-xs font-mono font-bold transition"
          >
            <ShieldAlert size={15} />
            <span>Log Incident</span>
          </button>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition shadow-[0_0_12px_rgba(0,229,255,0.25)]"
          >
            <PlusCircle size={15} />
            <span>Schedule Task</span>
          </button>
        </div>
      </div>

      {/* Tabs and Filters Bar */}
      <div className="bg-polar-900/90 border border-polar-800 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        {/* Module Switcher Tabs */}
        <div className="flex items-center bg-polar-950 p-1 rounded-lg border border-polar-800">
          <button
            onClick={() => setActiveTab('incidents')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded font-bold uppercase transition ${
              activeTab === 'incidents'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert size={14} />
            <span>Operational Incidents ({incidents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded font-bold uppercase transition ${
              activeTab === 'tasks'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench size={14} />
            <span>Preventative Tasks ({tasks.length})</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <select
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className="bg-polar-950 border border-polar-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Stations</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-polar-950 border border-polar-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="REPORTED">Reported / Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tab 1: Operational Incidents */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          <div className="bg-polar-900/90 border border-polar-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-polar-950 border-b border-polar-800 text-[11px] text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Station</th>
                    <th className="py-3 px-4">Incident Details</th>
                    <th className="py-3 px-4">Assigned Team</th>
                    <th className="py-3 px-4">Reported At</th>
                    <th className="py-3 px-4 text-center">Status Flow</th>
                    <th className="py-3 px-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-polar-800/80">
                  {incidents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2 opacity-80" />
                        No operational incidents recorded.
                      </td>
                    </tr>
                  ) : (
                    incidents.map((inc) => (
                      <tr key={inc.id} className="hover:bg-polar-850/60 transition">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <SeverityBadge severity={inc.priority} />
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap font-bold text-cyan-300">
                          {inc.station_code}
                        </td>

                        <td className="py-3 px-4 max-w-md">
                          <div className="font-bold text-slate-100">{inc.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                            {inc.description}
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <User size={13} className="text-cyan-400" />
                            <span>{inc.assigned_team}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            By: {inc.reported_by_name}
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                          {new Date(inc.created_at).toLocaleString()}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-center">
                          <StatusBadge status={inc.status} size="sm" pulse={inc.status !== 'RESOLVED'} />
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-right space-x-1.5">
                          {inc.status === 'REPORTED' && (
                            <button
                              onClick={() => handleUpdateIncidentStatus(inc.id, 'INVESTIGATING')}
                              className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded text-[11px] font-semibold border border-cyan-500/40"
                            >
                              Investigate
                            </button>
                          )}
                          {inc.status === 'INVESTIGATING' && (
                            <button
                              onClick={() => handleUpdateIncidentStatus(inc.id, 'MITIGATED')}
                              className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 text-amber-300 rounded text-[11px] font-semibold border border-amber-500/40"
                            >
                              Mitigate
                            </button>
                          )}
                          {inc.status !== 'RESOLVED' && (
                            <button
                              onClick={() => handleUpdateIncidentStatus(inc.id, 'RESOLVED')}
                              className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded text-[11px] font-bold border border-emerald-500/40"
                            >
                              Resolve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Preventative Maintenance Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="bg-polar-900/90 border border-polar-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-polar-950 border-b border-polar-800 text-[11px] text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Station</th>
                    <th className="py-3 px-4">Task & Subsystem</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Assigned Engineer</th>
                    <th className="py-3 px-4 text-center">Due Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-polar-800/80">
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2 opacity-80" />
                        No maintenance tasks found matching filters.
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr
                        key={task.id}
                        className={`hover:bg-polar-850/60 transition ${
                          task.is_overdue ? 'bg-rose-950/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4 whitespace-nowrap font-bold text-cyan-300">
                          {task.station_code}
                        </td>

                        <td className="py-3 px-4 max-w-md">
                          <div className="font-bold text-slate-100 flex items-center gap-2">
                            <span>{task.title}</span>
                            {task.is_overdue && (
                              <span className="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.2 rounded animate-pulse">
                                OVERDUE
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                            System: {task.system_type} • {task.description}
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <SeverityBadge severity={task.priority} />
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                          {task.assigned_person}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-center">
                          <div className={`font-bold ${task.is_overdue ? 'text-rose-400' : 'text-slate-200'}`}>
                            {task.due_date}
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-center">
                          <StatusBadge status={task.status} size="sm" pulse={false} />
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-right space-x-1.5">
                          {task.status === 'PENDING' && (
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, 'IN_PROGRESS')}
                              className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded text-[11px] font-semibold border border-cyan-500/40"
                            >
                              Begin Work
                            </button>
                          )}
                          {task.status !== 'RESOLVED' && (
                            <button
                              onClick={() => handleUpdateTaskStatus(task.id, 'RESOLVED')}
                              className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded text-[11px] font-bold border border-emerald-500/40"
                            >
                              Sign Off
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Incident Modal */}
      <Modal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        title="Log Operational Incident"
        subtitle="Report technical disruption, equipment failure or polar hazard"
      >
        <form onSubmit={handleCreateIncident} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">Antarctic Base *</label>
            <select
              value={incidentForm.station_id}
              onChange={(e) => setIncidentForm({ ...incidentForm, station_id: e.target.value })}
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
              <label className="block text-slate-300 mb-1 font-bold uppercase">Priority Tier *</label>
              <select
                value={incidentForm.priority}
                onChange={(e) => setIncidentForm({ ...incidentForm, priority: e.target.value })}
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              >
                <option value="P1_CRITICAL">P1 - Life-Support Hazard</option>
                <option value="P2_HIGH">P2 - Mission Critical</option>
                <option value="P3_MEDIUM">P3 - Maintenance Degradation</option>
                <option value="P4_LOW">P4 - Low Advisory</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Assigned Response Team *</label>
              <input
                type="text"
                required
                value={incidentForm.assigned_team}
                onChange={(e) => setIncidentForm({ ...incidentForm, assigned_team: e.target.value })}
                placeholder="Station Engineering Team"
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">Incident Title *</label>
            <input
              type="text"
              required
              value={incidentForm.title}
              onChange={(e) => setIncidentForm({ ...incidentForm, title: e.target.value })}
              placeholder="e.g. Blizzard door pneumatic seal breach"
              className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">Detailed Description *</label>
            <textarea
              required
              rows={3}
              value={incidentForm.description}
              onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
              placeholder="Provide exact coordinates, sensor anomalies, and risk factor..."
              className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
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
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold"
            >
              File Incident
            </button>
          </div>
        </form>
      </Modal>

      {/* Schedule Maintenance Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Schedule Preventative Maintenance Task"
        subtitle="Assign periodic checklists, generator overhauls and structural winterization"
      >
        <form onSubmit={handleCreateTask} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Station *</label>
              <select
                value={taskForm.station_id}
                onChange={(e) => setTaskForm({ ...taskForm, station_id: e.target.value })}
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              >
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Subsystem Type *</label>
              <select
                value={taskForm.system_type}
                onChange={(e) => setTaskForm({ ...taskForm, system_type: e.target.value })}
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              >
                <option value="POWER_GEN">Power & Cogeneration</option>
                <option value="HVAC">HVAC & Heating</option>
                <option value="WATER_TREATMENT">Water Desalination</option>
                <option value="COMMS">Satellite Dish & RF</option>
                <option value="HABITAT_STRUCTURAL">Airlocks & Polar Seals</option>
                <option value="SOLAR_RENEWABLE">Solar PV Arrays</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">Task Name / Procedure *</label>
            <input
              type="text"
              required
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder="e.g. Scania Gen #1 500-hour oil and filter overhaul"
              className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Due Date *</label>
              <input
                type="date"
                required
                value={taskForm.due_date}
                onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Assigned Engineer *</label>
              <input
                type="text"
                required
                value={taskForm.assigned_person}
                onChange={(e) => setTaskForm({ ...taskForm, assigned_person: e.target.value })}
                placeholder="Er. Sandeep Rawat"
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">Maintenance Checklist & Notes</label>
            <textarea
              rows={2}
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              placeholder="Specific checklist items, torque specs, spare parts SKUs required..."
              className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-polar-800">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="px-4 py-2 bg-polar-800 hover:bg-polar-700 rounded-lg text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold"
            >
              Commit Maintenance Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
