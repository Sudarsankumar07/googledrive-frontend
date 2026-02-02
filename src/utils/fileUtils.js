// File utility functions for enhanced features

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileType = (mimeType) => {
  if (!mimeType) return 'unknown';
  
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf')) return 'document';
  if (mimeType.includes('text') || mimeType.includes('json') || mimeType.includes('xml')) return 'text';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive';
  if (mimeType.includes('document') || mimeType.includes('spreadsheet') || mimeType.includes('presentation')) return 'document';
  
  return 'document';
};

export const isImageFile = (mimeType) => {
  return mimeType && mimeType.startsWith('image/');
};

export const isTextFile = (mimeType, filename) => {
  if (!mimeType && !filename) return false;
  
  const textExtensions = ['.txt', '.md', '.json', '.xml', '.csv', '.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.yml', '.yaml'];
  const hasTextExtension = filename && textExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  
  return (mimeType && (mimeType.includes('text') || mimeType.includes('json') || mimeType.includes('xml'))) || hasTextExtension;
};

export const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return new Date(date).toLocaleDateString();
};

export const generateFileTags = (file) => {
  if (!file) return [];
  
  const tags = [];
  
  // Size-based tags
  if (file.size > 50 * 1024 * 1024) tags.push('large');
  else if (file.size < 1024 * 1024) tags.push('small');
  else tags.push('medium');
  
  // Type-based tags
  const type = getFileType(file.mimeType);
  tags.push(type);
  
  // Date-based tags
  const uploadDate = new Date(file.createdAt || file.uploadedAt || Date.now());
  const now = new Date();
  const diffDays = (now - uploadDate) / (1000 * 60 * 60 * 24);
  
  if (diffDays < 1) tags.push('today');
  else if (diffDays < 7) tags.push('recent');
  else if (diffDays > 30) tags.push('old');
  
  // Extension-based tags
  const extension = file.name ? file.name.split('.').pop()?.toLowerCase() : '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) tags.push('photo');
  if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) tags.push('document');
  if (['mp4', 'avi', 'mov', 'mkv'].includes(extension)) tags.push('video');
  if (['mp3', 'wav', 'flac', 'aac'].includes(extension)) tags.push('audio');
  
  return [...new Set(tags)]; // Remove duplicates
};

export const filterFiles = (files, filters) => {
  return files.filter(file => {
    // Type filter
    if (filters.type && filters.type !== 'all') {
      const fileType = getFileType(file.mimeType);
      if (fileType !== filters.type) return false;
    }
    
    // Size filter
    if (filters.size && filters.size !== 'any') {
      const sizeInMB = file.size / (1024 * 1024);
      switch (filters.size) {
        case 'small':
          if (sizeInMB > 10) return false;
          break;
        case 'medium':
          if (sizeInMB <= 10 || sizeInMB > 100) return false;
          break;
        case 'large':
          if (sizeInMB <= 100) return false;
          break;
      }
    }
    
    // Date filter
    if (filters.dateRange && filters.dateRange !== 'any') {
      const fileDate = new Date(file.createdAt || file.uploadedAt || Date.now());
      const now = new Date();
      const diffDays = (now - fileDate) / (1000 * 60 * 60 * 24);
      
      switch (filters.dateRange) {
        case 'today':
          if (diffDays > 1) return false;
          break;
        case 'week':
          if (diffDays > 7) return false;
          break;
        case 'month':
          if (diffDays > 30) return false;
          break;
      }
    }
    
    // Extension filter
    if (filters.extension && filters.extension !== 'any') {
      const fileExtension = file.name ? file.name.split('.').pop()?.toLowerCase() : '';
      if (fileExtension !== filters.extension) return false;
    }
    
    return true;
  });
};