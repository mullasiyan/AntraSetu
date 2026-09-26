import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CriticalBanner({ criticalAlerts = [], onAcknowledge }) {
  if (!criticalAlerts || criticalAlerts.length === 0) return null;

  const topAlert = criticalAlerts[0];

  return (
    <div className="bg-rose-950/90 border-b border-rose-500/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-rose-100 shadow-[0_4px_20px_rgba(244,63,94,0.25)] relative z-30">
      <div className="flex items-center gap-3">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-rose-600 text-white px-2 py-0.5 rounded">
            CRITICAL LIFE-SUPPORT ALARM [{criticalAlerts.length}]
          </span>
          <span className="text-xs font-mono font-bold text-rose-200">
            {topAlert.station_code}:
          </span>
          <span className="text-xs font-medium line-clamp-1">{topAlert.title}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!topAlert.is_acknowledged && onAcknowledge && (
          <button
            onClick={() => onAcknowledge(topAlert.id)}
            className="text-xs font-mono font-semibold bg-rose-600 hover:bg-rose-500 text-white px-3 py-1 rounded transition"
          >
            ACKNOWLEDGE
          </button>
        )}
        <Link
          to="/alerts"
          className="text-xs font-mono flex items-center gap-1 text-rose-300 hover:text-white underline underline-offset-4"
        >
          View All Alerts <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
