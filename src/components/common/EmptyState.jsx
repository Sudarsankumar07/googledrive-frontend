import { FolderOpen, FileX, Search, Upload } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
  type = 'empty', 
  title, 
  description,
  message,
  icon: CustomIcon,
  action, 
  onAction 
}) => {
  const icons = {
    empty: FolderOpen,
    noResults: Search,
    noFiles: FileX,
    upload: Upload,
  };

  const Icon = CustomIcon || icons[type] || icons.empty;

  const defaultContent = {
    empty: {
      title: 'No files or folders',
      description: 'This folder is empty. Upload files or create a folder to get started.',
    },
    noResults: {
      title: 'No results found',
      description: 'Try adjusting your search to find what you\'re looking for.',
    },
    noFiles: {
      title: 'No files yet',
      description: 'Upload your first file to get started.',
    },
  };

  const content = defaultContent[type] || defaultContent.empty;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-900/10 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title || content.title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        {description || message || content.description}
      </p>
      {action && onAction && (
        <Button onClick={onAction} icon={Upload}>
          {action}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
