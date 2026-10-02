const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = formatApiError(
        errorData.detail || `HTTP Error ${response.status}: ${response.statusText}`
      );
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

function formatApiError(detail) {
  if (typeof detail === 'string') return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((error) => {
        const location = Array.isArray(error?.loc) ? error.loc.join('.') : 'request';
        return `${location}: ${error?.msg || 'Invalid value'}`;
      })
      .join('; ');
  }

  if (detail && typeof detail === 'object') {
    return detail.message || detail.msg || JSON.stringify(detail);
  }

  return String(detail);
}

export const api = {
  // System Health & Reset
  getHealth: () => fetchJson('/health'),
  resetSystem: () => fetchJson('/system/reset', { method: 'POST' }),

  // Missions
  getMissions: () => fetchJson('/api/v1/missions'),
  getMission: (id) => fetchJson(`/api/v1/missions/${id}`),
  createMission: (data) => fetchJson('/api/v1/missions', { method: 'POST', body: JSON.stringify(data) }),
  updateMission: (id, data) => fetchJson(`/api/v1/missions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Cargo
  getCargoList: () => fetchJson('/api/v1/cargo'),
  getCargo: (id) => fetchJson(`/api/v1/cargo/${id}`),
  createCargo: (data) => fetchJson('/api/v1/cargo', { method: 'POST', body: JSON.stringify(data) }),
  updateCargo: (id, data) => fetchJson(`/api/v1/cargo/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Disruptions & Impact Analysis
  simulateDisruption: (disruptionData) =>
    fetchJson('/api/v1/disruptions', { method: 'POST', body: JSON.stringify(disruptionData) }),

  // Synchronization
  pushSyncOperations: (syncPayload) =>
    fetchJson('/api/v1/sync/push', { method: 'POST', body: JSON.stringify(syncPayload) }),
  pullAuthoritativeState: () => fetchJson('/api/v1/sync/pull'),
};
