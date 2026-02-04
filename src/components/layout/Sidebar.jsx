import { Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HardDrive,
  Clock,
  Star,
  Trash2,
  Archive,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
  FolderPlus,
  Cloud
} from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { useFiles } from '../../context/FileContext';
import { formatFileSize } from '../../utils/helpers';
import { useStorageStats, getStorageColor } from '../../hooks/useStorageStats';
import Button from '../common/Button';
import AppIcon from '../common/Icon';

const Sidebar = ({ isOpen, onToggle, onCreateFolder, onUpload }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentFolder } = useFiles();

  // Fetch accurate storage stats from backend (counts ALL user files)
  const { storageStats, loading } = useStorageStats(true); // Auto-refresh enabled

  const menuItems = [
    { icon: HardDrive, label: 'My Drive', path: '/dashboard', active: true },
    { icon: Clock, label: 'Recent', path: '/dashboard/recent' },
    { icon: Star, label: 'Starred', path: '/dashboard/starred' },
    { icon: Archive, label: 'Compress', path: '/dashboard/compress' },
    { icon: Trash2, label: 'Trash', path: '/dashboard/trash' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          h-screen w-72 
          bg-white dark:bg-dark-900
          border-r border-gray-200 dark:border-dark-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-dark-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
            <AppIcon symbol="cloud" fallback={Cloud} size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
            CloudDrive
          </span>
        </div>

        {/* New Button */}
        <div className="p-4">
          <Menu as="div" className="relative">
            <MenuButton
              as={Button}
              type="button"
              variant="primary"
              className="w-full py-3"
            >
              <span className="flex items-center justify-center gap-2">
                <AppIcon symbol="add" fallback={Plus} size={20} />
                <span>New</span>
              </span>
            </MenuButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-150"
              enterFrom="transform opacity-0 -translate-y-1"
              enterTo="transform opacity-100 translate-y-0"
              leave="transition ease-in duration-120"
              leaveFrom="transform opacity-100 translate-y-0"
              leaveTo="transform opacity-0 -translate-y-1"
            >
              <MenuItems className="absolute left-0 right-0 mt-2 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden z-50 focus:outline-none">
                <MenuItem>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={onUpload}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 ${active ? 'bg-gray-50 dark:bg-dark-700' : ''}`}
                    >
                      <AppIcon symbol="upload" fallback={Upload} size={18} className="text-primary-600 dark:text-primary-400" />
                      Upload File
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={onCreateFolder}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 ${active ? 'bg-gray-50 dark:bg-dark-700' : ''}`}
                    >
                      <AppIcon symbol="create_new_folder" fallback={FolderPlus} size={18} className="text-primary-600 dark:text-primary-400" />
                      New Folder
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => !item.disabled && navigate(item.path)}
                  disabled={item.disabled}
                  className={`
                    w-full sidebar-item
                    ${location.pathname === item.path ? 'sidebar-item-active' : ''}
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.disabled && (
                    <span className="ml-auto text-xs bg-gray-100 dark:bg-dark-700 px-2 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Storage Info */}
        <div className="p-4 border-t border-gray-100 dark:border-dark-800">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-800 dark:to-dark-800 rounded-xl p-4">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded mb-3" />
                <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded" />
              </div>
            ) : storageStats ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage</span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(storageStats.totalUsed)} / {formatFileSize(storageStats.storageLimit)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStorageColor(storageStats.usagePercentage).bar} rounded-full transition-all duration-300`}
                    style={{ width: `${storageStats.usagePercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    {storageStats.fileCount} files
                    {storageStats.trashCount > 0 && ` (${storageStats.trashCount} in trash)`}
                  </p>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {storageStats.usagePercentage.toFixed(1)}%
                  </p>
                </div>
              </>
            ) : (
              <div className="text-xs text-gray-500 text-center">Unable to load storage</div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
