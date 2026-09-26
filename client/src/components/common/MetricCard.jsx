import React from 'react';

export default function MetricCard({
  label,
  value,
  unit = '',
  subtext,
  icon: Icon,
  status = 'default',
  trend
}) {
  const borderColors = {
    default: 'border-slate-800/90 bg-polar-900/80 hover:border-slate-700',
    nominal: 'border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-500/50',
    warning: 'border-amber-500/30 bg-amber-950/20 hover:border-amber-500/50',
    critical: 'border-rose-500/40 bg-rose-950/30 hover:border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    cyan: 'border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-500/50'
  };

  const textColors = {
    default: 'text-slate-100',
    nominal: 'text-emerald-300',
    warning: 'text-amber-300',
    critical: 'text-rose-300',
    cyan: 'text-cyan-300'
  };

  return (
    <div
      className={`rounded-lg border p-4 transition-all duration-200 backdrop-blur-sm ${
        borderColors[status] || borderColors.default
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono font-medium tracking-wide uppercase text-slate-400">
          {label}
        </span>
        {Icon && (
          <div className="p-1.5 rounded bg-polar-800/80 text-cyan-400 border border-polar-700/50">
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className={`text-2xl font-bold font-mono tracking-tight ${textColors[status] || textColors.default}`}>
          {value !== undefined && value !== null ? value : '--'}
        </span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>

      {(subtext || trend) && (
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>{subtext}</span>
          {trend && <span className="text-cyan-400">{trend}</span>}
        </div>
      )}
    </div>
  );
}
