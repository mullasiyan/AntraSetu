const BASE_URL = '/api';

function buildQuery(params = {}) {
  return new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  ).toString();
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('antarsetu_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If token invalid and not already on login, trigger session expiry event
    if (!window.location.pathname.includes('/login')) {
      localStorage.removeItem('antarsetu_token');
      localStorage.removeItem('antarsetu_user');
      window.dispatchEvent(new Event('antarsetu_auth_change'));
    }
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Mission Control Network Error');
  }

  return data;
}

export const api = {
  auth: {
    login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => request('/auth/me'),
    getDemoAccounts: () => request('/auth/demo-accounts'),
  },

  stations: {
    getAll: () => request('/stations'),
    getById: (id) => request(`/stations/${id}`),
    getTelemetryHistory: (id, limit = 40) =>
      request(`/stations/${id}/telemetry?limit=${limit}`),
    update: (id, updates) =>
      request(`/stations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),
  },

  alerts: {
    getAll: (params = {}) => {
      const query = buildQuery(params);
      return request(`/alerts${query ? `?${query}` : ''}`);
    },
    getSummary: () => request('/alerts/summary'),
    acknowledge: (id) =>
      request(`/alerts/${id}/acknowledge`, { method: 'POST' }),
    resolve: (id, resolution_notes) =>
      request(`/alerts/${id}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ resolution_notes }),
      }),
    create: (data) =>
      request('/alerts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  inventory: {
    getAll: (params = {}) => {
      const query = buildQuery(params);
      return request(`/inventory${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/inventory/${id}`),
    updateStock: (id, payload) =>
      request(`/inventory/${id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    create: (item) =>
      request('/inventory', {
        method: 'POST',
        body: JSON.stringify(item),
      }),
    getTransactions: (itemId) => {
      const query = itemId ? `?item_id=${itemId}` : '';
      return request(`/inventory/transactions${query}`);
    },
  },

  incidents: {
    getAll: (params = {}) => {
      const query = buildQuery(params);
      return request(`/incidents${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/incidents/${id}`),
    create: (data) =>
      request('/incidents', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, updates) =>
      request(`/incidents/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),
  },

  maintenance: {
    getAll: (params = {}) => {
      const query = buildQuery(params);
      return request(`/maintenance${query ? `?${query}` : ''}`);
    },
    create: (data) =>
      request('/maintenance', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, updates) =>
      request(`/maintenance/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),
  },

  reports: {
    getSummary: () => request('/reports/summary'),
    getExportUrl: (type = 'summary') => `${BASE_URL}/reports/export/csv?type=${type}`,
  },

  activity: {
    getRecent: (limit = 20) => request(`/activity?limit=${limit}`),
  },

  personnel: {
    getAll: (params = {}) => {
      const query = buildQuery(params);
      return request(`/personnel${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/personnel/${id}`),
    getSummary: () => request('/personnel/summary'),
    update: (id, updates) =>
      request(`/personnel/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),
  },

  weather: {
    getAll: (params = {}) => {
      const query = buildQuery(params);
      return request(`/weather${query ? `?${query}` : ''}`);
    },
    getByStation: (stationId) => request(`/weather/${stationId}`),
  },

  comms: {
    getLogs: (params = {}) => {
      const query = buildQuery(params);
      return request(`/comms/logs${query ? `?${query}` : ''}`);
    },
    getWindows: (params = {}) => {
      const query = buildQuery(params);
      return request(`/comms/windows${query ? `?${query}` : ''}`);
    },
    getSummary: () => request('/comms/summary'),
  },
};

