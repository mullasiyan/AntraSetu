import { db } from '../db/db.js';

export async function getPersonnel(req, res, next) {
  try {
    const { station_id, role, health_status } = req.query;
    let results = db.personnel.find({ station_id, role, health_status });
    res.json({ success: true, data: results, count: results.length });
  } catch (err) {
    next(err);
  }
}

export async function getPersonnelById(req, res, next) {
  try {
    const person = db.personnel.findById(req.params.id);
    if (!person) return res.status(404).json({ success: false, message: 'Personnel record not found' });
    res.json({ success: true, data: person });
  } catch (err) {
    next(err);
  }
}

export async function getPersonnelSummary(req, res, next) {
  try {
    const all = db.personnel.find({});
    const summary = {};
    ['stn-bharati', 'stn-maitri', 'stn-dakshin-gangotri'].forEach(sid => {
      const stationPersonnel = all.filter(p => p.station_id === sid);
      summary[sid] = {
        total: stationPersonnel.length,
        fit: stationPersonnel.filter(p => p.health_status === 'FIT').length,
        monitoring: stationPersonnel.filter(p => p.health_status === 'REQUIRES_MONITORING').length,
        medical: stationPersonnel.filter(p => p.health_status === 'MEDICAL_ATTENTION').length,
        reachable: stationPersonnel.filter(p => p.comm_status === 'REACHABLE').length,
        unreachable: stationPersonnel.filter(p => p.comm_status === 'UNREACHABLE').length
      };
    });
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
}

export async function updatePersonnel(req, res, next) {
  try {
    const updated = db.personnel.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Personnel record not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}
