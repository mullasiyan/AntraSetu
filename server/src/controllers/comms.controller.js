import { db } from '../db/db.js';

export async function getCommLogs(req, res, next) {
  try {
    const { station_id, type, status } = req.query;
    const results = db.comms.findLogs({ station_id, type, status });
    res.json({ success: true, data: results, count: results.length });
  } catch (err) {
    next(err);
  }
}

export async function getCommWindows(req, res, next) {
  try {
    const { station_id } = req.query;
    const results = db.comms.findWindows({ station_id });
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
}

export async function getCommSummary(req, res, next) {
  try {
    const logs = db.comms.findLogs({});
    const windows = db.comms.findWindows({});
    const missed = logs.filter(l => l.status === 'MISSED');
    const degraded = logs.filter(l => l.status === 'DEGRADED');
    res.json({
      success: true,
      data: {
        total_logs: logs.length,
        missed_windows: missed.length,
        degraded_connections: degraded.length,
        completed: logs.filter(l => l.status === 'COMPLETED').length,
        upcoming_windows: windows.filter(w => new Date(w.scheduled_utc) > new Date()).length
      }
    });
  } catch (err) {
    next(err);
  }
}
