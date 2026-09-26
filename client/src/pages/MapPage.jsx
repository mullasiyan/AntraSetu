import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import AntarcticPolarMap from '../components/map/AntarcticPolarMap';
import StatusBadge from '../components/common/StatusBadge';
import { MapPin, Compass, Radio, ExternalLink, ShieldCheck, Thermometer, Wind, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MapPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    api.stations.getAll().then((res) => {
      if (res.success) {
        setStations(res.data);
        if (res.data.length > 0) setSelectedStation(res.data[0]);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-polar-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-wide flex items-center gap-2">
            <Compass size={22} className="text-cyan-400" />
            ANTARCTIC CONTINENTAL GEOSPATIAL COMMAND
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Polar stereographic radar projection • Bharati, Maitri, and Dakshin Gangotri
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Polar Coordinate System: WGS 84 / Antarctic Polar Stereographic</span>
        </div>
      </div>

      {/* Main Interactive Map View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <AntarcticPolarMap stations={stations} onSelectStation={(stn) => setSelectedStation(stn)} />
        </div>

        {/* Side Telemetry & Station Dossier */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-polar-900/90 border border-polar-800 rounded-xl p-5 shadow-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-polar-800 pb-3 mb-4 flex items-center justify-between">
              <span>Research Stations Fleet</span>
              <span className="text-cyan-400">{stations.length} Active Nodes</span>
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              {stations.map((stn) => {
                const isSelected = selectedStation?.id === stn.id;
                return (
                  <div
                    key={stn.id}
                    onClick={() => setSelectedStation(stn)}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'bg-polar-800 border-cyan-500/60 shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                        : 'bg-polar-950 border-polar-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100">{stn.name}</span>
                      <StatusBadge status={stn.operational_status || stn.status} size="sm" />
                    </div>

                    <div className="text-[11px] text-cyan-400 mt-1">
                      {stn.latitude}° S, {stn.longitude}° E
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                      {stn.location_description}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-polar-800/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        Temp: <strong className="text-slate-200">{stn.telemetry?.outdoor_temp_c}°C</strong>
                      </span>
                      <Link
                        to={`/stations/${stn.id}`}
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        Details <ExternalLink size={11} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Antarctic Geodesic Distance Matrix */}
          <div className="bg-polar-900/90 border border-polar-800 rounded-xl p-5 shadow-xl font-mono text-xs">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-cyan-400" />
              Polar Transit Distances
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex justify-between py-1 border-b border-polar-800/60">
                <span>Bharati ↔ Maitri:</span>
                <span className="text-slate-200 font-bold">~2,980 km (Air / Vessel)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-polar-800/60">
                <span>Maitri ↔ Dakshin Gangotri:</span>
                <span className="text-slate-200 font-bold">~90 km (Snow Piston-Bully Convoy)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>South Pole ↔ Maitri:</span>
                <span className="text-slate-200 font-bold">~2,140 km</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
