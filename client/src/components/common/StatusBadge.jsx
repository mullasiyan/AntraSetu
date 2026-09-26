import React from 'react';

export default function StatusBadge({ status, size = 'md', pulse = true }) {
  const norm = (status || 'UNKNOWN').toUpperCase();

  let colors = 'bg-slate-800/80 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';
  let pulseClass = '';

  if (norm === 'NOMINAL' || norm === 'ONLINE' || norm === 'OPTIMAL' || norm === 'RESOLVED') {
    colors = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
    dotColor = 'bg-emerald-400';
    pulseClass = pulse ? 'pulse-nominal' : '';
  } else if (norm === 'WARNING' || norm === 'LOW' || norm === 'INVESTIGATING' || norm === 'DEGRADED') {
    colors = 'bg-amber-950/60 text-amber-300 border-amber-500/40';
    dotColor = 'bg-amber-400';
  } else if (norm === 'CRITICAL' || norm === 'OFFLINE' || norm === 'P1_CRITICAL') {
    colors = 'bg-rose-950/70 text-rose-300 border-rose-500/50';
    dotColor = 'bg-rose-500';
    pulseClass = pulse ? 'pulse-critical' : '';
  } else if (norm === 'IN_PROGRESS' || norm === 'MITIGATED') {
    colors = 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40';
    dotColor = 'bg-cyan-400';
  } else if (norm === 'STANDBY' || norm === 'PENDING') {
    colors = 'bg-blue-950/50 text-blue-300 border-blue-500/30';
    dotColor = 'bg-blue-400';
  }

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5 gap-1.5' 
    : 'text-xs font-semibold px-2.5 py-1 gap-2';

  return (
    <span
      className={`inline-flex items-center rounded border tracking-wider font-mono uppercase ${colors} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${pulseClass}`} />
      <span>{norm.replace(/_/g, ' ')}</span>
    </span>
  );
}
