import { X, Upload, CheckCircle } from 'lucide-react';

const UploadProgress = ({ progress }) => {
  const { current, total, fileName, percentage } = progress;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-700 overflow-hidden z-50 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-dark-700">
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Uploading {current} of {total}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            {percentage >= 100 ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {fileName}
            </p>
            <p className="text-xs text-gray-500">{percentage}% complete</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;
