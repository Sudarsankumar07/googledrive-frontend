import { useMemo } from 'react';
import { Clock, Upload, Download, Share, Eye, Trash } from 'lucide-react';
import { formatTimeAgo, formatFileSize } from '../../utils/fileUtils';
import FileTypeIcon from '../common/FileTypeIcon';

const ActivityFeed = ({ files = [], className = '' }) => {
  // Generate activity feed from files data
  const activities = useMemo(() => {
    if (!files || !files.length) return [];

    // Create activities based on file data
    const fileActivities = files.map(file => {
      const baseActivity = {
        id: file._id,
        file: {
          name: file.name,
          size: file.size,
          mimeType: file.mimeType
        },
        timestamp: file.createdAt || file.uploadedAt || Date.now(),
        user: file.uploadedBy || 'You'
      };

      // Determine activity type based on file data or default to upload
      return {
        ...baseActivity,
        action: 'uploaded',
        icon: Upload,
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900'
      };
    });

    // Sort by most recent first and limit to 10 items
    return fileActivities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  }, [files]);

  const getActivityIcon = (action) => {
    const iconMap = {
      uploaded: Upload,
      downloaded: Download,
      shared: Share,
      viewed: Eye,
      deleted: Trash
    };
    return iconMap[action] || Upload;
  };

  const getActivityText = (activity) => {
    const actionMap = {
      uploaded: 'uploaded',
      downloaded: 'downloaded',
      shared: 'shared',
      viewed: 'viewed',
      deleted: 'deleted'
    };
    
    const actionText = actionMap[activity.action] || 'uploaded';
    
    return {
      primary: `${activity.user} ${actionText}`,
      secondary: activity.file.name
    };
  };

  if (!activities.length) {
    return (
      <div className={`card p-6 text-center ${className}`}>
        <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Recent Activity</h3>
        <p className="text-gray-500 text-sm">File activity will appear here</p>
      </div>
    );
  }

  return (
    <div className={`card ${className}`}>
      <div className="p-6 border-b border-gray-200 dark:border-dark-700">
        <h3 className="font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
          <Clock className="w-5 h-5 text-primary-500" />
          Recent Activity
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest file operations</p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {activities.map((activity, index) => {
          const ActivityIcon = getActivityIcon(activity.action);
          const { primary, secondary } = getActivityText(activity);
          
          return (
            <div
              key={activity.id}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                index === activities.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Activity Icon */}
                <div className={`p-2 rounded-full ${activity.bgColor || 'bg-gray-100 dark:bg-gray-700'} flex-shrink-0`}>
                  <ActivityIcon className={`w-4 h-4 ${activity.color || 'text-gray-500'}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-white">
                        {primary}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <FileTypeIcon 
                          mimeType={activity.file.mimeType} 
                          fileName={activity.file.name}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                          {secondary}
                        </span>
                      </div>
                      
                      {/* File details */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{formatFileSize(activity.file.size)}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                    </div>
                    
                    {/* Timestamp */}
                    <div className="text-xs text-gray-400 ml-2">
                      {new Date(activity.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 text-center">
        <button className="text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;