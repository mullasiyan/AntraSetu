import { db } from '../db/db.js';

export const getAlerts = async (req, res, next) => {
  try {
    const { station_id, severity, status, category } = req.query;
    let alerts = db.alerts.find({ station_id, severity, status });

    if (category) {
      alerts = alerts.filter(a => a.category.toUpperCase() === category.toUpperCase());
    }

    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    next(err);
  }
};

export const acknowledgeAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : 'usr-001';
    const updated = db.alerts.acknowledge(id, userId);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Alert not found.' });
    }

    db.activityLogs.create({
      action: 'ALERT_ACKNOWLEDGED',
      station_code: updated.station_code,
      user_name: req.user ? req.user.full_name : 'Station Operator',
      details: `Acknowledged ${updated.severity} alert: ${updated.title}`
    });

    res.json({ success: true, data: updated, message: 'Alert acknowledged.' });
  } catch (err) {
    next(err);
  }
};

export const resolveAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolution_notes } = req.body;
    const updated = db.alerts.resolve(id, resolution_notes);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Alert not found.' });
    }

    db.activityLogs.create({
      action: 'ALERT_RESOLVED',
      station_code: updated.station_code,
      user_name: req.user ? req.user.full_name : 'Station Operator',
      details: `Resolved alert: ${updated.title}. Notes: ${resolution_notes || 'Standard protocol applied'}`
    });

    res.json({ success: true, data: updated, message: 'Alert resolved.' });
  } catch (err) {
    next(err);
  }
};

export const createAlert = async (req, res, next) => {
  try {
    const { station_id, category, severity, title, message } = req.body;
    if (!station_id || !title || !severity) {
      return res.status(400).json({ success: false, message: 'station_id, title, and severity are required.' });
    }

    const station = db.stations.findById(station_id);
    const alert = db.alerts.create({
      station_id,
      station_code: station ? station.code : 'UNKNOWN',
      category: category || 'MANUAL',
      severity,
      title,
      message: message || ''
    });

    db.activityLogs.create({
      action: 'ALERT_MANUAL_TRIGGER',
      station_code: station ? station.code : 'UNKNOWN',
      user_name: req.user ? req.user.full_name : 'Operator',
      details: `Manually triggered ${severity} alert: ${title}`
    });

    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    next(err);
  }
};

export const getAlertSummary = async (req, res, next) => {
  try {
    const activeAlerts = db.alerts.find({ status: 'active' });
    const summary = {
      total_active: activeAlerts.length,
      critical: activeAlerts.filter(a => a.severity === 'CRITICAL').length,
      high: activeAlerts.filter(a => a.severity === 'HIGH').length,
      medium: activeAlerts.filter(a => a.severity === 'MEDIUM').length,
      low: activeAlerts.filter(a => a.severity === 'LOW').length,
      by_category: {
        TEMPERATURE: activeAlerts.filter(a => a.category === 'TEMPERATURE').length,
        FUEL: activeAlerts.filter(a => a.category === 'FUEL').length,
        POWER: activeAlerts.filter(a => a.category === 'POWER').length,
        COMMS: activeAlerts.filter(a => a.category === 'COMMS').length,
        INVENTORY: activeAlerts.filter(a => a.category === 'INVENTORY').length,
        MAINTENANCE: activeAlerts.filter(a => a.category === 'MAINTENANCE').length
      }
    };

    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
};
