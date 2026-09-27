import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDatabase } from './db/db.js';
import { startTelemetrySimulator } from './services/telemetrySimulator.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import stationsRoutes from './routes/stations.routes.js';
import alertsRoutes from './routes/alerts.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import incidentsRoutes from './routes/incidents.routes.js';
import maintenanceRoutes from './routes/maintenance.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import activityRoutes from './routes/activity.routes.js';
import personnelRoutes from './routes/personnel.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import commsRoutes from './routes/comms.routes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = new Set([
  'https://antrasetu.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]);

// Middleware
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.has(origin));
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/comms', commsRoutes);

// Central Error Handler
app.use(errorHandler);

// Initialize DB and start server
async function bootstrap() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required.');
    }

    await initDatabase();
    
    // Start Antarctic dynamic sensor simulation engine
    const simInterval = parseInt(process.env.TELEMETRY_INTERVAL_MS, 10) || 8000;
    startTelemetrySimulator(simInterval);

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`❄ AntarSetu Polar Mission Control Server running on port ${PORT}`);
      console.log(`❄ Base URL: http://localhost:${PORT}`);
      console.log(`❄ Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Fatal initialization error:', err);
    process.exit(1);
  }
}

bootstrap();
