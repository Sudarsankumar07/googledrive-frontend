import { Folder, FileText } from 'lucide-react';
import FolderItem from './FolderItem';
import FileItem from './FileItem';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import { useFiles } from '../../context/FileContext';

const FileList = ({ folders, files, viewMode, loading }) => {
  const { highlightedFileId } = useFiles();

  if (loading) {
    return <Loader />;
  }

  if (folders.length === 0 && files.length === 0) {
    return (
      <EmptyState
        icon={Folder}
        title="This folder is empty"
        description="Drop files here or use the upload button to add files"
      />
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-100 dark:border-dark-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 dark:bg-dark-800 border-b border-gray-100 dark:border-dark-700 text-sm font-medium text-gray-500">
          <div className="flex-1">Name</div>
          <div className="hidden md:block w-40">Modified</div>
          <div className="hidden lg:block w-24">Size</div>
          <div className="w-10"></div>
        </div>

        {/* Folders */}
        {folders.length > 0 && (
          <div className="divide-y divide-gray-50 dark:divide-dark-800">
            {folders.map((folder) => (
              <FolderItem key={folder._id} folder={folder} viewMode="list" />
            ))}
          </div>
        )}

        {/* Separator */}
        {folders.length > 0 && files.length > 0 && (
          <div className="border-t border-gray-100 dark:border-dark-700" />
        )}

        {/* Files */}
        {files.length > 0 && (
          <div className="divide-y divide-gray-50 dark:divide-dark-800">
            {files.map((file) => (
              <FileItem
                key={file._id}
                file={file}
                viewMode="list"
                isHighlighted={file._id === highlightedFileId}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Folders */}
      {folders.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Folders ({folders.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <FolderItem key={folder._id} folder={folder} viewMode="grid" />
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {files.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Files ({files.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {files.map((file) => (
              <FileItem
                key={file._id}
                file={file}
                viewMode="grid"
                isHighlighted={file._id === highlightedFileId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;
