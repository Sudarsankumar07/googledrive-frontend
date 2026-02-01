import api from './api';

export const folderService = {
  getFolders: async (parentId = null) => {
    const params = parentId ? { parentId } : {};
    const response = await api.get('/folders', { params });
    return response.data;
  },

  getFolder: async (folderId) => {
    const response = await api.get(`/folders/${folderId}`);
    return response.data;
  },

  getFolderContents: async (folderId) => {
    try {
      if (folderId) {
        // Get folder contents from backend
        const response = await api.get(`/folders/${folderId}/contents`);
        return response.data;
      } else {
        // Get root contents - get all files and folders with no parent
        const [filesRes, foldersRes] = await Promise.all([
          api.get('/files'),
          api.get('/folders')
        ]);
        return {
          success: true,
          data: {
            files: filesRes.data.data || [],
            folders: foldersRes.data.data || []
          }
        };
      }
    } catch (error) {
      console.error('Error fetching folder contents:', error);
      return { success: false, data: { files: [], folders: [] } };
    }
  },

  getFolderPath: async (folderId) => {
    try {
      const response = await api.get(`/folders/${folderId}/path`);
      return response.data;
    } catch (error) {
      return { success: false, data: [] };
    }
  },

  getBreadcrumb: async (folderId) => {
    const response = await api.get(`/folders/${folderId}/breadcrumb`);
    return response.data;
  },

  createFolder: async (name, parentId = null) => {
    const response = await api.post('/folders', { name, parentId });
    return response.data;
  },

  deleteFolder: async (folderId) => {
    const response = await api.delete(`/folders/${folderId}`);
    return response.data;
  },

  renameFolder: async (folderId, name) => {
    const response = await api.patch(`/folders/${folderId}/rename`, { name });
    return response.data;
  },
};

export default folderService;
