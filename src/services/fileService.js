import api from './api';

export const fileService = {
  getFiles: async (parentId = null) => {
    const params = parentId ? { parentId } : {};
    const response = await api.get('/files', { params });
    return response.data;
  },

  uploadFile: async (file, parentId = null, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    if (parentId) {
      formData.append('parentId', parentId);
    }

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  downloadFile: async (fileId) => {
    const response = await api.get(`/files/${fileId}/download`);
    return response.data;
  },

  deleteFile: async (fileId) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },

  moveFile: async (fileId, newParentId) => {
    const response = await api.patch(`/files/${fileId}/move`, { newParentId });
    return response.data;
  },

  renameFile: async (fileId, name) => {
    const response = await api.patch(`/files/${fileId}/rename`, { name });
    return response.data;
  },

  searchFiles: async (query) => {
    const response = await api.get('/files/search', { params: { query } });
    return response.data;
  },

  // Recent Files
  getRecentFiles: async (limit = 50) => {
    const response = await api.get('/files/recent', { params: { limit } });
    return response.data;
  },

  // Starred Files
  getStarredFiles: async () => {
    const response = await api.get('/files/starred');
    return response.data;
  },

  toggleStar: async (fileId, isStarred) => {
    const response = await api.patch(`/files/${fileId}/star`, { isStarred });
    return response.data;
  },

  // Trash Operations
  getTrashFiles: async () => {
    const response = await api.get('/files/trash');
    return response.data;
  },

  restoreFile: async (fileId) => {
    const response = await api.patch(`/files/${fileId}/restore`);
    return response.data;
  },

  permanentlyDeleteFile: async (fileId) => {
    const response = await api.delete(`/files/${fileId}/permanent`);
    return response.data;
  },

  emptyTrash: async () => {
    const response = await api.delete('/files/trash/empty');
    return response.data;
  },

  // Storage Statistics
  getStorageStats: async () => {
    const response = await api.get('/files/storage-stats');
    return response.data;
  },

  // Get all files (for analytics)
  getAllFiles: async () => {
    const response = await api.get('/files/all');
    return response.data;
  },
};

export default fileService;
