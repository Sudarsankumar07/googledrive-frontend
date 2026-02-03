import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import fileService from '../../services/fileService';
import { useFiles } from '../../context/FileContext';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import FileTypeIcon from '../common/FileTypeIcon';
import { formatFileSize, formatTimeAgo } from '../../utils/fileUtils';

const NotificationsView = () => {
  const navigate = useNavigate();
  const { navigateToFolder } = useFiles();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await fileService.getRecentFiles(30);
      if (response.success) {
        setFiles(response.data || []);
      } else {
        toast.error(response.message || 'Failed to load notifications');
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFileLocation = async (file) => {
    navigate('/dashboard');
    await navigateToFolder(file.parentId || null, file._id);
  };

  if (loading) {
    return <Loader />;
  }

  if (!files.length) {
    return (
      <EmptyState
        icon={Bell}
        title="No Notifications"
        description="Recent activity will appear here"
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="btn-ghost p-2 rounded-xl"
          title="Back to Drive"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Recent file activity
          </p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-dark-800">
          {files.map((file) => (
            <button
              key={file._id}
              type="button"
              onClick={() => handleOpenFileLocation(file)}
              className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 flex-shrink-0">
                  <Upload className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800 dark:text-white">
                        You uploaded
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <FileTypeIcon
                          mimeType={file.mimeType}
                          fileName={file.name}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                          {file.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(file.createdAt || file.uploadedAt)}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 flex-shrink-0">
                      {file.createdAt
                        ? new Date(file.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
