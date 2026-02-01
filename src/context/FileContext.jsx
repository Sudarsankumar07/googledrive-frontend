import { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import fileService from '../services/fileService';
import folderService from '../services/folderService';

const FileContext = createContext(null);

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolderState] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const refreshFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await folderService.getFolderContents(currentFolder?._id || null);
      if (response.success) {
        setFiles(response.data.files || []);
        setFolders(response.data.folders || []);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [currentFolder]);

  const setCurrentFolder = useCallback(async (folder) => {
    setCurrentFolderState(folder);
    
    // Update folder path
    if (!folder) {
      setFolderPath([]);
    } else {
      // Fetch folder path from server if needed
      try {
        const pathResponse = await folderService.getFolderPath(folder._id);
        if (pathResponse.success) {
          setFolderPath(pathResponse.data || [folder]);
        } else {
          // Fallback: add to current path
          setFolderPath(prev => {
            const existingIndex = prev.findIndex(f => f._id === folder._id);
            if (existingIndex >= 0) {
              return prev.slice(0, existingIndex + 1);
            }
            return [...prev, folder];
          });
        }
      } catch (error) {
        // Fallback: add to current path
        setFolderPath(prev => {
          const existingIndex = prev.findIndex(f => f._id === folder._id);
          if (existingIndex >= 0) {
            return prev.slice(0, existingIndex + 1);
          }
          return [...prev, folder];
        });
      }
    }
  }, []);

  const deleteFile = async (fileId) => {
    try {
      const response = await fileService.deleteFile(fileId);
      if (response.success) {
        toast.success('File deleted successfully');
        refreshFiles();
      } else {
        toast.error(response.message || 'Failed to delete file');
      }
      return response;
    } catch (error) {
      toast.error('Failed to delete file');
      throw error;
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      const response = await folderService.deleteFolder(folderId);
      if (response.success) {
        toast.success('Folder deleted successfully');
        refreshFiles();
      } else {
        toast.error(response.message || 'Failed to delete folder');
      }
      return response;
    } catch (error) {
      toast.error('Failed to delete folder');
      throw error;
    }
  };

  const value = {
    files,
    folders,
    currentFolder,
    folderPath,
    loading,
    isUploading,
    uploadProgress,
    setIsUploading,
    setUploadProgress,
    refreshFiles,
    setCurrentFolder,
    deleteFile,
    deleteFolder,
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};

export default FileContext;
