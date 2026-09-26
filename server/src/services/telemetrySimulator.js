import { db } from '../db/db.js';
import { evaluateTelemetryAlerts } from './alertEngine.js';

let intervalHandle = null;

export function startTelemetrySimulator(intervalMs = 10000) {
  if (intervalHandle) clearInterval(intervalHandle);

  console.log(`📡 [AntarSetu Telemetry] Simulator running at ${intervalMs}ms cycles...`);

  intervalHandle = setInterval(() => {
    try {
      const stations = db.stations.find();

      stations.forEach(station => {
        const latest = db.telemetry.getLatestForStation(station.id);
        if (!latest) return;

        // Apply realistic polar micro-fluctuations
        const tempDelta = (Math.random() - 0.5) * 0.4;
        const windDelta = (Math.random() - 0.48) * 1.5;
        const fuelBurn = station.id === 'stn-dakshin-gangotri' ? 0 : 0.02; // Slow burn
        const genDelta = (Math.random() - 0.5) * 2.0;
        const pingJitter = Math.floor((Math.random() - 0.5) * 20);
        const solarDelta = (Math.random() - 0.5) * 1.2;
        const bandwidthDelta = (Math.random() - 0.5) * 0.2;
        const co2Delta = (Math.random() - 0.5) * 4;

        const newTelemetry = {
          station_id: station.id,
          outdoor_temp_c: Number((latest.outdoor_temp_c + tempDelta).toFixed(1)),
          indoor_temp_c: Number((latest.indoor_temp_c + (Math.random() - 0.5) * 0.1).toFixed(1)),
          wind_speed_knots: Math.max(5, Number((latest.wind_speed_knots + windDelta).toFixed(1))),
          wind_direction: latest.wind_direction,
          atmospheric_pressure_hpa: Number((latest.atmospheric_pressure_hpa + (Math.random() - 0.5) * 0.3).toFixed(1)),
          humidity_pct: Math.min(95, Math.max(20, Math.round(latest.humidity_pct + (Math.random() - 0.5)))),
          generator_load_kw: Math.max(0, Number((latest.generator_load_kw + genDelta).toFixed(1))),
          generator_capacity_pct: Math.max(0, Math.min(100, Number((latest.generator_capacity_pct + (genDelta * 0.4)).toFixed(1)))),
          fuel_level_pct: Math.max(5, Number((latest.fuel_level_pct - fuelBurn).toFixed(1))),
          fuel_pressure_psi: latest.fuel_pressure_psi,
          battery_reserve_pct: Math.max(10, Math.min(100, Number((latest.battery_reserve_pct + (Math.random() - 0.5) * 0.2).toFixed(1)))),
          solar_generation_kw: Math.max(0, Number((latest.solar_generation_kw + solarDelta).toFixed(1))),
          satellite_latency_ms: Math.max(250, latest.satellite_latency_ms + pingJitter),
          satellite_bandwidth_mbps: Math.max(0.05, Number((latest.satellite_bandwidth_mbps + bandwidthDelta).toFixed(2))),
          life_support_status: latest.life_support_status,
          air_quality_co2_ppm: Math.max(350, Math.min(1200, Math.round(latest.air_quality_co2_ppm + co2Delta))),
          freshwater_litres: latest.freshwater_litres
        };

        db.telemetry.create(newTelemetry);
        db.stations.update(station.id, { last_ping_at: new Date().toISOString() });

        // Run alert engine on new telemetry
        evaluateTelemetryAlerts(station, newTelemetry);
      });
    } catch (err) {
      console.error('Error during telemetry simulation cycle:', err);
    }
  }, intervalMs);
}

export function stopTelemetrySimulator() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
}
