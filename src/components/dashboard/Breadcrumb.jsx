import { ChevronRight, Home } from 'lucide-react';
import { useFiles } from '../../context/FileContext';

const Breadcrumb = () => {
  const { folderPath, setCurrentFolder } = useFiles();

  const handleNavigate = (folder) => {
    setCurrentFolder(folder);
  };

  return (
    <nav className="flex items-center gap-1 text-sm overflow-x-auto pb-2">
      <button
        onClick={() => handleNavigate(null)}
        className="flex items-center gap-1 px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors whitespace-nowrap"
      >
        <Home className="w-4 h-4" />
        <span>My Drive</span>
      </button>

      {folderPath.map((folder, index) => (
        <div key={folder._id} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <button
            onClick={() => handleNavigate(folder)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              index === folderPath.length - 1
                ? 'text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-dark-800'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-800'
            }`}
          >
            {folder.name}
          </button>
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
