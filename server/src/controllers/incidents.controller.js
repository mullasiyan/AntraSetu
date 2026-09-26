import { db } from '../db/db.js';

export const getIncidents = async (req, res, next) => {
  try {
    const { station_id, priority, status } = req.query;
    const incidents = db.incidents.find({ station_id, priority, status });

    const stations = db.stations.find();
    const stationMap = Object.fromEntries(stations.map(s => [s.id, s]));

    const enriched = incidents.map(inc => ({
      ...inc,
      station_name: stationMap[inc.station_id]?.name || 'Unknown Station'
    }));

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    next(err);
  }
};

export const getIncidentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const incident = db.incidents.findById(id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found.' });
    }
    const station = db.stations.findById(incident.station_id);
    res.json({
      success: true,
      data: {
        ...incident,
        station_name: station ? station.name : 'Unknown Station'
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createIncident = async (req, res, next) => {
  try {
    const { title, description, station_id, priority, assigned_team, category } = req.body;
    if (!title || !description || !station_id) {
      return res.status(400).json({ success: false, message: 'title, description, and station_id are required.' });
    }

    const station = db.stations.findById(station_id);
    if (!station) {
      return res.status(400).json({ success: false, message: 'Invalid station selected.' });
    }

    const newIncident = db.incidents.create({
      title,
      description,
      station_id,
      station_code: station.code,
      priority: priority || 'P3_MEDIUM',
      category: category || 'GENERAL_OPERATIONS',
      status: 'REPORTED',
      reported_by_name: req.user ? req.user.full_name : 'Station Operator',
      assigned_team: assigned_team || 'Station Engineering Response Team'
    });

    db.activityLogs.create({
      action: 'INCIDENT_CREATED',
      station_code: station.code,
      user_name: req.user ? req.user.full_name : 'Station Operator',
      details: `Logged ${newIncident.priority} incident: ${title}`
    });

    res.status(201).json({ success: true, data: newIncident, message: 'Incident logged successfully.' });
  } catch (err) {
    next(err);
  }
};

export const updateIncident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority, assigned_team, resolution_summary } = req.body;

    const existing = db.incidents.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Incident not found.' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (assigned_team) updates.assigned_team = assigned_team;
    if (resolution_summary) updates.resolution_summary = resolution_summary;

    const updated = db.incidents.update(id, updates);

    db.activityLogs.create({
      action: 'INCIDENT_UPDATED',
      station_code: updated.station_code,
      user_name: req.user ? req.user.full_name : 'Station Operator',
      details: `Updated incident '${updated.title}' to status ${updated.status}.`
    });

    res.json({ success: true, data: updated, message: 'Incident updated successfully.' });
  } catch (err) {
    next(err);
  }
};
