import { useState, useRef, useEffect } from 'react';
import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  File,
  Sparkles,
  MoreVertical,
  Download,
  Trash2,
  Edit2,
  Eye,
  Share2,
  Star
} from 'lucide-react';
import { formatDate, formatFileSize, getFileType } from '../../utils/helpers';
import { generateFileTags } from '../../utils/fileUtils';
import { useFiles } from '../../context/FileContext';
import ConfirmDialog from '../common/ConfirmDialog';
import RenameModal from './RenameModal';
import FilePreview from '../common/FilePreview';
import QRShare from './QRShare';
import FileTypeIcon from '../common/FileTypeIcon';
import SmartTags from '../common/SmartTags';
import fileService from '../../services/fileService';
import { toast } from 'react-toastify';
import { useAI } from '../../context/AIContext';

const getFileIcon = (type, mimeType) => {
  switch (type) {
    case 'image':
      return { icon: FileImage, gradient: 'from-pink-400 to-rose-500', shadow: 'shadow-pink-500/30' };
    case 'video':
      return { icon: FileVideo, gradient: 'from-purple-400 to-violet-500', shadow: 'shadow-purple-500/30' };
    case 'audio':
      return { icon: FileAudio, gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-500/30' };
    case 'document':
      return { icon: FileText, gradient: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/30' };
    case 'archive':
      return { icon: FileArchive, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/30' };
    case 'code':
      return { icon: FileCode, gradient: 'from-cyan-400 to-teal-500', shadow: 'shadow-cyan-500/30' };
    default:
      return { icon: File, gradient: 'from-gray-400 to-slate-500', shadow: 'shadow-gray-500/30' };
  }
};

const FileItem = ({ file, viewMode = 'grid', isHighlighted = false }) => {
  const { deleteFile, toggleStar } = useFiles();
  const { openChat } = useAI();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showQRShare, setShowQRShare] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const menuRef = useRef(null);
  const itemRef = useRef(null);

  const fileType = getFileType(file.mimeType);
  const { icon: IconComponent, gradient, shadow } = getFileIcon(fileType, file.mimeType);

  // Scroll to item if highlighted
  useEffect(() => {
    if (isHighlighted && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isHighlighted]);

  // Load thumbnail for images
  useEffect(() => {
    if (fileType === 'image' && !thumbnailUrl && !thumbnailLoading) {
      setThumbnailLoading(true);
      fileService.downloadFile(file._id)
        .then(result => {
          if (result.success && result.data.downloadUrl) {
            setThumbnailUrl(result.data.downloadUrl);
          }
        })
        .catch(err => console.error('Failed to load thumbnail:', err))
        .finally(() => setThumbnailLoading(false));
    }
  }, [file._id, fileType, thumbnailUrl, thumbnailLoading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = async () => {
    try {
      const result = await fileService.downloadFile(file._id);
      if (result.success && result.data.downloadUrl) {
        window.open(result.data.downloadUrl, '_blank');
      } else {
        toast.error('Download URL not available');
      }
    } catch (error) {
      toast.error('Failed to download file');
    }
    setShowMenu(false);
  };

  const handlePreview = () => {
    setShowPreview(true);
    setShowMenu(false);
  };

  const handleAskAI = () => {
    openChat({ context: { selectedFiles: [file._id] } });
    setShowMenu(false);
  };

  const handleQRShare = () => {
    setShowQRShare(true);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    await deleteFile(file._id);
    setShowDeleteConfirm(false);
  };

  if (viewMode === 'list') {
    return (
      <>
        <div
          ref={itemRef}
          className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-500 cursor-pointer ${isHighlighted
            ? 'bg-primary-50 dark:bg-primary-900/30 ring-2 ring-primary-500 shadow-md z-10 relative my-1'
            : 'hover:bg-gray-50 dark:hover:bg-dark-800'
            }`}
          onClick={handlePreview}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <FileTypeIcon
              mimeType={file.mimeType}
              fileName={file.name}
              className="w-6 h-6"
              showBackground={true}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 capitalize truncate">
                {fileType}
                {file.aiSummary ? ` • ${file.aiSummary}` : ''}
              </p>
            </div>
          </div>

          <span className="text-sm text-gray-500 hidden md:block w-40">
            {formatDate(file.createdAt)}
          </span>

          <span className="text-sm text-gray-500 hidden lg:block w-24">
            {formatFileSize(file.size)}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleStar(file._id, file.isStarred);
            }}
            className={`p-2 rounded-lg transition-colors ${file.isStarred
              ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-dark-700 opacity-0 group-hover:opacity-100'
              }`}
            title={file.isStarred ? 'Unstar' : 'Star'}
          >
            <Star
              className="w-5 h-5"
              fill={file.isStarred ? 'currentColor' : 'none'}
            />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700 py-1 z-10">
                <button
                  onClick={handleAskAI}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask AI
                </button>
                <button
                  onClick={handlePreview}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleQRShare}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700"
                >
                  <Share2 className="w-4 h-4" />
                  QR Share
                </button>
                <button
                  onClick={() => {
                    setShowRename(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Rename
                </button>
                <hr className="my-1 border-gray-100 dark:border-dark-700" />
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="Delete file"
          message={`Are you sure you want to delete "${file.name}"? This action cannot be undone.`}
          confirmText="Delete"
          danger
        />

        <RenameModal
          isOpen={showRename}
          onClose={() => setShowRename(false)}
          item={file}
          type="file"
        />
      </>
    );
  }

  return (
    <>
      <div
        ref={itemRef}
        className={`group relative bg-white dark:bg-dark-800 rounded-2xl p-4 transition-all duration-500 border ${isHighlighted
            ? 'ring-4 ring-primary-500/50 shadow-xl scale-105 z-10 border-primary-500'
            : 'hover:shadow-lg dark:hover:shadow-dark-700/50 border-gray-100 dark:border-dark-700'
          }`}
      >
        {/* Preview area */}
        <div
          className="relative aspect-square rounded-xl bg-gray-100 dark:bg-dark-700 flex items-center justify-center mb-3 overflow-hidden cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
          onClick={handlePreview}
        >
          {fileType === 'image' && thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={file.name}
              className="w-full h-full object-cover"
              onError={() => setThumbnailUrl(null)}
            />
          ) : fileType === 'image' && thumbnailLoading ? (
            <div className="animate-pulse w-full h-full bg-gray-200 dark:bg-dark-600" />
          ) : (
            <div className="flex items-center justify-center">
              <FileTypeIcon
                mimeType={file.mimeType}
                fileName={file.name}
                className="w-12 h-12"
                showBackground={true}
              />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center pointer-events-none">
            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* File info */}
        <div>
          <p className="font-medium text-gray-900 dark:text-white truncate text-sm mb-2">
            {file.name}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)}
            </p>
          </div>
          {file.aiSummary && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
              {file.aiSummary}
            </p>
          )}

          {/* Smart Tags */}
          <SmartTags
            file={file}
            className="mt-2"
            onTagClick={(tag) => {
              // Tag click handler
            }}
          />
        </div>

        {/* Star and Menu buttons */}
        <div className="absolute top-2 right-2 flex gap-1" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleStar(file._id, file.isStarred);
            }}
            className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm ${file.isStarred
              ? 'text-yellow-500 hover:bg-white/80 dark:hover:bg-dark-700 opacity-100'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-white/80 dark:hover:bg-dark-700'
              }`}
            title={file.isStarred ? 'Unstar' : 'Star'}
          >
            <Star
              className="w-4 h-4"
              fill={file.isStarred ? 'currentColor' : 'none'}
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/80 dark:hover:bg-dark-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700 py-1 z-10">
              <button
                onClick={handleAskAI}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                <Sparkles className="w-4 h-4" />
                Ask AI
              </button>
              <button
                onClick={handlePreview}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleDownload}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={handleQRShare}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                <Share2 className="w-4 h-4" />
                QR Share
              </button>
              <button
                onClick={() => {
                  setShowRename(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                <Edit2 className="w-4 h-4" />
                Rename
              </button>
              <hr className="my-1 border-gray-100 dark:border-dark-700" />
              <button
                onClick={() => {
                  setShowDeleteConfirm(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete file"
        message={`Are you sure you want to delete "${file.name}"? This action cannot be undone.`}
        confirmText="Delete"
        danger
      />

      <RenameModal
        isOpen={showRename}
        onClose={() => setShowRename(false)}
        item={file}
        type="file"
      />

      <FilePreview
        file={file}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />

      <QRShare
        file={file}
        isOpen={showQRShare}
        onClose={() => setShowQRShare(false)}
      />
    </>
  );
};

export default FileItem;
