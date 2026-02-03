import api from './api';

export const aiService = {
  chat: async ({ message, context } = {}) => {
    const response = await api.post('/ai/chat', { message, context });
    return response.data;
  },

  summarizeFile: async (fileId, { force = false } = {}) => {
    const response = await api.post(`/ai/summarize/${fileId}`, { force });
    return response.data;
  },

  autoTagFile: async (fileId, { force = false } = {}) => {
    const response = await api.post(`/ai/auto-tag/${fileId}`, { force });
    return response.data;
  },

  smartSearch: async ({ query, context } = {}) => {
    const response = await api.post('/ai/search', { query, context });
    return response.data;
  },

  getInsights: async () => {
    const response = await api.get('/ai/insights');
    return response.data;
  },
};

export default aiService;

