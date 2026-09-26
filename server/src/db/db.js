import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';
import {
  defaultUsers,
  defaultStations,
  defaultTelemetry,
  defaultInventory,
  defaultAlerts,
  defaultIncidents,
  defaultMaintenanceTasks,
  defaultActivityLogs,
  defaultPersonnel,
  defaultWeather,
  defaultCommWindows,
  defaultCommLogs
} from './seedData.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'antarsetu_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let pgPool = null;
let isPostgresActive = false;

// Embedded JSON database store
let memoryStore = {
  users: [...defaultUsers],
  stations: [...defaultStations],
  telemetry: [...defaultTelemetry],
  inventory: [...defaultInventory],
  inventoryTransactions: [],
  alerts: [...defaultAlerts],
  incidents: [...defaultIncidents],
  maintenanceTasks: [...defaultMaintenanceTasks],
  activityLogs: [...defaultActivityLogs],
  personnel: [...defaultPersonnel],
  weather: [...defaultWeather],
  commWindows: [...defaultCommWindows],
  commLogs: [...defaultCommLogs]
};

// Initialize file-backed store if it exists
function loadFileStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      const hasCompleteDemoAlertSet = Array.isArray(parsed.alerts) && defaultAlerts.every(
        (defaultAlert) => parsed.alerts.some((alert) => alert.id === defaultAlert.id)
      );
      const hasCompleteDemoIncidentSet = Array.isArray(parsed.incidents) && defaultIncidents.every(
        (defaultIncident) => parsed.incidents.some((incident) => incident.id === defaultIncident.id)
      );
      const hasCompleteDemoMaintenanceSet = Array.isArray(parsed.maintenanceTasks) && defaultMaintenanceTasks.every(
        (defaultTask) => parsed.maintenanceTasks.some((task) => task.id === defaultTask.id)
      );
      // If store is from previous version with fewer demo items, upgrade to the rich seed dataset
      if (!parsed.inventory || parsed.inventory.length < defaultInventory.length || !hasCompleteDemoAlertSet || !hasCompleteDemoIncidentSet || !hasCompleteDemoMaintenanceSet || !parsed.personnel || parsed.personnel.length < defaultPersonnel.length) {
        console.log('✓ [AntarSetu Storage] Upgrading local database with enhanced DEMO Antarctic operational records.');
        resetDemoStore();
        return;
      }

      memoryStore = {
        users: parsed.users || defaultUsers,
        stations: parsed.stations || defaultStations,
        telemetry: parsed.telemetry || defaultTelemetry,
        inventory: parsed.inventory || defaultInventory,
        inventoryTransactions: parsed.inventoryTransactions || [],
        alerts: parsed.alerts || defaultAlerts,
        incidents: parsed.incidents || defaultIncidents,
        maintenanceTasks: parsed.maintenanceTasks || defaultMaintenanceTasks,
        activityLogs: parsed.activityLogs || defaultActivityLogs,
        personnel: parsed.personnel || defaultPersonnel,
        weather: parsed.weather || defaultWeather,
        commWindows: parsed.commWindows || defaultCommWindows,
        commLogs: parsed.commLogs || defaultCommLogs
      };
      console.log('✓ [AntarSetu Storage] Loaded persistent records from local database store.');
    } else {
      resetDemoStore();
      console.log('✓ [AntarSetu Storage] Initialized fresh Indian Antarctic mission records in local store.');
    }
  } catch (err) {
    console.error('Error loading data file, falling back to default seed:', err);
    resetDemoStore();
  }
}

export function resetDemoStore() {
  memoryStore = {
    users: [...defaultUsers],
    stations: [...defaultStations],
    telemetry: [...defaultTelemetry],
    inventory: [...defaultInventory],
    inventoryTransactions: [],
    alerts: [...defaultAlerts],
    incidents: [...defaultIncidents],
    maintenanceTasks: [...defaultMaintenanceTasks],
    activityLogs: [...defaultActivityLogs],
    personnel: [...defaultPersonnel],
    weather: [...defaultWeather],
    commWindows: [...defaultCommWindows],
    commLogs: [...defaultCommLogs]
  };
  saveFileStore();
}

export function saveFileStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local store:', err);
  }
}

