import { format, formatDistanceToNow } from 'date-fns';

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getFileIcon = (mimeType, type) => {
  if (type === 'folder') return 'folder';
  
  if (!mimeType) return 'file';
  
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'sheet';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'slides';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return 'zip';
  if (mimeType.includes('text') || mimeType.includes('json') || mimeType.includes('javascript')) return 'code';
  
  return 'file';
};

export const getFileColor = (iconType) => {
  const colors = {
    folder: 'text-yellow-500',
    image: 'text-purple-500',
    video: 'text-red-500',
    audio: 'text-pink-500',
    pdf: 'text-red-600',
    doc: 'text-blue-600',
    sheet: 'text-green-600',
    slides: 'text-orange-500',
    zip: 'text-gray-600',
    code: 'text-emerald-500',
    file: 'text-gray-500',
  };
  return colors[iconType] || colors.file;
};

export const truncateFileName = (name, maxLength = 25) => {
  if (name.length <= maxLength) return name;
  const extension = name.includes('.') ? '.' + name.split('.').pop() : '';
  const nameWithoutExt = name.replace(extension, '');
  const truncatedName = nameWithoutExt.slice(0, maxLength - extension.length - 3);
  return `${truncatedName}...${extension}`;
};

export const getFileType = (mimeType) => {
  if (!mimeType) return 'other';
  
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('document') ||
      mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('presentation')) {
    return 'document';
  }
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive') ||
      mimeType.includes('tar') || mimeType.includes('gzip') || mimeType.includes('7z')) {
    return 'archive';
  }
  if (mimeType.includes('text') || mimeType.includes('json') || mimeType.includes('javascript') ||
      mimeType.includes('html') || mimeType.includes('css') || mimeType.includes('xml')) {
    return 'code';
  }
  
  return 'other';
};
