import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Radio, Clock, Shield, LogOut, Bell, Menu, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ activeAlertsCount = 0, onToggleSidebar }) {
  const { user, logout, switchDemoRole } = useAuth();
  const [timeUtc, setTimeUtc] = useState('');
  const [timeIst, setTimeIst] = useState('');
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().slice(17, 25) + ' UTC');
      // Indian Standard Time is UTC + 5:30
      const istString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setTimeIst(istString + ' IST');
    };
    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, []);

  const demoRoles = [
    { email: 'commander.bharati@antarsetu.gov.in', label: 'Dr. Rajesh Nair (Commander - Bharati)' },
    { email: 'engineer.maitri@antarsetu.gov.in', label: 'Lt. Cdr. Priya Sundaram (Ops Engineer - Maitri)' },
    { email: 'logistics.hq@antarsetu.gov.in', label: 'Anand Verma (Logistics Director - HQ)' },
    { email: 'scientist.glaciology@antarsetu.gov.in', label: 'Dr. Sunita Deshmukh (Glaciologist)' }
  ];

  return (
    <header className="h-16 bg-polar-900/90 border-b border-polar-800 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-polar-800 rounded-lg"
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        {/* Polar Clocks */}
        <div className="hidden sm:flex items-center gap-3 border-r border-polar-800 pr-4">
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300">
            <Clock size={14} className="text-cyan-400" />
            <span className="font-semibold">{timeUtc}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs font-mono text-slate-300">
            <span>{timeIst}</span>
          </div>
        </div>

        {/* Satellite Comms Status */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-polar-950 border border-polar-800 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <Radio size={13} className="text-cyan-400" />
          <span className="text-slate-300">VSAT 12 Mbps: <strong className="text-emerald-400">UPLINK NOMINAL</strong></span>
        </div>

        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 whitespace-nowrap"
          title="All telemetry and operational records in this demonstration are simulated."
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse"></span>
          DEMO / SIMULATED DATA
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Active Alerts Bell Link */}
        <Link
          to="/alerts"
          className="relative p-2 text-slate-300 hover:text-white hover:bg-polar-800 rounded-lg transition"
          title="Active Polar Alerts"
        >
          <Bell size={18} />
          {activeAlertsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-mono font-bold flex items-center justify-center animate-pulse">
              {activeAlertsCount}
            </span>
          )}
        </Link>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-polar-950 border border-polar-800 hover:border-cyan-500/50 transition text-left"
          >
            <div className="w-7 h-7 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs">
              {user?.full_name?.charAt(0) || 'O'}
            </div>
            <div className="hidden lg:block">
              <div className="text-xs font-semibold text-slate-100 leading-tight">
                {user?.full_name || 'Station Operator'}
              </div>
              <div className="text-[10px] font-mono text-cyan-400">
                {user?.role?.replace(/_/g, ' ') || 'OPERATOR'}
              </div>
            </div>
            <UserCheck size={14} className="text-slate-400 ml-1 hidden lg:block" />
          </button>

          {roleMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-72 bg-polar-900 border border-polar-700 rounded-xl shadow-2xl py-2 z-50 text-xs"
              onClick={() => setRoleMenuOpen(false)}
            >
              <div className="px-3 py-1.5 font-mono text-[11px] text-slate-400 border-b border-polar-800">
                SWITCH ACTIVE POLAR ROLE
              </div>
              {demoRoles.map((r) => (
                <button
                  key={r.email}
                  onClick={() => switchDemoRole(r.email)}
                  className={`w-full text-left px-3 py-2 hover:bg-polar-800 flex items-center justify-between font-mono ${
                    user?.email === r.email ? 'text-cyan-400 font-bold bg-polar-800/50' : 'text-slate-300'
                  }`}
                >
                  <span className="truncate">{r.label}</span>
                  {user?.email === r.email && <span className="text-[10px] bg-cyan-500/20 px-1 rounded">ACTIVE</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-rose-300 hover:bg-polar-800 rounded-lg transition"
          title="Sign Out of Mission Console"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
