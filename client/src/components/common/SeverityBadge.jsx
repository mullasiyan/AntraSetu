import React from 'react';

export default function SeverityBadge({ severity }) {
  const s = (severity || 'LOW').toUpperCase();

  const styles = {
    CRITICAL: 'bg-rose-950/80 text-rose-200 border-rose-500/70 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
    HIGH: 'bg-orange-950/70 text-orange-200 border-orange-500/60 shadow-[0_0_8px_rgba(249,115,22,0.25)]',
    MEDIUM: 'bg-amber-950/60 text-amber-200 border-amber-500/50',
    LOW: 'bg-sky-950/50 text-sky-200 border-sky-500/40',
  };

  const style = styles[s] || styles.LOW;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase border ${style}`}
    >
      {s}
    </span>
  );
}