// Attempt PostgreSQL connection if DATABASE_URL is configured
export async function initDatabase() {
  loadFileStore();

  if (process.env.DATABASE_URL) {
    try {
      pgPool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 3000
      });
      const client = await pgPool.connect();
      await client.query('SELECT NOW()');
      client.release();
      isPostgresActive = true;
      console.log('✓ [AntarSetu Database] Successfully connected to PostgreSQL database cluster.');
      // Create tables in PostgreSQL if connected
      await createPostgresTables();
    } catch (err) {
      console.warn('! [AntarSetu Database] PostgreSQL connection failed or unavailable. Falling back seamlessly to local persistent store.');
      isPostgresActive = false;
    }
  } else {
    console.log('ℹ [AntarSetu Database] Using resilient embedded persistent storage (server/data/antarsetu_store.json).');
  }
}

async function createPostgresTables() {
  if (!isPostgresActive || !pgPool) return;
  try {
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS stations (
        id VARCHAR(64) PRIMARY KEY,
        code VARCHAR(32) UNIQUE NOT NULL,
        name VARCHAR(128) NOT NULL,
        established_year INT,
        latitude NUMERIC,
        longitude NUMERIC,
        location_description TEXT,
        status VARCHAR(32),
        personnel_count INT,
        max_capacity INT,
        comms_status VARCHAR(32),
        comms_type TEXT,
        power_source TEXT,
        habitat_description TEXT,
        last_ping_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ [AntarSetu Database] Verified PostgreSQL table schema.');
  } catch (err) {
    console.error('Error creating PostgreSQL tables:', err.message);
  }
}

export const db = {
  isPostgres: () => isPostgresActive,
  getStore: () => memoryStore,
  save: () => saveFileStore(),

  // Generic query helper
  query: async (text, params) => {
    if (isPostgresActive && pgPool) {
      return pgPool.query(text, params);
    }
    // Return empty result when in fallback mode
    return { rows: [] };
  },

  // STATIONS
  stations: {
    find: () => memoryStore.stations,
    findById: (id) => memoryStore.stations.find(s => s.id === id || s.code.toLowerCase() === id.toLowerCase()),
    update: (id, updates) => {
      const idx = memoryStore.stations.findIndex(s => s.id === id || s.code === id);
      if (idx !== -1) {
        memoryStore.stations[idx] = { ...memoryStore.stations[idx], ...updates, updated_at: new Date().toISOString() };
        saveFileStore();
        return memoryStore.stations[idx];
      }
      return null;
    }
  },

  // TELEMETRY
  telemetry: {
    find: (filter = {}) => {
      let results = [...memoryStore.telemetry];
      if (filter.station_id) {
        results = results.filter(t => t.station_id === filter.station_id);
      }
      return results;
    },
    getLatestForStation: (stationId) => {
      const matches = memoryStore.telemetry.filter(t => t.station_id === stationId);
      return matches.length > 0 ? matches[matches.length - 1] : null;
    },
    create: (record) => {
      const entry = {
        id: `tel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        recorded_at: new Date().toISOString(),
        ...record
      };
      memoryStore.telemetry.push(entry);
      // Keep only last 200 telemetry records to avoid unbounded growth
      if (memoryStore.telemetry.length > 200) {
        memoryStore.telemetry.splice(0, memoryStore.telemetry.length - 200);
      }
      saveFileStore();
      return entry;
    }
  },

  // INVENTORY
  inventory: {
    find: (filter = {}) => {
      let results = [...memoryStore.inventory];
      if (filter.station_id) {
        results = results.filter(i => i.station_id === filter.station_id);
      }
      if (filter.category) {
        results = results.filter(i => i.category === filter.category);
      }
      return results;
    },
    findById: (id) => memoryStore.inventory.find(i => i.id === id),
    create: (item) => {
      const entry = {
        id: `inv-${Date.now()}`,
        last_updated: new Date().toISOString(),
        ...item
      };
      memoryStore.inventory.push(entry);
      saveFileStore();
      return entry;
    },
    update: (id, updates) => {
      const idx = memoryStore.inventory.findIndex(i => i.id === id);
      if (idx !== -1) {
        memoryStore.inventory[idx] = { ...memoryStore.inventory[idx], ...updates, last_updated: new Date().toISOString() };
        saveFileStore();
        return memoryStore.inventory[idx];
      }
      return null;
    },
    addTransaction: (tx) => {
      const entry = {
        id: `tx-${Date.now()}`,
        recorded_at: new Date().toISOString(),
        ...tx
      };
      memoryStore.inventoryTransactions.unshift(entry);
      saveFileStore();
      return entry;
    },
    getTransactions: (itemId) => {
      if (itemId) {
        return memoryStore.inventoryTransactions.filter(t => t.item_id === itemId);
      }
      return memoryStore.inventoryTransactions;
    }
  },

  // ALERTS
  alerts: {
    find: (filter = {}) => {
      let results = [...memoryStore.alerts];
      if (filter.station_id) {
        results = results.filter(a => a.station_id === filter.station_id);
      }
      if (filter.severity) {
        results = results.filter(a => a.severity.toUpperCase() === filter.severity.toUpperCase());
      }
      if (filter.status === 'active') {
        results = results.filter(a => !a.is_resolved);
      } else if (filter.status === 'resolved') {
        results = results.filter(a => a.is_resolved);
      }
      return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    findById: (id) => memoryStore.alerts.find(a => a.id === id),
    create: (alertData) => {
      const entry = {
        id: `alt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        is_acknowledged: false,
        acknowledged_by_user_id: null,
        acknowledged_at: null,
        is_resolved: false,
        created_at: new Date().toISOString(),
        ...alertData
      };
      memoryStore.alerts.unshift(entry);
      saveFileStore();
      return entry;
    },
    acknowledge: (id, userId) => {
      const idx = memoryStore.alerts.findIndex(a => a.id === id);
      if (idx !== -1) {
        memoryStore.alerts[idx].is_acknowledged = true;
        memoryStore.alerts[idx].acknowledged_by_user_id = userId || 'usr-001';
        memoryStore.alerts[idx].acknowledged_at = new Date().toISOString();
        saveFileStore();
        return memoryStore.alerts[idx];
      }
      return null;
    },
    resolve: (id, resolutionNotes) => {
      const idx = memoryStore.alerts.findIndex(a => a.id === id);
      if (idx !== -1) {
        memoryStore.alerts[idx].is_resolved = true;
        memoryStore.alerts[idx].resolved_at = new Date().toISOString();
        if (resolutionNotes) {
          memoryStore.alerts[idx].resolution_notes = resolutionNotes;
        }
        saveFileStore();
        return memoryStore.alerts[idx];
      }
      return null;
    }
  },

  // INCIDENTS
  incidents: {
    find: (filter = {}) => {
      let results = [...memoryStore.incidents];
      if (filter.station_id) {
        results = results.filter(i => i.station_id === filter.station_id);
      }
      if (filter.priority) {
        results = results.filter(i => i.priority === filter.priority);
      }
      if (filter.status) {
        results = results.filter(i => i.status === filter.status);
      }
      return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    findById: (id) => memoryStore.incidents.find(i => i.id === id),
    create: (data) => {
      const entry = {
        id: `inc-${Date.now()}`,
        status: 'REPORTED',
        created_at: new Date().toISOString(),
        resolved_at: null,
        ...data
      };
      memoryStore.incidents.unshift(entry);
      saveFileStore();
      return entry;
    },
    update: (id, updates) => {
      const idx = memoryStore.incidents.findIndex(i => i.id === id);
      if (idx !== -1) {
        if (updates.status === 'RESOLVED' && !memoryStore.incidents[idx].resolved_at) {
          updates.resolved_at = new Date().toISOString();
        }
        memoryStore.incidents[idx] = { ...memoryStore.incidents[idx], ...updates };
        saveFileStore();
        return memoryStore.incidents[idx];
      }
      return null;
    }
  },

  // MAINTENANCE
  maintenance: {
    find: (filter = {}) => {
      let results = [...memoryStore.maintenanceTasks];
      if (filter.station_id) {
        results = results.filter(m => m.station_id === filter.station_id);
      }
      if (filter.status) {
        results = results.filter(m => m.status === filter.status);
      }
      return results.map(task => {
        const isOverdue = task.status !== 'RESOLVED' && new Date(task.due_date) < new Date();
        return { ...task, is_overdue: isOverdue };
      });
    },
    findById: (id) => {
      const task = memoryStore.maintenanceTasks.find(m => m.id === id);
      if (!task) return null;
      const isOverdue = task.status !== 'RESOLVED' && new Date(task.due_date) < new Date();
      return { ...task, is_overdue: isOverdue };
    },
    create: (data) => {
      const entry = {
        id: `mnt-${Date.now()}`,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        completed_at: null,
        ...data
      };
      memoryStore.maintenanceTasks.unshift(entry);
      saveFileStore();
      return entry;
    },
    update: (id, updates) => {
      const idx = memoryStore.maintenanceTasks.findIndex(m => m.id === id);
      if (idx !== -1) {
        if (updates.status === 'RESOLVED' && !memoryStore.maintenanceTasks[idx].completed_at) {
          updates.completed_at = new Date().toISOString();
        }
        memoryStore.maintenanceTasks[idx] = { ...memoryStore.maintenanceTasks[idx], ...updates };
        saveFileStore();
        const isOverdue = memoryStore.maintenanceTasks[idx].status !== 'RESOLVED' && new Date(memoryStore.maintenanceTasks[idx].due_date) < new Date();
        return { ...memoryStore.maintenanceTasks[idx], is_overdue: isOverdue };
      }
      return null;
    }
  },

  // USERS
  users: {
    findByEmail: (email) => memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
    findById: (id) => memoryStore.users.find(u => u.id === id),
    all: () => memoryStore.users.map(({ password_hash, ...u }) => u)
  },

  // ACTIVITY LOGS
  activityLogs: {
    find: (limit = 20) => {
      return [...memoryStore.activityLogs]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    },
    create: (log) => {
      const entry = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...log
      };
      memoryStore.activityLogs.unshift(entry);
      if (memoryStore.activityLogs.length > 100) {
        memoryStore.activityLogs.pop();
      }
      saveFileStore();
      return entry;
    }
  },

  // PERSONNEL
  personnel: {
    find: (filter = {}) => {
      let results = [...memoryStore.personnel];
      if (filter.station_id) results = results.filter(p => p.station_id === filter.station_id);
      if (filter.role) results = results.filter(p => p.role === filter.role.toUpperCase());
      if (filter.health_status) results = results.filter(p => p.health_status === filter.health_status.toUpperCase());
      return results;
    },
    findById: (id) => memoryStore.personnel.find(p => p.id === id),
    update: (id, updates) => {
      const idx = memoryStore.personnel.findIndex(p => p.id === id);
      if (idx !== -1) {
        memoryStore.personnel[idx] = { ...memoryStore.personnel[idx], ...updates };
        saveFileStore();
        return memoryStore.personnel[idx];
      }
      return null;
    }
  },

  // WEATHER
  weather: {
    find: (filter = {}) => {
      let results = [...memoryStore.weather];
      if (filter.station_id) results = results.filter(w => w.station_id === filter.station_id);
      return results;
    },
    getCurrentByStation: (stationId) => {
      return memoryStore.weather.find(w => w.station_id === stationId) || null;
    },
    getForecast: (stationId) => {
      const wx = memoryStore.weather.find(w => w.station_id === stationId);
      return wx ? wx.forecast : [];
    }
  },

  // COMMUNICATIONS
  comms: {
    findLogs: (filter = {}) => {
      let results = [...memoryStore.commLogs];
      if (filter.station_id) results = results.filter(l => l.station_id === filter.station_id);
      if (filter.type) results = results.filter(l => l.type === filter.type.toUpperCase());
      if (filter.status) results = results.filter(l => l.status === filter.status.toUpperCase());
      return results.sort((a, b) => new Date(b.scheduled_utc) - new Date(a.scheduled_utc));
    },
    findWindows: (filter = {}) => {
      let results = [...memoryStore.commWindows];
      if (filter.station_id) results = results.filter(w => w.station_id === filter.station_id);
      return results.sort((a, b) => new Date(a.scheduled_utc) - new Date(b.scheduled_utc));
    }
  }
};

