import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Filter, X, File, Calendar, HardDrive, FileType } from 'lucide-react';
import Fuse from 'fuse.js';
import { filterFiles, getFileType } from '../../utils/fileUtils';

const AdvancedSearch = ({ files = [], onSearchResults = () => {}, className = '' }) => {
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    size: 'any',
    dateRange: 'any',
    extension: 'any'
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    if (!files || !files.length) return null;
    
    try {
      return new Fuse(files, {
        keys: [
          { name: 'name', weight: 0.8 },
          { name: 'tags', weight: 0.2 }
        ],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2
      });
    } catch (error) {
      console.error('Error initializing Fuse.js:', error);
      return null;
    }
  }, [files]);

  // Get unique extensions from files
  const availableExtensions = useMemo(() => {
    if (!files || !files.length) return [];
    
    const extensions = files
      .map(file => file.name ? file.name.split('.').pop()?.toLowerCase() : '')
      .filter(ext => ext && ext.length <= 5)
      .filter((ext, index, arr) => arr.indexOf(ext) === index)
      .sort();
    
    return extensions;
  }, [files]);

  // Generate search suggestions
  useEffect(() => {
    if (!query.trim() || !files || !files.length) {
      setSuggestions([]);
      return;
    }

    const queryLower = query.toLowerCase();
    const newSuggestions = [];

    // File name suggestions
    const nameMatches = files
      .filter(file => file.name && file.name.toLowerCase().includes(queryLower))
      .slice(0, 3)
      .map(file => ({
        type: 'file',
        text: file.name,
        icon: File
      }));

    // File type suggestions  
    const typeMatches = ['image', 'document', 'video', 'audio']
      .filter(type => type.includes(queryLower))
      .map(type => ({
        type: 'filter',
        text: `${type} files`,
        icon: FileType,
        filter: { type }
      }));

    // Extension suggestions
    const extMatches = availableExtensions
      .filter(ext => ext.includes(queryLower))
      .slice(0, 2)
      .map(ext => ({
        type: 'filter',
        text: `.${ext} files`,
        icon: FileType,
        filter: { extension: ext }
      }));

    newSuggestions.push(...nameMatches, ...typeMatches, ...extMatches);
    setSuggestions(newSuggestions.slice(0, 5));
  }, [query, files, availableExtensions]);

  // Perform search
  const searchResults = useMemo(() => {
    if (!files || !files.length) return [];

    let results = [...files];

    // Apply filters first
    results = filterFiles(results, filters);

    // Apply text search
    if (query.trim()) {
      if (fuse) {
        try {
          const fuseResults = fuse.search(query.trim());
          const searchedFiles = fuseResults.map(result => result.item);
          
          // Keep only filtered files that also match the search
          results = results.filter(file => 
            searchedFiles.some(searchedFile => searchedFile._id === file._id)
          );
        } catch (error) {
          console.error('Fuse search error:', error);
          // Fallback to simple string matching
          const queryLower = query.toLowerCase();
          results = results.filter(file =>
            file.name && file.name.toLowerCase().includes(queryLower)
          );
        }
      } else {
        // Fallback to simple string matching
        const queryLower = query.toLowerCase();
        results = results.filter(file =>
          file.name && file.name.toLowerCase().includes(queryLower)
        );
      }
    }

    return results;
  }, [files, query, filters, fuse]);

  // Update parent component with results
  useEffect(() => {
    if (onSearchResults && typeof onSearchResults === 'function') {
      onSearchResults(searchResults);
    }
  }, [searchResults, onSearchResults]);

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'file') {
      setQuery(suggestion.text);
    } else if (suggestion.type === 'filter') {
      setFilters(prev => ({ ...prev, ...suggestion.filter }));
      setQuery('');
    }
    setShowSuggestions(false);
    
    // Add to recent searches
    addToRecentSearches(suggestion.text);
  };

  // Add to recent searches
  const addToRecentSearches = (searchTerm) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(term => term !== searchTerm);
      return [searchTerm, ...filtered].slice(0, 5);
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setQuery('');
    setFilters({
      type: 'all',
      size: 'any',
      dateRange: 'any',
      extension: 'any'
    });
    setShowSuggestions(false);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== 'all' && value !== 'any') || query.trim();
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search files... (try typing file name or extension)"
            value={query}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(query.length > 0)}
            className="input pl-10 pr-20 w-full"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`btn-ghost p-2 ${isFilterOpen ? 'text-brand-500' : ''}`}
              title="Advanced Filters"
            >
              <Filter className="w-4 h-4" />
            </button>
            {hasActiveFilters() && (
              <button
                onClick={clearAllFilters}
                className="btn-ghost p-2 text-gray-400 hover:text-red-500"
                title="Clear All"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 shadow-lg overflow-hidden"
          >
            {suggestions.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 card">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-3"
                  >
                    <suggestion.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            )}
            
            {recentSearches.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                  Recent
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-3"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="mt-3 p-4 glass border border-white border-opacity-20 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* File Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileType className="w-4 h-4 inline mr-1" />
                File Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="input w-full text-sm"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="document">Documents</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="archive">Archives</option>
              </select>
            </div>

            {/* File Size Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <HardDrive className="w-4 h-4 inline mr-1" />
                File Size
              </label>
              <select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                className="input w-full text-sm"
              >
                <option value="any">Any Size</option>
                <option value="small">Small (&lt; 10MB)</option>
                <option value="medium">Medium (10MB - 100MB)</option>
                <option value="large">Large (&gt; 100MB)</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Upload Date
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="input w-full text-sm"
              >
                <option value="any">Any Date</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>

            {/* Extension Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <File className="w-4 h-4 inline mr-1" />
                Extension
              </label>
              <select
                value={filters.extension}
                onChange={(e) => handleFilterChange('extension', e.target.value)}
                className="input w-full text-sm"
              >
                <option value="any">Any Extension</option>
                {availableExtensions.map(ext => (
                  <option key={ext} value={ext}>.{ext}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              Showing {searchResults.length} of {files.length} files
            </div>
            {hasActiveFilters() && (
              <button
                onClick={clearAllFilters}
                className="text-brand-500 hover:text-brand-600 font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;