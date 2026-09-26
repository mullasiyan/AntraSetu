import { db } from '../db/db.js';

export const getAllStations = async (req, res, next) => {
  try {
    const stations = db.stations.find();
    
    // Enrich with latest telemetry and alert stats
    const enriched = stations.map(station => {
      const latestTelemetry = db.telemetry.getLatestForStation(station.id);
      const activeAlerts = db.alerts.find({ station_id: station.id, status: 'active' });
      const criticalCount = activeAlerts.filter(a => a.severity === 'CRITICAL').length;
      const highCount = activeAlerts.filter(a => a.severity === 'HIGH').length;
      const inventory = db.inventory.find({ station_id: station.id });
      
      // Calculate overall operational status based on alerts and telemetry
      let operationalStatus = station.status;
      if (criticalCount > 0) {
        operationalStatus = 'CRITICAL';
      } else if (highCount > 0) {
        operationalStatus = 'WARNING';
      }

      return {
        ...station,
        operational_status: operationalStatus,
        telemetry: latestTelemetry,
        active_alerts_count: activeAlerts.length,
        critical_alerts_count: criticalCount,
        high_alerts_count: highCount,
        inventory_items_count: inventory.length
      };
    });

    res.json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
};

export const getStationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const station = db.stations.findById(id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Antarctic research station not found.' });
    }

    const latestTelemetry = db.telemetry.getLatestForStation(station.id);
    const telemetryHistory = db.telemetry.find({ station_id: station.id }).slice(-30);
    const activeAlerts = db.alerts.find({ station_id: station.id, status: 'active' });
    const incidents = db.incidents.find({ station_id: station.id });
    const maintenanceTasks = db.maintenance.find({ station_id: station.id });
    const inventory = db.inventory.find({ station_id: station.id }).map(item => {
      const daysRemaining = item.daily_consumption_rate > 0 
        ? Math.floor(item.quantity / item.daily_consumption_rate)
        : 999;
      return {
        ...item,
        days_remaining: daysRemaining,
        stock_status: item.quantity <= item.min_threshold ? 'CRITICAL' : daysRemaining <= 30 ? 'LOW' : 'OPTIMAL'
      };
    });

    res.json({
      success: true,
      data: {
        station,
        telemetry: latestTelemetry,
        telemetry_history: telemetryHistory,
        alerts: activeAlerts,
        incidents,
        maintenance_tasks: maintenanceTasks,
        inventory
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getStationTelemetryHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const station = db.stations.findById(id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Station not found.' });
    }

    const limit = parseInt(req.query.limit, 10) || 50;
    const history = db.telemetry.find({ station_id: station.id }).slice(-limit);

    res.json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

export const updateStation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = db.stations.update(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Station not found.' });
    }

    db.activityLogs.create({
      action: 'STATION_UPDATED',
      station_code: updated.code,
      user_name: req.user ? req.user.full_name : 'Operator',
      details: `Updated station status parameters for ${updated.name}.`
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
