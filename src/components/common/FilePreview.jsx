import { useState, useEffect } from 'react';
import { X, Download, Eye, ZoomIn, ZoomOut } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { isImageFile, isTextFile, getFileType } from '../../utils/fileUtils';
import fileService from '../../services/fileService';

const FilePreview = ({ file, onClose, isOpen }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [textContent, setTextContent] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    if (!isOpen || !file) return;

    setLoading(true);
    setError(null);
    setImageZoom(1);
    setDownloadUrl(null);

    // Fetch download URL first
    fetchDownloadUrl();
  }, [isOpen, file]);

  const fetchDownloadUrl = async () => {
    try {
      const result = await fileService.downloadFile(file._id);
      if (result.success && result.data.downloadUrl) {
        setDownloadUrl(result.data.downloadUrl);

        // Load text content if it's a text file
        if (isTextFile(file.mimeType, file.name)) {
          fetchTextContent(result.data.downloadUrl);
        } else {
          setLoading(false);
        }
      } else {
        setError('Failed to get download URL');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load file');
      setLoading(false);
    }
  };

  const fetchTextContent = async (url) => {
    try {
      const response = await fetch(url);
      const content = await response.text();
      setTextContent(content.slice(0, 5000)); // Limit to first 5000 chars for preview
    } catch (err) {
      setError('Failed to load file content');
      console.error('Error fetching text content:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageFromFilename = (filename) => {
    if (!filename) return 'text';

    const extension = filename.split('.').pop()?.toLowerCase();
    const langMap = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'css': 'css',
      'html': 'html',
      'xml': 'xml',
      'json': 'json',
      'yml': 'yaml',
      'yaml': 'yaml',
      'md': 'markdown',
      'sql': 'sql',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust'
    };

    return langMap[extension] || 'text';
  };

  const renderImagePreview = () => (
    <div className="relative flex items-center justify-center min-h-[300px]">
      <img
        src={downloadUrl || '/placeholder.png'}
        alt={file.name}
        style={{ transform: `scale(${imageZoom})` }}
        className="max-h-[70vh] max-w-full object-contain transition-transform duration-200"
        onLoad={() => setLoading(false)}
        onError={(e) => {
          setError('Failed to load image');
          setLoading(false);
        }}
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setImageZoom(Math.min(imageZoom + 0.2, 3))}
          className="btn-ghost p-2 bg-black bg-opacity-50 text-white rounded-full"
          disabled={imageZoom >= 3}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setImageZoom(Math.max(imageZoom - 0.2, 0.5))}
          className="btn-ghost p-2 bg-black bg-opacity-50 text-white rounded-full"
          disabled={imageZoom <= 0.5}
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderTextPreview = () => {
    const language = getLanguageFromFilename(file.name);

    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border-b">
          {file.name} - {language.toUpperCase()}
        </div>
        <div className="max-h-96 overflow-auto">
          <SyntaxHighlighter
            language={language}
            style={tomorrow}
            customStyle={{
              margin: 0,
              background: 'transparent',
              fontSize: '14px'
            }}
            showLineNumbers={true}
          >
            {textContent || 'Loading content...'}
          </SyntaxHighlighter>
        </div>
        {textContent.length >= 5000 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm">
            Preview truncated. Download file to view complete content.
          </div>
        )}
      </div>
    );
  };

  const renderDefaultPreview = () => {
    const fileType = getFileType(file.mimeType);

    return (
      <div className="text-center py-16">
        <Eye className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 mb-2">Preview not available for this file type</p>
        <p className="text-sm text-gray-400">
          {fileType.charAt(0).toUpperCase() + fileType.slice(1)} file • {file.name}
        </p>
        <button
          onClick={() => {
            if (downloadUrl) {
              window.open(downloadUrl, '_blank');
            } else {
              setError('Download URL not available');
            }
          }}
          className="btn-primary mt-4"
        >
          Open in New Tab
        </button>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16">
          <div className="text-red-500 mb-4">{error}</div>
          <button onClick={() => {
            setError(null);
            setLoading(true);
            fetchDownloadUrl();
          }} className="btn-secondary">
            Retry
          </button>
        </div>
      );
    }

    if (isImageFile(file.mimeType)) {
      return renderImagePreview();
    }

    if (isTextFile(file.mimeType, file.name)) {
      return renderTextPreview();
    }

    return renderDefaultPreview();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="glass max-w-6xl max-h-[90vh] w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white border-opacity-20">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {file.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getFileType(file.mimeType)} • {new Date(file.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => {
                if (downloadUrl) {
                  window.open(downloadUrl, '_blank');
                } else {
                  setError('Download URL not available');
                }
              }}
              className="btn-ghost p-2"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="btn-ghost p-2"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;