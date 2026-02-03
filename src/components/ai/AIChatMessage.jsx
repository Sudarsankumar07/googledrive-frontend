import { useNavigate } from 'react-router-dom';
import { FileText, Folder, ArrowUpRight } from 'lucide-react';
import { useFiles } from '../../context/FileContext';

const AIChatMessage = ({ message }) => {
  const navigate = useNavigate();
  const { navigateToFolder } = useFiles();
  const isUser = message.role === 'user';

  const handleOpenRelated = async (item) => {
    navigate('/dashboard');
    if (item.type === 'folder') {
      await navigateToFolder(item.id);
    } else {
      await navigateToFolder(item.parentId || null, item.id);
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${isUser
          ? 'bg-primary-600 text-white'
          : 'bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-dark-700'
          }`}
      >
        {message.content}

        {!isUser && Array.isArray(message.relatedFiles) && message.relatedFiles.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-700 space-y-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Related files
            </div>
            <div className="space-y-1">
              {message.relatedFiles.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleOpenRelated(item)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors text-left"
                  title={item.path || item.name}
                >
                  {item.type === 'folder' ? (
                    <Folder className="w-4 h-4 text-blue-500" />
                  ) : (
                    <FileText className="w-4 h-4 text-gray-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {item.name}
                    </div>
                    {item.path && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.path}
                      </div>
                    )}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatMessage;

