import {
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  FileCode,
  FileArchive,
  File as FileIcon,
  FileSpreadsheet
} from 'lucide-react';
import { getFileType } from '../../utils/fileUtils';

const FileTypeIcon = ({ mimeType, fileName, className = "w-5 h-5", showBackground = false }) => {
  const getIconConfig = (mimeType, fileName) => {
    // Check by MIME type first
    if (mimeType) {
      if (mimeType.startsWith('image/')) {
        return { icon: FileImage, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900' };
      }
      if (mimeType.startsWith('video/')) {
        return { icon: FileVideo, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900' };
      }
      if (mimeType.startsWith('audio/')) {
        return { icon: FileAudio, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900' };
      }
      if (mimeType.includes('pdf')) {
        return { icon: FileText, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900' };
      }
      if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
        return { icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900' };
      }
      if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
        return { icon: FileText, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900' };
      }
      if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) {
        return { icon: FileArchive, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900' };
      }
      if (mimeType.includes('text') || mimeType.includes('json') || mimeType.includes('xml')) {
        return { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800' };
      }
    }

    // Check by file extension if MIME type doesn't match
    if (fileName) {
      const extension = fileName.split('.').pop()?.toLowerCase();
      
      // Code files
      const codeExtensions = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs'];
      if (codeExtensions.includes(extension)) {
        return { icon: FileCode, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900' };
      }

      // Images
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'];
      if (imageExtensions.includes(extension)) {
        return { icon: FileImage, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900' };
      }

      // Videos
      const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
      if (videoExtensions.includes(extension)) {
        return { icon: FileVideo, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900' };
      }

      // Audio
      const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'];
      if (audioExtensions.includes(extension)) {
        return { icon: FileAudio, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900' };
      }

      // Documents
      const docExtensions = ['doc', 'docx', 'txt', 'rtf', 'odt'];
      if (docExtensions.includes(extension)) {
        return { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800' };
      }

      // PDFs
      if (extension === 'pdf') {
        return { icon: FileText, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900' };
      }

      // Spreadsheets
      const spreadsheetExtensions = ['xls', 'xlsx', 'csv', 'ods'];
      if (spreadsheetExtensions.includes(extension)) {
        return { icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900' };
      }

      // Presentations
      const presentationExtensions = ['ppt', 'pptx', 'odp'];
      if (presentationExtensions.includes(extension)) {
        return { icon: FileText, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900' };
      }

      // Archives
      const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
      if (archiveExtensions.includes(extension)) {
        return { icon: FileArchive, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900' };
      }
    }

    // Default
    return { icon: FileIcon, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' };
  };

  const config = getIconConfig(mimeType, fileName);
  const Icon = config.icon;

  if (showBackground) {
    return (
      <div className={`p-2 rounded-lg ${config.bg}`}>
        <Icon className={`${className} ${config.color}`} />
      </div>
    );
  }

  return <Icon className={`${className} ${config.color}`} />;
};

export default FileTypeIcon;