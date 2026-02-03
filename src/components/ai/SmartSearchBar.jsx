import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Folder, File as FileIcon, ArrowUpRight } from 'lucide-react';
import aiService from '../../services/aiService';
import { useFiles } from '../../context/FileContext';

const SmartSearchBar = ({ className = '' }) => {
  const navigate = useNavigate();
  const { currentFolder, navigateToFolder } = useFiles();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const runSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    try {
      const response = await aiService.smartSearch({
        query: q,
        context: { currentFolder: currentFolder?._id || null },
      });
      if (response?.success) {
        setResults(response?.data?.results || []);
        setOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (item) => {
    setOpen(false);
    setQuery('');
    navigate('/dashboard');
    if (item.type === 'folder') {
      await navigateToFolder(item.id);
    } else {
      await navigateToFolder(item.parentId || null, item.id);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="card p-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Smart Search (AI)
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value) {
                setOpen(false);
                setResults([]);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                runSearch();
              }
            }}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Try: “Find files about invoices from January”"
            className="input !pl-11 pr-24 w-full"
          />
          <button
            type="button"
            onClick={runSearch}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary px-3 py-2 rounded-xl text-sm disabled:opacity-50"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700 max-h-80 overflow-y-auto z-20">
          {results.slice(0, 10).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 text-left transition-colors group"
              title={item.path || item.name}
            >
              <div className="flex-shrink-0">
                {item.type === 'folder' ? (
                  <Folder className="w-5 h-5 text-blue-500" />
                ) : (
                  <FileIcon className="w-5 h-5 text-gray-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                  {item.name}
                </p>
                {item.summary && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {item.summary}
                  </p>
                )}
              </div>

              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSearchBar;

