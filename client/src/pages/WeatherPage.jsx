import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Wind, Thermometer, Droplets, Eye, Gauge, Compass,
  AlertTriangle, CheckCircle, ShieldAlert, CloudSnow,
  RefreshCw, Sun, Cloud, Activity
} from 'lucide-react';

const STATION_META = {
  'stn-bharati': { label: 'Bharati', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/8' },
  'stn-maitri': { label: 'Maitri', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/8' },
  'stn-dakshin-gangotri': { label: 'Dakshin Gangotri', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/8' },
};

const SEVERITY_CONFIG = {
  CALM: { label: 'CALM', icon: Sun, cls: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  MODERATE: { label: 'MODERATE', icon: Cloud, cls: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  SEVERE: { label: 'SEVERE', icon: AlertTriangle, cls: 'text-orange-400 bg-orange-500/15 border-orange-500/30' },
  EXTREME: { label: 'EXTREME', icon: ShieldAlert, cls: 'text-rose-400 bg-rose-500/15 border-rose-500/30 animate-pulse' },
};

const OUTDOOR_CONFIG = {
  SAFE: { label: 'SAFE TO OPERATE', cls: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40' },
  CAUTION: { label: 'CAUTION ADVISED', cls: 'text-amber-300 bg-amber-500/15 border-amber-500/40' },
  UNSAFE: { label: 'UNSAFE — SUSPEND OPS', cls: 'text-rose-300 bg-rose-500/15 border-rose-500/40 animate-pulse' },
};

function SeverityBadge({ severity }) {
  const c = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.CALM;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${c.cls}`}>
      <Icon size={10} />
      {c.label}
    </span>
  );
}

function OutdoorBadge({ rec }) {
  const c = OUTDOOR_CONFIG[rec] || OUTDOOR_CONFIG.CAUTION;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold border ${c.cls}`}>
      {c.label}
    </span>
  );
}

function ForecastSeverityDot({ severity }) {
  const colors = {
    CALM: 'bg-emerald-400',
    MODERATE: 'bg-amber-400',
    SEVERE: 'bg-orange-500',
    EXTREME: 'bg-rose-500',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[severity] || 'bg-slate-500'}`} />;
}

function MetricPill({ icon: Icon, label, value, unit, color = 'text-slate-200' }) {
  return (
    <div className="flex flex-col items-center bg-polar-800/60 rounded-xl px-3 py-3 min-w-[80px]">
      <Icon size={15} className="text-slate-500 mb-1" />
      <div className={`text-sm font-mono font-bold ${color}`}>{value}<span className="text-[10px] text-slate-500 ml-0.5">{unit}</span></div>
      <div className="text-[10px] font-mono text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState('ALL');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = async () => {
    try {
      const params = selectedStation !== 'ALL' ? { station_id: selectedStation } : {};
      const res = await api.weather.getAll(params);
      if (res.success) {
        setWeatherData(res.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, [selectedStation]);

  const displayData = weatherData;

  const extremeCount = displayData.filter(w => w.severity === 'EXTREME').length;
  const unsafeCount = displayData.filter(w => w.outdoor_recommendation === 'UNSAFE').length;

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 mb-1">
            <span>NCPOR</span><span className="text-slate-600">›</span>
            <span>Antarctic Mission Control</span><span className="text-slate-600">›</span>
            <span className="text-cyan-400">Polar Weather Intel</span>
          </div>
          <h1 className="text-xl font-mono font-bold text-slate-100 tracking-wide">
            Polar Weather Intelligence
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            <span className="text-amber-400 font-bold">[DEMO SIMULATION]</span> — Antarctic Automatic Weather Station data + NCMRWF forecast model
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchWeather}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-polar-800 border border-polar-700 text-xs font-mono text-slate-400 hover:text-cyan-300 transition"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
          {lastUpdated && (
            <span className="text-[10px] font-mono text-slate-600">
              Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Alert Banners */}
      {(extremeCount > 0 || unsafeCount > 0) && (
        <div className="flex gap-3 flex-wrap">
          {extremeCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-rose-950/40 border border-rose-500/40 rounded-lg">
              <ShieldAlert size={14} className="text-rose-400 animate-pulse" />
              <span className="text-xs font-mono text-rose-400 font-bold">
                EXTREME weather conditions at {extremeCount} station(s) — all outdoor ops suspended
              </span>
            </div>
          )}
        </div>
      )}

      {/* Station filter tabs */}
      <div className="flex gap-2">
        {['ALL', 'stn-bharati', 'stn-maitri', 'stn-dakshin-gangotri'].map(id => {
          const label = id === 'ALL' ? 'All Stations' : (STATION_META[id]?.label || id);
          const active = selectedStation === id;
          return (
            <button
              key={id}
              onClick={() => setSelectedStation(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition border ${
                active
                  ? 'bg-cyan-900/40 border-cyan-500/40 text-cyan-300'
                  : 'bg-polar-900 border-polar-700 text-slate-400 hover:text-slate-200 hover:border-polar-600'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Weather Cards */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-mono text-sm">
          Loading weather data...
        </div>
      ) : (
        <div className="space-y-6">
          {displayData.map((wx) => {
            const stnMeta = STATION_META[wx.station_id] || {};
            return (
              <div key={wx.id} className={`bg-polar-900 border ${stnMeta.border || 'border-polar-800'} rounded-xl overflow-hidden`}>
                {/* Station Header */}
                <div className={`px-5 py-3 border-b ${stnMeta.border || 'border-polar-800'} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <CloudSnow size={16} className={stnMeta.color || 'text-slate-400'} />
                    <span className={`text-sm font-mono font-bold ${stnMeta.color || 'text-slate-300'}`}>
                      {wx.station_code}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {new Date(wx.recorded_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} UTC
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={wx.severity} />
                    <OutdoorBadge rec={wx.outdoor_recommendation} />
                  </div>
                </div>

                {/* Current Conditions */}
                <div className="p-5">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <MetricPill icon={Thermometer} label="Temperature" value={wx.temperature_c} unit="°C" color="text-cyan-300" />
                    <MetricPill icon={Thermometer} label="Feels Like" value={wx.feels_like_c} unit="°C" color="text-cyan-400" />
                    <MetricPill icon={Wind} label="Wind Speed" value={wx.wind_speed_knots} unit="kt" color={wx.wind_speed_knots > 40 ? 'text-rose-400' : wx.wind_speed_knots > 25 ? 'text-amber-400' : 'text-slate-200'} />
                    <MetricPill icon={Compass} label="Wind Dir" value={wx.wind_direction} unit="" color="text-slate-200" />
                    <MetricPill icon={Droplets} label="Humidity" value={wx.humidity_pct} unit="%" color="text-blue-300" />
                    <MetricPill icon={Gauge} label="Pressure" value={wx.pressure_hpa} unit="hPa" color="text-slate-200" />
                    <MetricPill icon={Eye} label="Visibility" value={wx.visibility_km} unit="km" color={wx.visibility_km < 1 ? 'text-rose-400' : wx.visibility_km < 5 ? 'text-amber-400' : 'text-emerald-300'} />
                  </div>

                  {/* Outdoor Note */}
                  <div className={`text-xs font-mono px-3 py-2 rounded-lg border ${wx.outdoor_recommendation === 'UNSAFE' ? 'bg-rose-950/30 border-rose-500/30 text-rose-300' : wx.outdoor_recommendation === 'CAUTION' ? 'bg-amber-950/30 border-amber-500/30 text-amber-300' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'} mb-4`}>
                    {wx.outdoor_note}
                  </div>

                  {/* 7-Day Forecast */}
                  <div>
                    <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Activity size={11} />
                      7-Day DEMO Forecast
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-mono border-collapse">
                        <thead>
                          <tr className="text-[10px] text-slate-500 uppercase">
                            <th className="text-left py-1.5 pr-4">Day</th>
                            <th className="text-right pr-3">Min °C</th>
                            <th className="text-right pr-3">Max °C</th>
                            <th className="text-right pr-3">Wind kt</th>
                            <th className="text-left pr-4">Condition</th>
                            <th className="text-left">Severity</th>
                            <th className="text-left">Outdoor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wx.forecast?.map((day, i) => (
                            <tr key={i} className="border-t border-polar-800/60 hover:bg-polar-800/20">
                              <td className="py-2 pr-4 text-slate-300 font-semibold">{day.label}</td>
                              <td className="text-right pr-3 text-cyan-400">{day.temp_min}</td>
                              <td className="text-right pr-3 text-cyan-300">{day.temp_max}</td>
                              <td className={`text-right pr-3 ${day.wind_knots > 40 ? 'text-rose-400 font-bold' : day.wind_knots > 25 ? 'text-amber-400' : 'text-slate-300'}`}>
                                {day.wind_knots}
                              </td>
                              <td className="pr-4 text-slate-400">{day.condition}</td>
                              <td className="pr-3">
                                <span className="flex items-center gap-1.5">
                                  <ForecastSeverityDot severity={day.severity} />
                                  <span className={`${SEVERITY_CONFIG[day.severity]?.cls?.split(' ')[0] || 'text-slate-400'}`}>{day.severity}</span>
                                </span>
                              </td>
                              <td>
                                <span className={`text-[10px] font-bold ${
                                  day.outdoor_rec === 'SAFE' ? 'text-emerald-400' :
                                  day.outdoor_rec === 'CAUTION' ? 'text-amber-400' : 'text-rose-400'
                                }`}>
                                  {day.outdoor_rec}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Source note */}
                  <div className="mt-3 text-[10px] font-mono text-slate-600">
                    Source: {wx.source}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
