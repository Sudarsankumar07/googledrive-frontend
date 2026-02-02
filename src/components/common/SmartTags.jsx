import { useMemo } from 'react';
import { Tag, X } from 'lucide-react';
import { generateFileTags } from '../../utils/fileUtils';

const SmartTags = ({ file, onTagClick, onTagRemove, className = '' }) => {
  const autoTags = useMemo(() => {
    if (!file) return [];
    return generateFileTags(file);
  }, [file]);
  
  // Combine auto-generated tags with any custom tags
  const allTags = [...autoTags, ...(file.customTags || [])];
  const uniqueTags = [...new Set(allTags)];

  const getTagColor = (tag) => {
    const colorMap = {
      // Size tags
      'small': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'medium': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'large': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      
      // Type tags
      'image': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'document': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
      'video': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
      'audio': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
      'archive': 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
      'text': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      
      // Time tags
      'today': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
      'recent': 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
      'old': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      
      // Content tags
      'photo': 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300'
    };
    
    return colorMap[tag.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  };

  if (!uniqueTags.length) return null;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {uniqueTags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)} cursor-pointer hover:opacity-80 transition-opacity`}
          onClick={() => onTagClick && onTagClick(tag)}
        >
          <Tag className="w-3 h-3" />
          {tag}
          {onTagRemove && file.customTags?.includes(tag) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTagRemove(tag);
              }}
              className="hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
    </div>
  );
};

export default SmartTags;