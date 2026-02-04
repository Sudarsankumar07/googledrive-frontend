import api from './api';

export const compressionService = {
  upload: async ({ file, parentId = null, format = 'zip', level = 6 } = {}, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);
    formData.append('level', String(level));
    if (parentId) formData.append('parentId', parentId);

    const response = await api.post('/compression/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (!onProgress) return;
        const total = progressEvent.total || 1;
        const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
        onProgress(percentCompleted);
      },
    });

    return response.data;
  },
};

export default compressionService;

