import { HardDrive } from 'lucide-react';
import { formatFileSize } from '../../utils/fileUtils';
import { useStorageData, getProgressBarColor } from '../../hooks/useStorageData';
import { useStorageStats, getStorageColor } from '../../hooks/useStorageStats';

const StorageIndicator = ({
  files = [],
  totalSpaceLimit = 5 * 1024 * 1024 * 1024, // 5GB default
  className = ''
}) => {
  // Use backend storage stats for ACCURATE total (all user files)
  const { storageStats, loading } = useStorageStats(false);

  // Fallback to local calculation if backend data not available
  const localStorageData = useStorageData(files, totalSpaceLimit);

  // Use backend data if available, otherwise use local calculation
  const usedSpace = storageStats?.totalUsed ?? localStorageData.usedSpace;
  const percentage = storageStats?.usagePercentage ?? localStorageData.percentage;
  const remainingSpace = storageStats ? (storageStats.storageLimit - storageStats.totalUsed) : localStorageData.remainingSpace;
  const actualLimit = storageStats?.storageLimit ?? totalSpaceLimit;

  const StatusIcon = localStorageData.statusIcon;

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
          <HardDrive className="w-5 h-5 text-primary-500" />
          Storage Usage
        </h3>
        <div className={`p-2 rounded-full ${localStorageData.statusBg}`}>
          <StatusIcon className={`w-4 h-4 ${localStorageData.statusColor}`} />
        </div>
      </div>

      {/* Storage Stats */}
      <div className="space-y-4">
        {/* Used vs Total */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Used Space</span>
          <span className="font-medium text-gray-800 dark:text-white">
            {formatFileSize(usedSpace)} / {formatFileSize(actualLimit)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out ${getProgressBarColor(percentage)}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>0%</span>
            <span className="font-medium">{percentage.toFixed(1)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Remaining Space */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Available</span>
          <span className="font-medium text-gray-800 dark:text-white">
            {formatFileSize(Math.max(0, remainingSpace))}
          </span>
        </div>

        {/* Status Message */}
        <div className={`p-3 rounded-lg ${localStorageData.statusBg}`}>
          <p className={`text-sm ${localStorageData.statusColor} font-medium`}>
            {localStorageData.message}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {storageStats?.fileCount ?? files.length}
            </p>
            <p className="text-xs text-gray-500">Total Files</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {(storageStats?.fileCount && storageStats?.fileCount > 0)
                ? formatFileSize(usedSpace / storageStats.fileCount)
                : (files.length > 0 ? formatFileSize(usedSpace / files.length) : '0 B')}
            </p>
            <p className="text-xs text-gray-500">Avg. Size</p>
          </div>
        </div>

        {/* Action Buttons */}
        {localStorageData.status !== 'normal' && (
          <div className="pt-3 space-y-2">
            {localStorageData.status === 'critical' && (
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