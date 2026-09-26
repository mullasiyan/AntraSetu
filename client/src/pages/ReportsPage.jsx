import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import SeverityBadge from '../components/common/SeverityBadge';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Boxes,
  Wrench,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.reports.getSummary();
      if (res.success) {
        setReport(res.data);
      }
    } catch (err) {
      console.error('Error fetching operational report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = (type = 'summary') => {
    window.open(api.reports.getExportUrl(type), '_blank');
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 font-mono text-xs">
        <RefreshCw size={28} className="mx-auto text-cyan-400 animate-spin mb-3" />
        Compiling fleet-wide operational summary from Antarctic telemetry datastore...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-24 text-center text-slate-400 font-mono text-xs">
        Failed to compile polar operations dossier.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Header (Hidden during browser printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-polar-800 pb-4 print:hidden">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-wide flex items-center gap-2">
            <FileText size={22} className="text-cyan-400" />
            OPERATIONAL SUMMARY & POLAR DOSSIER
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Official briefing dossier • Ministry of Earth Sciences & NCPOR Antarctica Command
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handleExportCSV('inventory')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-polar-900 hover:bg-polar-800 border border-polar-700 text-slate-200 text-xs font-mono transition"
          >
            <Download size={14} className="text-cyan-400" />
            <span>Export Inventory CSV</span>
          </button>

          <button
            onClick={() => handleExportCSV('incidents')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-polar-900 hover:bg-polar-800 border border-polar-700 text-slate-200 text-xs font-mono transition"
          >
            <Download size={14} className="text-cyan-400" />
            <span>Export Incidents CSV</span>
          </button>

          <button
            onClick={() => handleExportCSV('stations')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-polar-900 hover:bg-polar-800 border border-polar-700 text-slate-200 text-xs font-mono transition"
          >
            <Download size={14} className="text-cyan-400" />
            <span>Export Stations CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition shadow-[0_0_12px_rgba(0,229,255,0.25)]"
          >
            <Printer size={15} />
            <span>Print Dossier / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Dossier Card */}
      <div className="bg-polar-900 border border-polar-800 rounded-xl p-6 sm:p-8 shadow-2xl space-y-8 font-mono text-slate-200 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Document Official Masthead */}
        <div className="border-b-2 border-cyan-500/40 pb-6 print:border-black">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold print:text-slate-700">
                GOVERNMENT OF INDIA • MINISTRY OF EARTH SCIENCES
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-wide mt-1 text-white print:text-black">
                {report.mission_title}
              </h2>
              <div className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                Indian Antarctic Research Stations Operations Command (AntarSetu)
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <div className="text-slate-400 print:text-slate-600 text-[10px] uppercase">
                Generated Timestamp
              </div>
              <div className="font-bold text-slate-100 print:text-black">
                {new Date(report.generated_at).toUTCString()}
              </div>
              <div className="text-[11px] text-cyan-300 print:text-slate-700 mt-0.5">
                Officer: {report.generated_by}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Antarctic Research Stations Readiness */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 print:text-black border-b border-polar-800 pb-2 mb-3 flex items-center gap-2">
            <span>1.0 Station Subsystem & Climate Telemetry Overview</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-polar-800 print:border-slate-300">
              <thead className="bg-polar-950 text-slate-400 print:bg-slate-100 print:text-black uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Code</th>
                  <th className="p-2.5">Station Name</th>
                  <th className="p-2.5 text-center">Status</th>
                  <th className="p-2.5 text-right">Ext Temp</th>
                  <th className="p-2.5 text-right">Gen Load</th>
                  <th className="p-2.5 text-right">Fuel %</th>
                  <th className="p-2.5 text-center">Crew</th>
                  <th className="p-2.5 text-center">Active Alerts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-polar-800 print:divide-slate-300">
                {report.stations.map((s) => (
                  <tr key={s.station_id} className="hover:bg-polar-850/50">
                    <td className="p-2.5 font-bold text-cyan-300 print:text-black">{s.station_code}</td>
                    <td className="p-2.5">{s.station_name}</td>
                    <td className="p-2.5 text-center">
                      <StatusBadge status={s.operational_status} size="sm" pulse={false} />
                    </td>
                    <td className="p-2.5 text-right font-bold">{s.outdoor_temp_c}°C</td>
                    <td className="p-2.5 text-right">{s.power_load_pct}%</td>
                    <td className="p-2.5 text-right">{s.fuel_level_pct}%</td>
                    <td className="p-2.5 text-center">{s.personnel_count}</td>
                    <td className="p-2.5 text-center">
                      <span className={s.critical_alerts_count > 0 ? 'text-rose-400 font-bold' : ''}>
                        {s.active_alerts_count} ({s.critical_alerts_count} Crit)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Active Life-Support & Subsystem Alarms */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-300 print:text-black border-b border-polar-800 pb-2 mb-3 flex items-center gap-2">
            <span>2.0 Active Operational Hazards & Warnings ({report.active_alerts.length})</span>
          </h3>

          {report.active_alerts.length === 0 ? (
            <div className="p-4 bg-polar-950 rounded text-xs text-slate-400 print:bg-slate-50">
              Zero active alarms recorded across the polar fleet.
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {report.active_alerts.map((a) => (
                <div
                  key={a.id}
                  className="p-3 bg-polar-950 rounded border border-polar-800 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={a.severity} />
                      <span className="font-bold text-slate-100 print:text-black">
                        [{a.station_code}] {a.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 print:text-slate-600 mt-1">
                      {a.message}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-400 shrink-0">
                    {a.is_acknowledged ? '✓ ACKNOWLEDGED' : '● UNACKNOWLEDGED'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Low Inventory Runway */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 print:text-black border-b border-polar-800 pb-2 mb-3 flex items-center gap-2">
            <span>3.0 Consumables Runway Warning & Depletion Analysis</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-polar-800 print:border-slate-300">
              <thead className="bg-polar-950 text-slate-400 print:bg-slate-100 print:text-black uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Resource</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5 text-right">Current Stock</th>
                  <th className="p-2.5 text-right">Daily Burn</th>
                  <th className="p-2.5 text-center">Days Remaining</th>
                  <th className="p-2.5">Safety Buffer Min</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-polar-800 print:divide-slate-300">
                {report.critical_inventory.map((i) => (
                  <tr key={i.id}>
                    <td className="p-2.5 font-bold">{i.name}</td>
                    <td className="p-2.5">{i.category}</td>
                    <td className="p-2.5 text-right font-bold">{i.quantity} {i.unit}</td>
                    <td className="p-2.5 text-right">-{i.daily_consumption_rate} {i.unit}/d</td>
                    <td className="p-2.5 text-center font-bold text-amber-400 print:text-black">
                      {i.days_remaining} Days
                    </td>
                    <td className="p-2.5">{i.min_threshold} {i.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Open Incidents & Overdue Maintenance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black border-b border-polar-800 pb-2 mb-2">
              4.1 Active Incidents ({report.open_incidents.length})
            </h3>
            <div className="space-y-2 text-xs">
              {report.open_incidents.map((inc) => (
                <div key={inc.id} className="p-2.5 bg-polar-950 rounded border border-polar-800 print:border-slate-300">
                  <div className="font-bold">[{inc.station_code}] {inc.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Team: {inc.assigned_team} • Status: {inc.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300 print:text-black border-b border-polar-800 pb-2 mb-2">
              4.2 Overdue Preventative Maintenance ({report.overdue_maintenance.length})
            </h3>
            <div className="space-y-2 text-xs">
              {report.overdue_maintenance.map((m) => (
                <div key={m.id} className="p-2.5 bg-polar-950 rounded border border-rose-900/50 print:border-slate-300">
                  <div className="font-bold text-rose-300 print:text-black">[{m.station_code}] {m.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Assigned: {m.assigned_person} • Due: {m.due_date} (OVERDUE)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sign-off authentication */}
        <div className="pt-6 border-t border-polar-800 print:border-black flex justify-between items-center text-xs text-slate-400 print:text-slate-700">
          <div>
            <span>Official Record Classification: </span>
            <strong className="text-cyan-400 print:text-black">NCPOR-ANT-OPS-CONFIDENTIAL</strong>
          </div>
          <div className="border-t border-slate-600 pt-1 w-48 text-center text-[10px]">
            Station Operations Officer Signature
          </div>
        </div>
      </div>
    </div>
  );
}
