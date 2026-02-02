import { useMemo } from 'react';
import { HardDrive, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { formatFileSize } from '../../utils/fileUtils';

const StorageIndicator = ({ 
  files = [], 
  totalSpaceLimit = 5 * 1024 * 1024 * 1024, // 5GB default
  className = ''
}) => {
  const storageData = useMemo(() => {
    const usedSpace = files.reduce((sum, file) => sum + (file.size || 0), 0);
    const percentage = totalSpaceLimit > 0 ? (usedSpace / totalSpaceLimit) * 100 : 0;
    const remainingSpace = totalSpaceLimit - usedSpace;
    
    // Determine status
    let status = 'normal';
    let statusIcon = CheckCircle;
    let statusColor = 'text-green-500';
    let statusBg = 'bg-green-100 dark:bg-green-900';
    let message = 'You have plenty of storage space';
    
    if (percentage >= 90) {
      status = 'critical';
      statusIcon = AlertTriangle;
      statusColor = 'text-red-500';
      statusBg = 'bg-red-100 dark:bg-red-900';
      message = 'Storage almost full! Consider upgrading or cleaning up files';
    } else if (percentage >= 75) {
      status = 'warning';
      statusIcon = AlertTriangle;
      statusColor = 'text-amber-500';
      statusBg = 'bg-amber-100 dark:bg-amber-900';
      message = 'Storage getting full. Consider managing your files';
    } else if (percentage >= 50) {
      status = 'info';
      statusIcon = Info;
      statusColor = 'text-blue-500';
      statusBg = 'bg-blue-100 dark:bg-blue-900';
      message = 'You\'re using a moderate amount of storage';
    }

    return {
      usedSpace,
      totalSpaceLimit,
      remainingSpace,
      percentage: Math.min(percentage, 100),
      status,
      statusIcon,
      statusColor,
      statusBg,
      message
    };
  }, [files, totalSpaceLimit]);

  const getProgressBarColor = () => {
    if (storageData.percentage >= 90) return 'bg-red-500';
    if (storageData.percentage >= 75) return 'bg-amber-500';
    if (storageData.percentage >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const StatusIcon = storageData.statusIcon;

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
          <HardDrive className="w-5 h-5 text-primary-500" />
          Storage Usage
        </h3>
        <div className={`p-2 rounded-full ${storageData.statusBg}`}>
          <StatusIcon className={`w-4 h-4 ${storageData.statusColor}`} />
        </div>
      </div>

      {/* Storage Stats */}
      <div className="space-y-4">
        {/* Used vs Total */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Used Space</span>
          <span className="font-medium text-gray-800 dark:text-white">
            {formatFileSize(storageData.usedSpace)} / {formatFileSize(storageData.totalSpaceLimit)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out ${getProgressBarColor()}`}
              style={{ width: `${storageData.percentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>0%</span>
            <span className="font-medium">{storageData.percentage.toFixed(1)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Remaining Space */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Available</span>
          <span className="font-medium text-gray-800 dark:text-white">
            {formatFileSize(Math.max(0, storageData.remainingSpace))}
          </span>
        </div>

        {/* Status Message */}
        <div className={`p-3 rounded-lg ${storageData.statusBg}`}>
          <p className={`text-sm ${storageData.statusColor} font-medium`}>
            {storageData.message}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800 dark:text-white">{files.length}</p>
            <p className="text-xs text-gray-500">Total Files</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {files.length > 0 ? formatFileSize(storageData.usedSpace / files.length) : '0 B'}
            </p>
            <p className="text-xs text-gray-500">Avg. Size</p>
          </div>
        </div>

        {/* Action Buttons */}
        {storageData.status !== 'normal' && (
          <div className="pt-3 space-y-2">
            {storageData.status === 'critical' && (
              <button className="btn-primary w-full text-sm">
                Upgrade Storage Plan
              </button>
            )}
            <button className="btn-secondary w-full text-sm">
              Manage Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageIndicator;