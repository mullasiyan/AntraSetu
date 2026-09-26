import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { Thermometer, Wind, Zap, Radio, Users, ChevronRight, X, ExternalLink } from 'lucide-react';

export default function AntarcticPolarMap({ stations = [], onSelectStation }) {
  const [selectedStation, setSelectedStation] = useState(null);

  // Map coordinates projection for Polar Stereographic representation
  // Bharati: 69°24'S, 76°11'E -> East Antarctica (around 2 o'clock relative to South Pole)
  // Maitri: 70°46'S, 11°44'E -> Queen Maud Land (around 10 o'clock relative to South Pole)
  // Dakshin Gangotri: 70°05'S, 12°00'E -> Ice Shelf (near Maitri, slightly closer to the outer ice margin)
  const stationPins = {
    'stn-bharati': { x: 575, y: 310, label: 'Bharati Station (Larsemann Hills)' },
    'stn-maitri': { x: 315, y: 245, label: 'Maitri Station (Schirmacher Oasis)' },
    'stn-dakshin-gangotri': { x: 300, y: 215, label: 'Dakshin Gangotri (Ice Shelf Depot)' },
  };

  const handlePinClick = (stn) => {
    setSelectedStation(stn);
    if (onSelectStation) onSelectStation(stn);
  };

  return (
    <div className="relative bg-polar-950 border border-polar-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Map Control Bar */}
      <div className="px-5 py-3 border-b border-polar-800 bg-polar-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
            ANTARCTIC CONTINENTAL POLAR STEREOGRAPHIC RADAR
          </h3>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Nominal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Warning
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Critical / Hazard
          </span>
        </div>
      </div>

      {/* SVG Interactive Polar Map Canvas */}
      <div className="relative w-full aspect-[16/10] min-h-[460px] flex items-center justify-center bg-[#030712] overflow-hidden select-none">
        {/* Radar concentric polar grid */}
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full object-contain"
        >
          <defs>
            <radialGradient id="polarGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0B1C38" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#061226" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020617" stopOpacity="1" />
            </radialGradient>
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Polar Sea */}
          <rect width="800" height="600" fill="url(#polarGrad)" />

          {/* Coordinate Grids (Latitude circles: 80°S, 70°S, 60°S) */}
          <circle cx="400" cy="300" r="240" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="400" cy="300" r="170" fill="none" stroke="#1E3A8A" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx="400" cy="300" r="90" fill="none" stroke="#0284C7" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
          <circle cx="400" cy="300" r="4" fill="#00E5FF" filter="url(#cyanGlow)" />
          
          {/* Latitude Labels */}
          <text x="405" y="295" fill="#38BDF8" fontSize="9" fontFamily="monospace">90°S (South Pole)</text>
          <text x="405" y="215" fill="#64748B" fontSize="9" fontFamily="monospace">80°S</text>
          <text x="405" y="135" fill="#64748B" fontSize="9" fontFamily="monospace">70°S</text>
          <text x="405" y="65" fill="#475569" fontSize="9" fontFamily="monospace">60°S (Polar Circle)</text>

          {/* Meridians */}
          <line x1="400" y1="50" x2="400" y2="550" stroke="#1E293B" strokeWidth="1" strokeDasharray="2,4" />
          <line x1="150" y1="300" x2="650" y2="300" stroke="#1E293B" strokeWidth="1" strokeDasharray="2,4" />
          <line x1="220" y1="120" x2="580" y2="480" stroke="#0F172A" strokeWidth="1" strokeDasharray="2,4" />
          <line x1="220" y1="480" x2="580" y2="120" stroke="#0F172A" strokeWidth="1" strokeDasharray="2,4" />

          {/* Simplified High-Fidelity Stylized Antarctic Coastline & Ice Shelves */}
          {/* Main Antarctic Continent Body */}
          <path
            d="M 400 130
               C 470 120, 560 180, 610 240
               C 650 290, 640 370, 580 430
               C 530 480, 440 500, 370 480
               C 310 460, 260 410, 240 360
               C 210 300, 220 220, 290 160
               Z"
            fill="#0F2447"
            stroke="#38BDF8"
            strokeWidth="1.5"
            opacity="0.85"
          />

          {/* Antarctic Peninsula tail extending NW */}
          <path
            d="M 270 230
               C 250 190, 220 150, 190 120
               C 180 110, 175 125, 185 140
               C 210 180, 240 220, 260 250
               Z"
            fill="#0F2447"
            stroke="#38BDF8"
            strokeWidth="1.5"
            opacity="0.85"
          />

          {/* Ice Shelf Hatching (Amery Ice Shelf near Larsemann Hills) */}
          <path
            d="M 540 280 Q 560 300 580 290"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="2"
            strokeDasharray="4,2"
            opacity="0.7"
          />
          <text x="560" y="270" fill="#93C5FD" fontSize="8" fontFamily="monospace">Amery Ice Shelf</text>

          {/* Queen Maud Land label */}
          <text x="240" y="210" fill="#93C5FD" fontSize="8" fontFamily="monospace">Queen Maud Land</text>
          {/* Princess Astrid Coast */}
          <text x="280" y="190" fill="#64748B" fontSize="8" fontFamily="monospace">Princess Astrid Coast</text>
          {/* Larsemann Hills */}
          <text x="585" y="335" fill="#93C5FD" fontSize="8" fontFamily="monospace">Larsemann Hills</text>

          {/* Interactive Station Pins */}
          {stations.map((stn) => {
            const pin = stationPins[stn.id] || { x: 400, y: 300 };
            const isSelected = selectedStation?.id === stn.id;
            const status = stn.operational_status || stn.status;

            let fill = '#10B981';
            let strokeGlow = '#34D399';
            if (status === 'WARNING') {
              fill = '#F59E0B';
              strokeGlow = '#FBBF24';
            } else if (status === 'CRITICAL') {
              fill = '#EF4444';
              strokeGlow = '#F87171';
            }

            return (
              <g
                key={stn.id}
                className="cursor-pointer transition-transform duration-200 hover:scale-125"
                onClick={() => handlePinClick(stn)}
              >
                {/* Radar ping ring */}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={isSelected ? 22 : 14}
                  fill="none"
                  stroke={strokeGlow}
                  strokeWidth="1.5"
                  className={status === 'CRITICAL' ? 'animate-ping' : ''}
                  opacity="0.6"
                />
                
                {/* Outer halo */}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r="8"
                  fill={fill}
                  filter="url(#pinGlow)"
                  opacity="0.4"
                />

                {/* Center marker */}
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r="5"
                  fill={fill}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />

                {/* Station Tag */}
                <rect
                  x={pin.x + 10}
                  y={pin.y - 12}
                  width={stn.code.length * 7 + 24}
                  height="20"
                  rx="3"
                  fill="#091325"
                  stroke={isSelected ? '#00E5FF' : '#1E3A8A'}
                  strokeWidth="1"
                  opacity="0.95"
                />
                <circle
                  cx={pin.x + 18}
                  cy={pin.y - 2}
                  r="3"
                  fill={fill}
                />
                <text
                  x={pin.x + 26}
                  y={pin.y + 2}
                  fill="#F8FAFC"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {stn.code}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Station Floating HUD Panel */}
        {selectedStation && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 bg-polar-900/95 border border-cyan-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-200 z-10">
            <div className="flex items-start justify-between gap-2 border-b border-polar-800 pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white font-mono">{selectedStation.name}</h4>
                </div>
                <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                  {selectedStation.latitude}° S, {selectedStation.longitude}° E
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <StatusBadge status={selectedStation.operational_status || selectedStation.status} size="sm" />
                <button
                  onClick={() => setSelectedStation(null)}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Quick telemetry metrics */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
              <div className="bg-polar-950/80 p-2 rounded border border-polar-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Thermometer size={13} className="text-cyan-400" /> Outdoor:
                </span>
                <span className="font-bold text-slate-100">
                  {selectedStation.telemetry?.outdoor_temp_c !== undefined
                    ? `${selectedStation.telemetry.outdoor_temp_c}°C`
                    : '--'}
                </span>
              </div>

              <div className="bg-polar-950/80 p-2 rounded border border-polar-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Wind size={13} className="text-cyan-400" /> Wind:
                </span>
                <span className="font-bold text-slate-100">
                  {selectedStation.telemetry?.wind_speed_knots !== undefined
                    ? `${selectedStation.telemetry.wind_speed_knots} kts`
                    : '--'}
                </span>
              </div>

              <div className="bg-polar-950/80 p-2 rounded border border-polar-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Zap size={13} className="text-amber-400" /> Gen Fuel:
                </span>
                <span className="font-bold text-slate-100">
                  {selectedStation.telemetry?.fuel_level_pct !== undefined
                    ? `${selectedStation.telemetry.fuel_level_pct}%`
                    : '--'}
                </span>
              </div>

              <div className="bg-polar-950/80 p-2 rounded border border-polar-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Users size={13} className="text-cyan-400" /> Crew:
                </span>
                <span className="font-bold text-slate-100">
                  {selectedStation.personnel_count} / {selectedStation.max_capacity}
                </span>
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-polar-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                {selectedStation.comms_status === 'ONLINE' ? '🟢 VSAT Uplink Active' : '🟡 Satellite Backup'}
              </span>
              <Link
                to={`/stations/${selectedStation.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded transition"
              >
                Open Station Console <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
