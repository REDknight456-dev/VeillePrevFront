import axios from 'axios'

const API_BASE_URL = 'http://localhost:9090/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Juridical Terms API
export const juridicalTermsAPI = {
  getAll: () => apiClient.get('/juridical-terms'),
  getById: (id) => apiClient.get(`/juridical-terms/${id}`),
  create: (term) => apiClient.post('/juridical-terms', term),
  update: (id, term) => apiClient.put(`/juridical-terms/${id}`, term),
  delete: (id) => apiClient.delete(`/juridical-terms/${id}`)
}

// Laws API
export const lawsAPI = {
  getAll: () => apiClient.get('/laws'),
  getById: (id) => apiClient.get(`/laws/${id}`),
  create: (law) => apiClient.post('/laws', law),
  update: (id, law) => apiClient.put(`/laws/${id}`, law),
  delete: (id) => apiClient.delete(`/laws/${id}`)
}

export default apiClient