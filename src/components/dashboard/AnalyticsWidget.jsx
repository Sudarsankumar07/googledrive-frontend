import { useMemo, useState, useEffect } from 'react';
import { HardDrive, Files, TrendingUp, Clock, FileType } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { formatFileSize, getFileType, formatTimeAgo } from '../../utils/fileUtils';
import fileService from '../../services/fileService';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AnalyticsWidget = () => {
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all user files for accurate analytics
  useEffect(() => {
    const fetchAllFiles = async () => {
      try {
        setLoading(true);
        const response = await fileService.getAllFiles();
        if (response.success) {
          setAllFiles(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch files for analytics:', error);
        setAllFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllFiles();
  }, []);

  const analytics = useMemo(() => {
    if (!allFiles || !allFiles.length) {
      return {
        totalFiles: 0,
        totalSize: 0,
        typeDistribution: {},
        recentFiles: [],
        largestFiles: [],
        averageFileSize: 0
      };
    }

    const totalSize = allFiles.reduce((sum, file) => sum + (file.size || 0), 0);

    const typeDistribution = allFiles.reduce((acc, file) => {
      const type = getFileType(file.mimeType);
      if (!acc[type]) {
        acc[type] = { count: 0, size: 0 };
      }
      acc[type].count += 1;
      acc[type].size += file.size || 0;
      return acc;
    }, {});

    const recentFiles = allFiles
      .filter(f => {
        const fileDate = new Date(f.createdAt || f.uploadedAt || Date.now());
        const daysDiff = (Date.now() - fileDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      })
      .slice(0, 5);

    const largestFiles = [...allFiles]
      .sort((a, b) => (b.size || 0) - (a.size || 0))
      .slice(0, 3);

    return {
      totalFiles: allFiles.length,
      totalSize,
      typeDistribution,
      recentFiles,
      largestFiles,
      averageFileSize: allFiles.length ? totalSize / allFiles.length : 0
    };
  }, [allFiles]);

  const pieChartData = {
    labels: Object.keys(analytics.typeDistribution).map(type =>
      type.charAt(0).toUpperCase() + type.slice(1)
    ),
    datasets: [
      {
        data: Object.values(analytics.typeDistribution).map(type => type.count),
        backgroundColor: [
          '#5b64f7', // brand blue
          '#10b981', // emerald
          '#f59e0b', // amber  
          '#ef4444', // red
          '#8b5cf6', // violet
          '#06b6d4', // cyan
          '#84cc16'  // lime
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  const barChartData = {
    labels: Object.keys(analytics.typeDistribution).map(type =>
      type.charAt(0).toUpperCase() + type.slice(1)
    ),
    datasets: [
      {
        label: 'Storage Usage (MB)',
        data: Object.values(analytics.typeDistribution).map(type =>
          (type.size / (1024 * 1024)).toFixed(2)
        ),
        backgroundColor: '#5b64f7',
        borderColor: '#4338f7',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    }
  };

  if (loading) {
    return (
      <div className="card p-6 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">Loading analytics...</p>
      </div>
    );
  }

  if (!allFiles.length) {
    return (
      <div className="card p-6 text-center">
        <FileType className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Files Yet</h3>
        <p className="text-gray-500 text-sm">Upload some files to see your storage analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="card p-6">
        <h3 className="font-semibold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          Storage Analytics
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 glass rounded-xl">
            <Files className="w-8 h-8 mx-auto text-brand-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{analytics.totalFiles}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Files</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl">
            <HardDrive className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatFileSize(analytics.totalSize)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Used Space</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl">
            <FileType className="w-8 h-8 mx-auto text-purple-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{Object.keys(analytics.typeDistribution).length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">File Types</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 rounded-xl">
            <Clock className="w-8 h-8 mx-auto text-amber-500 mb-2" />
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatFileSize(analytics.averageFileSize)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Avg. Size</p>
          </div>
        </div>

        {/* File Type Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">File Type Breakdown</h4>
          {Object.entries(analytics.typeDistribution).map(([type, data]) => (
            <div key={type} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="capitalize text-sm font-medium text-gray-700 dark:text-gray-300">{type}s</span>
              <div className="text-right">
                <span className="font-semibold text-gray-800 dark:text-white">{data.count}</span>
                <span className="text-xs text-gray-500 ml-2">({formatFileSize(data.size)})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Count Distribution */}
        <div className="card p-6">
          <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">File Count Distribution</h4>
          <div className="h-64">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>

        {/* Storage Usage by Type */}
        <div className="card p-6">
          <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">Storage Usage by Type</h4>
          <div className="h-64">
            <Bar data={barChartData} options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function (value) {
                      return value + ' MB';
                    }
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>

      {/* Recent Activity & Largest Files */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Files */}
        <div className="card p-6">
          <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">Recent Files</h4>
          {analytics.recentFiles.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentFiles.map((file, index) => (
                <div key={file._id || index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(file.createdAt || file.uploadedAt)}</p>
                  </div>
                  <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent files</p>
          )}
        </div>

        {/* Largest Files */}
        <div className="card p-6">
          <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">Largest Files</h4>
          {analytics.largestFiles.length > 0 ? (
            <div className="space-y-3">
              {analytics.largestFiles.map((file, index) => (
                <div key={file._id || index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{getFileType(file.mimeType)}</p>
                  </div>
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">{formatFileSize(file.size)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No files found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWidget;