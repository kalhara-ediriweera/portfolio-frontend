const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to fetch headers with authentication tokens automatically.
 */
const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('adminToken');
  const headers = {};
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Handle API responses and throw detailed errors when failing.
 */
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong with the API request');
  }
  return data;
};

export const api = {
  // Authentication
  auth: {
    login: async (username, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password }),
      });
      return handleResponse(response);
    },
    getProfile: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    updatePassword: async (currentPassword, newPassword) => {
      const response = await fetch(`${API_BASE_URL}/auth/update-password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return handleResponse(response);
    },
  },

  // Projects CRUD
  projects: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/projects`);
      return handleResponse(response);
    },
    getOne: async (id) => {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`);
      return handleResponse(response);
    },
    create: async (formData) => {
      // Since it can be a FormData object (for files), we pass it as body directly
      const isForm = formData instanceof FormData;
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: getHeaders(isForm),
        body: isForm ? formData : JSON.stringify(formData),
      });
      return handleResponse(response);
    },
    update: async (id, formData) => {
      const isForm = formData instanceof FormData;
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: getHeaders(isForm),
        body: isForm ? formData : JSON.stringify(formData),
      });
      return handleResponse(response);
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Services CRUD
  services: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/services`);
      return handleResponse(response);
    },
    create: async (serviceData) => {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(serviceData),
      });
      return handleResponse(response);
    },
    update: async (id, serviceData) => {
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(serviceData),
      });
      return handleResponse(response);
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Skills CRUD
  skills: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/skills`);
      return handleResponse(response);
    },
    create: async (skillData) => {
      const response = await fetch(`${API_BASE_URL}/skills`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(skillData),
      });
      return handleResponse(response);
    },
    update: async (id, skillData) => {
      const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(skillData),
      });
      return handleResponse(response);
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Experience CRUD
  experience: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/experience`);
      return handleResponse(response);
    },
    create: async (expData) => {
      const response = await fetch(`${API_BASE_URL}/experience`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(expData),
      });
      return handleResponse(response);
    },
    update: async (id, expData) => {
      const response = await fetch(`${API_BASE_URL}/experience/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(expData),
      });
      return handleResponse(response);
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/experience/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Inbox Messages
  messages: {
    send: async (msgData) => {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData),
      });
      return handleResponse(response);
    },
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },
};
export default api;
