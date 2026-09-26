import { db } from '../db/db.js';

export const getMaintenanceTasks = async (req, res, next) => {
  try {
    const { station_id, status } = req.query;
    const tasks = db.maintenance.find({ station_id, status });

    const stations = db.stations.find();
    const stationMap = Object.fromEntries(stations.map(s => [s.id, s]));

    const enriched = tasks.map(task => ({
      ...task,
      station_name: stationMap[task.station_id]?.name || 'Unknown Station'
    }));

    // Sort overdue and critical tasks first
    enriched.sort((a, b) => {
      if (a.is_overdue && !b.is_overdue) return -1;
      if (!a.is_overdue && b.is_overdue) return 1;
      return new Date(a.due_date) - new Date(b.due_date);
    });

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    next(err);
  }
};

export const createMaintenanceTask = async (req, res, next) => {
  try {
    const { title, description, station_id, system_type, priority, due_date, assigned_person } = req.body;
    if (!title || !station_id || !due_date) {
      return res.status(400).json({ success: false, message: 'title, station_id, and due_date are required.' });
    }

    const station = db.stations.findById(station_id);
    if (!station) {
      return res.status(400).json({ success: false, message: 'Invalid station specified.' });
    }

    const newTask = db.maintenance.create({
      title,
      description: description || '',
      station_id,
      station_code: station.code,
      system_type: system_type || 'GENERAL',
      priority: priority || 'MEDIUM',
      due_date,
      assigned_person: assigned_person || 'Unassigned Crew'
    });

    db.activityLogs.create({
      action: 'MAINTENANCE_SCHEDULED',
      station_code: station.code,
      user_name: req.user ? req.user.full_name : 'Chief Engineer',
      details: `Scheduled task: ${title} (Due: ${due_date})`
    });

    res.status(201).json({ success: true, data: newTask, message: 'Maintenance task scheduled.' });
  } catch (err) {
    next(err);
  }
};

export const updateMaintenanceTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, assigned_person, notes } = req.body;

    const existing = db.maintenance.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Maintenance task not found.' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (assigned_person) updates.assigned_person = assigned_person;
    if (notes) updates.notes = notes;

    const updated = db.maintenance.update(id, updates);

    db.activityLogs.create({
      action: 'MAINTENANCE_STATUS_UPDATED',
      station_code: updated.station_code,
      user_name: req.user ? req.user.full_name : 'Station Operator',
      details: `Updated task '${updated.title}' to ${updated.status}.`
    });

    res.json({ success: true, data: updated, message: 'Task updated successfully.' });
  } catch (err) {
    next(err);
  }
};
