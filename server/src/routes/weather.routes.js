import { Router } from 'express';
import { getWeather, getWeatherByStation } from '../controllers/weather.controller.js';

const router = Router();

router.get('/', getWeather);
router.get('/:id', getWeatherByStation);

export default router;
