import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  LayoutGrid,
  List,
  Upload,
  FolderPlus,
  RefreshCw,
  SortAsc,
  SortDesc,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useFiles } from '../../context/FileContext';
import Breadcrumb from './Breadcrumb';
import UploadDropzone from './UploadDropzone';
import FileList from './FileList';
import CreateFolderModal from './CreateFolderModal';
import UploadProgress from './UploadProgress';
import Button from '../common/Button';
import fileService from '../../services/fileService';
import AdvancedSearch from './AdvancedSearch';
import AnalyticsWidget from './AnalyticsWidget';
import ActivityFeed from './ActivityFeed';
import StorageIndicator from './StorageIndicator';

const Dashboard = () => {
  const { fileInputRef } = useOutletContext();
  const {
    files,
    folders,
    loading,
    refreshFiles,
    currentFolder,
    isUploading,
    uploadProgress,
    setUploadProgress,
    setIsUploading
  } = useFiles();

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchResults, setSearchResults] = useState({ files: [], folders: [] });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const sortMenuRef = useRef(null);

  const handleSearchResults = useCallback((results) => {
    setSearchResults(results || { files: [], folders: [] });
    setIsSearchActive(results.isActive || false);
  }, []);

  useEffect(() => {
    refreshFiles();
  }, [currentFolder]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle file upload from sidebar
  useEffect(() => {
    const handleFileChange = async (e) => {
      let selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length === 0) return;

      // Validate file sizes (100MB limit - matches backend)
      const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
      const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);

      if (oversizedFiles.length > 0) {
        oversizedFiles.forEach(file => {
          toast.error(`File "${file.name}" exceeds 100MB limit`);
        });

        // Filter out oversized files
        const validFiles = selectedFiles.filter(file => file.size <= MAX_FILE_SIZE);
        if (validFiles.length === 0) {
          return;
        }
        // Continue with valid files only
        selectedFiles = validFiles;
      }

      setIsUploading(true);
      const totalFiles = selectedFiles.length;
      let uploadedCount = 0;

      for (const file of selectedFiles) {
        try {
          setUploadProgress({
            current: uploadedCount + 1,
            total: totalFiles,
            fileName: file.name,
            percentage: 0
          });

          const result = await fileService.uploadFile(
            file,
            currentFolder?._id || null,
            (progress) => {
              setUploadProgress(prev => ({
                ...prev,
                percentage: progress
              }));
            }
          );

          if (result.success) {
            uploadedCount++;
          } else {
            toast.error(`Failed to upload ${file.name}`);
          }
        } catch (error) {
          toast.error(`Error uploading ${file.name}`);
        }
      }

      setIsUploading(false);
      setUploadProgress(null);

      if (uploadedCount > 0) {
        toast.success(`${uploadedCount} file${uploadedCount > 1 ? 's' : ''} uploaded successfully!`);
        refreshFiles();
      }

      // Reset file input
      e.target.value = '';
    };

    const input = fileInputRef?.current;
    if (input) {
      input.addEventListener('change', handleFileChange);
      return () => input.removeEventListener('change', handleFileChange);
    }
  }, [fileInputRef, currentFolder, refreshFiles, setIsUploading, setUploadProgress]);

  const sortItems = (items, type) => {
    return [...items].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const displayFiles = isSearchActive ? searchResults.files : (files || []);
  const displayFolders = isSearchActive ? searchResults.folders : (folders || []);

  const sortedFolders = useMemo(() => {
    return sortItems(displayFolders, 'folder');
  }, [displayFolders, sortBy, sortOrder]);

  const sortedFiles = useMemo(() => {
    return sortItems(displayFiles, 'file');
  }, [displayFiles, sortBy, sortOrder]);

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date modified' },
    { value: 'size', label: 'Size' }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Breadcrumb />

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <button
            onClick={refreshFiles}
            disabled={loading}
            className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Sort */}
          <div className="relative" ref={sortMenuRef}>
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-xl transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              <span className="hidden sm:inline">Sort</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700 py-2 z-10">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Sort by</div>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (sortBy === option.value) {
                        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy(option.value);
                        setSortOrder('asc');
                      }
                      setShowSortMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-dark-700 ${sortBy === option.value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'
                      }`}
                  >
                    {option.label}
                    {sortBy === option.value && (
                      sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-dark-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                ? 'bg-white dark:bg-dark-700 text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                ? 'bg-white dark:bg-dark-700 text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowCreateFolder(true)}
              className="hidden sm:flex"
            >
              <FolderPlus className="w-4 h-4" />
              New Folder
            </Button>
            <Button
              size="sm"
              onClick={() => fileInputRef?.current?.click()}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Search */}
      <AdvancedSearch
        files={files || []}
        folders={folders || []}
        onSearchResults={handleSearchResults}
        className="mb-6"
      />

      {/* Analytics & Activity Grid */}
      <div className="grid gap-6 mb-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AnalyticsWidget files={files || []} />
          <StorageIndicator files={files || []} />
        </div>
        <ActivityFeed files={files || []} />
      </div>

      {/* Content */}
      <UploadDropzone>
        <FileList
          folders={sortedFolders}
          files={sortedFiles}
          viewMode={viewMode}
          loading={loading}
        />
      </UploadDropzone>

      {/* Upload Progress */}
      {isUploading && uploadProgress && (
        <UploadProgress progress={uploadProgress} />
      )}

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
      />
    </div>
  );
};

export default Dashboard;
