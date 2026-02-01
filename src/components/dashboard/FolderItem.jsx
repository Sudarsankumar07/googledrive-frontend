import { useState, useRef, useEffect } from 'react';
import { 
  Folder,
  MoreVertical,
  Trash2,
  Edit2,
  FolderOpen
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { useFiles } from '../../context/FileContext';
import ConfirmDialog from '../common/ConfirmDialog';
import RenameModal from './RenameModal';

const FolderItem = ({ folder, viewMode = 'grid' }) => {
  const { setCurrentFolder, deleteFolder } = useFiles();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    setCurrentFolder(folder);
  };

  const handleDelete = async () => {
    await deleteFolder(folder._id);
    setShowDeleteConfirm(false);
  };

  if (viewMode === 'list') {
    return (
      <>
        <div className="group flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-800 rounded-xl transition-colors cursor-pointer">
          <div 
            className="flex items-center gap-4 flex-1 min-w-0"
            onDoubleClick={handleOpen}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {folder.name}
              </p>
              <p className="text-xs text-gray-500">Folder</p>
            </div>
          </div>
          
          <span className="text-sm text-gray-500 hidden md:block w-40">
            {formatDate(folder.createdAt)}
          </span>
          
          <span className="text-sm text-gray-500 hidden lg:block w-24">
            —
          </span>

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
                  onClick={() => {
                    handleOpen();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700"
                >
                  <FolderOpen className="w-4 h-4" />
                  Open
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
          title="Delete folder"
          message={`Are you sure you want to delete "${folder.name}"? This will also delete all files and subfolders inside.`}
          confirmText="Delete"
          danger
        />

        <RenameModal
          isOpen={showRename}
          onClose={() => setShowRename(false)}
          item={folder}
          type="folder"
        />
      </>
    );
  }

  return (
    <>
      <div 
        className="group relative bg-white dark:bg-dark-800 rounded-2xl p-4 hover:shadow-lg dark:hover:shadow-dark-700/50 transition-all duration-200 cursor-pointer border border-gray-100 dark:border-dark-700"
        onDoubleClick={handleOpen}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <Folder className="w-8 h-8 text-white" />
          </div>
          <p className="font-medium text-gray-900 dark:text-white text-center truncate w-full">
            {folder.name}
          </p>
        </div>

        {/* Menu button */}
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700 py-1 z-10">
              <button
                onClick={() => {
                  handleOpen();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                <FolderOpen className="w-4 h-4" />
                Open
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
        title="Delete folder"
        message={`Are you sure you want to delete "${folder.name}"? This will also delete all files and subfolders inside.`}
        confirmText="Delete"
        danger
      />

      <RenameModal
        isOpen={showRename}
        onClose={() => setShowRename(false)}
        item={folder}
        type="folder"
      />
    </>
  );
};

export default FolderItem;
