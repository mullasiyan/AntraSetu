import { db } from '../db/db.js';

export function evaluateTelemetryAlerts(station, telemetry) {
  const generatedAlerts = [];
  const activeAlerts = db.alerts.find({ station_id: station.id, status: 'active' });

  // 1. Extreme Temperature Rule
  if (telemetry.outdoor_temp_c <= -42.0) {
    const title = `Extreme Deep-Freeze Alert (${telemetry.outdoor_temp_c}°C)`;
    const existing = activeAlerts.find(a => a.category === 'TEMPERATURE' && a.title.includes('Deep-Freeze'));
    if (!existing) {
      const alert = db.alerts.create({
        station_id: station.id,
        station_code: station.code,
        category: 'TEMPERATURE',
        severity: 'CRITICAL',
        title,
        message: `Extreme low ambient temperature of ${telemetry.outdoor_temp_c}°C detected at ${station.name}. Life-support heating redundancy engaged.`
      });
      generatedAlerts.push(alert);
      db.activityLogs.create({
        action: 'RULE_TRIGGERED',
        station_code: station.code,
        user_name: 'AntarSetu Alert Engine',
        details: `Generated CRITICAL alert: ${title}`
      });
    }
  }

  // 2. Fuel Reserve Rule
  if (telemetry.fuel_level_pct <= 22.0) {
    const title = `Low Generator Fuel Reserve (${telemetry.fuel_level_pct.toFixed(1)}%)`;
    const existing = activeAlerts.find(a => a.category === 'FUEL');
    if (!existing) {
      const severity = telemetry.fuel_level_pct <= 15.0 ? 'CRITICAL' : 'HIGH';
      const alert = db.alerts.create({
        station_id: station.id,
        station_code: station.code,
        category: 'FUEL',
        severity,
        title,
        message: `Primary diesel fuel storage at ${station.name} is down to ${telemetry.fuel_level_pct.toFixed(1)}%. Immediate resupply scheduling required.`
      });
      generatedAlerts.push(alert);
    }
  }

  // 3. High Katabatic Wind Rule
  if (telemetry.wind_speed_knots >= 55.0) {
    const title = `Katabatic Wind Storm Warning (${telemetry.wind_speed_knots.toFixed(1)} kts)`;
    const existing = activeAlerts.find(a => a.title.includes('Katabatic'));
    if (!existing) {
      const alert = db.alerts.create({
        station_id: station.id,
        station_code: station.code,
        category: 'TEMPERATURE',
        severity: 'HIGH',
        title,
        message: `Severe katabatic wind velocity of ${telemetry.wind_speed_knots.toFixed(1)} kts recorded at ${station.name}. Outdoor research operations suspended.`
      });
      generatedAlerts.push(alert);
    }
  }

  // 4. Satellite Comms Latency Rule
  if (telemetry.satellite_latency_ms >= 1800) {
    const title = `Satellite Uplink High Latency (${telemetry.satellite_latency_ms} ms)`;
    const existing = activeAlerts.find(a => a.category === 'COMMS');
    if (!existing) {
      const alert = db.alerts.create({
        station_id: station.id,
        station_code: station.code,
        category: 'COMMS',
        severity: 'MEDIUM',
        title,
        message: `VSAT/Iridium satellite ping latency spiked to ${telemetry.satellite_latency_ms} ms. Data bandwidth throttled.`
      });
      generatedAlerts.push(alert);
    }
  }

  return generatedAlerts;
}

export function evaluateInventoryAlerts(item, station) {
  if (item.quantity <= item.min_threshold) {
    const existing = db.alerts.find({
      station_id: item.station_id,
      status: 'active'
    }).find(a => a.title.includes(item.name) || (a.message && a.message.includes(item.sku)));

    if (!existing) {
      const daysRemaining = item.daily_consumption_rate > 0 
        ? Math.floor(item.quantity / item.daily_consumption_rate)
        : 999;

      const severity = daysRemaining <= 14 ? 'CRITICAL' : 'HIGH';
      const alert = db.alerts.create({
        station_id: item.station_id,
        station_code: station ? station.code : 'UNKNOWN',
        category: 'INVENTORY',
        severity,
        title: `Low Stock Alert: ${item.name}`,
        message: `Current stock (${item.quantity} ${item.unit}) is below minimum safety threshold (${item.min_threshold} ${item.unit}). Runway: ~${daysRemaining} days.`
      });
      
      db.activityLogs.create({
        action: 'INVENTORY_ALERT',
        station_code: station ? station.code : 'HQ',
        user_name: 'AntarSetu Logistics System',
        details: `Auto-generated low-stock warning for ${item.name} (${item.quantity} ${item.unit} remaining).`
      });

      return alert;
    }
  }
  return null;
}
