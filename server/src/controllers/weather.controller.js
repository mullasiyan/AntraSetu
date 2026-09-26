import { db } from '../db/db.js';

export async function getWeather(req, res, next) {
  try {
    const { station_id } = req.query;
    let results = db.weather.find({ station_id });
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
}

export async function getWeatherByStation(req, res, next) {
  try {
    const { id } = req.params;
    const current = db.weather.getCurrentByStation(id);
    const forecast = db.weather.getForecast(id);
    if (!current) return res.status(404).json({ success: false, message: 'No weather data for this station' });
    res.json({ success: true, data: { current, forecast } });
  } catch (err) {
    next(err);
  }
}
