import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  AlertTriangle,
  Boxes,
  Wrench,
  MapPin,
  FileText,
  X,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, activeAlertsCount = 0 }) {
  const navItems = [
    { to: '/', label: 'Operations Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/stations', label: 'Station Telemetry', icon: Radio },
    { to: '/alerts', label: 'Alert Intelligence', icon: AlertTriangle, badge: activeAlertsCount },
    { to: '/inventory', label: 'Resource Management', icon: Boxes },
    { to: '/maintenance', label: 'Maintenance & Incidents', icon: Wrench },
    { to: '/map', label: 'Antarctic Polar Map', icon: MapPin },
    { to: '/reports', label: 'Operations Reports', icon: FileText },
  ];

  const stations = [
    { id: 'stn-bharati', name: 'Bharati', code: 'BHARATI', status: 'NOMINAL', dot: 'bg-emerald-400' },
    { id: 'stn-maitri', name: 'Maitri', code: 'MAITRI', status: 'WARNING', dot: 'bg-amber-400' },
    { id: 'stn-dakshin-gangotri', name: 'Dakshin Gangotri', code: 'DAKSHIN_GANGOTRI', status: 'CRITICAL', dot: 'bg-rose-500' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-polar-950 border-r border-polar-800 z-40 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Banner */}
        <div className="h-16 px-5 border-b border-polar-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/antrasetu-logo.png.jpeg"
              alt="AntarSetu logo"
              className="w-8 h-8 rounded-lg object-contain border border-cyan-500/40 bg-cyan-950 shadow-[0_0_12px_rgba(0,229,255,0.3)]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-base tracking-wider text-slate-100">
                  ANTAR<span className="text-cyan-400">SETU</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-500 bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-500/30">
                  v1.0
                </span>
              </div>
              <div className="text-[9px] font-mono tracking-tight text-slate-400 uppercase">
                NCPOR • Antarctic Mission Control
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            Core Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => onClose?.()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all group ${
                    isActive
                      ? 'bg-polar-800 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,229,255,0.1)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-polar-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={17} className="transition group-hover:text-cyan-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-600/90 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Station Quick Jump */}
          <div className="pt-6 px-3 py-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
            <span>Research Stations</span>
            <ShieldCheck size={12} className="text-slate-500" />
          </div>

          <div className="space-y-1 pt-1">
            {stations.map((stn) => (
              <NavLink
                key={stn.id}
                to={`/stations/${stn.id}`}
                onClick={() => onClose?.()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition ${
                    isActive
                      ? 'bg-polar-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-polar-900/60'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stn.dot}`}></span>
                  <span className="truncate">{stn.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase">{stn.status}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-polar-800 text-[10px] font-mono text-slate-500 bg-polar-950">
          <div className="flex items-center justify-between">
            <span>SYSTEM ENCRYPTION</span>
            <span className="text-emerald-400 font-bold">AES-256</span>
          </div>
          <div className="mt-1 text-slate-600 text-[9px]">
            Govt. of India • Ministry of Earth Sciences
          </div>
        </div>
      </aside>
    </>
  );
}
