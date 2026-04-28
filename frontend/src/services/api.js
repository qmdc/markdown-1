import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const noteApi = {
  getAllNotes: () => api.get('/notes'),
  searchNotes: (keyword) => api.get(`/notes/search?keyword=${encodeURIComponent(keyword)}`),
  getNoteById: (id) => api.get(`/notes/${id}`),
  createNote: (note) => api.post('/notes', note),
  updateNote: (id, note) => api.put(`/notes/${id}`, note),
  deleteNote: (id) => api.delete(`/notes/${id}`),
};

export const exportApi = {
  exportToHtml: (title, content) => api.post('/export/html', { title, content }, { responseType: 'blob' }),
  exportToPdf: (title, content) => api.post('/export/pdf', { title, content }, { responseType: 'blob' }),
  previewHtml: (title, content) => api.post('/export/preview', { title, content }),
};

export default api;
