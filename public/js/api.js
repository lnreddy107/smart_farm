// API Client Module for Smart Farming Portal
const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${url}:`, err);
    throw err;
  }
}

export const API = {
  auth: {
    getCurrent: () => request('/auth/current'),
    getUsers: () => request('/auth/users'),
    switchRole: (role, userId) => request('/auth/switch', { method: 'POST', body: { role, userId } })
  },
  farm: {
    getProfile: (farmerId) => request(`/farm${farmerId ? `?farmerId=${farmerId}` : ''}`),
    getMetrics: (farmerId) => request(`/farm/metrics${farmerId ? `?farmerId=${farmerId}` : ''}`),
    updateProfile: (id, updates) => request(`/farm/${id}`, { method: 'PUT', body: updates })
  },
  crops: {
    getAll: (farmerId) => request(`/crops${farmerId ? `?farmerId=${farmerId}` : ''}`),
    create: (cropData) => request('/crops', { method: 'POST', body: cropData }),
    update: (id, updates) => request(`/crops/${id}`, { method: 'PUT', body: updates }),
    delete: (id) => request(`/crops/${id}`, { method: 'DELETE' })
  },
  products: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/products${q ? `?${q}` : ''}`);
    },
    getById: (id) => request(`/products/${id}`),
    create: (data) => request('/products', { method: 'POST', body: data }),
    update: (id, updates) => request(`/products/${id}`, { method: 'PUT', body: updates }),
    delete: (id) => request(`/products/${id}`, { method: 'DELETE' })
  },
  expenses: {
    getAll: (farmerId) => request(`/expenses${farmerId ? `?farmerId=${farmerId}` : ''}`),
    create: (data) => request('/expenses', { method: 'POST', body: data }),
    delete: (id) => request(`/expenses/${id}`, { method: 'DELETE' })
  },
  orders: {
    getAll: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/orders${q ? `?${q}` : ''}`);
    },
    create: (orderData) => request('/orders', { method: 'POST', body: orderData }),
    updateStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: { status } })
  },
  reviews: {
    getAll: (productId) => request(`/reviews${productId ? `?productId=${productId}` : ''}`),
    create: (data) => request('/reviews', { method: 'POST', body: data })
  },
  admin: {
    getMetrics: () => request('/admin/metrics'),
    getUsers: (role) => request(`/admin/users${role ? `?role=${role}` : ''}`),
    updateUser: (id, data) => request(`/admin/users/${id}`, { method: 'PUT', body: data }),
    getReports: () => request('/admin/reports'),
    resetDb: () => request('/admin/reset-db', { method: 'POST' })
  }
};
