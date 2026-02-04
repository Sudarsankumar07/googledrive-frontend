import { useState, useEffect } from 'react';
import { Share2, Copy, Check, X, Clock, Eye, Download } from 'lucide-react';
import QRCode from 'qrcode';

const QRShare = ({ file, isOpen, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [expiryTime, setExpiryTime] = useState('24h');
  const [error, setError] = useState('');

  const expiryOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  useEffect(() => {
    if (isOpen && file && !qrCodeUrl) {
      generateQRCode();
    }
  }, [isOpen, file]);

  const generateQRCode = async () => {
    if (!file) return;

    setGenerating(true);
    setError('');

    try {
      // Generate a temporary share token (in production, this would come from your API)
      const shareToken = generateShareToken();
      const tempShareUrl = `${window.location.origin}/shared/${shareToken}`;
      
      setShareUrl(tempShareUrl);
      
      // Generate QR code
      const qrUrl = await QRCode.toDataURL(tempShareUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      
      setQrCodeUrl(qrUrl);
    } catch (err) {
      setError('Failed to generate QR code');
      console.error('QR code generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const generateShareToken = () => {
    // In production, this should call your API to create a secure share token
    return `${file._id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const copyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const regenerateQRCode = async () => {
    setQrCodeUrl('');
    setShareUrl('');
    await generateQRCode();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="glass max-w-md lg:max-w-3xl xl:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 lg:p-8 border-b border-white border-opacity-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary-500 rounded-full flex items-center justify-center">
              <Share2 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">Quick Share</h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400">Generate QR code for instant sharing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
            title="Close"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* File Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 lg:p-6 mb-6">
            <p className="text-base lg:text-lg font-medium text-gray-800 dark:text-white truncate">{file?.name}</p>
            <div className="flex items-center gap-4 mt-2 text-sm lg:text-base text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
                View Only
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                Download
              </span>
            </div>
          </div>

          {/* Expiry Selection */}
          <div className="mb-6">
            <label className="block text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
              Link Expires In
            </label>
            <select
              value={expiryTime}
              onChange={(e) => setExpiryTime(e.target.value)}
              className="input w-full text-sm lg:text-base"
            >
              {expiryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* QR Code Display */}
          {generating ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Generating QR code...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">{error}</div>
              <button onClick={regenerateQRCode} className="btn-secondary">
                Try Again
              </button>
            </div>
          ) : qrCodeUrl ? (
            <div className="space-y-6">
              {/* Desktop: Two-column layout, Mobile: Single column */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* QR Code */}
                <div className="flex justify-center items-start">
                  <div className="relative w-fit">
                    {/* Gradient Border */}
                    <div className="absolute -inset-1 lg:-inset-2 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                    <div className="relative bg-white dark:bg-gray-800 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl border-4 border-white dark:border-gray-700">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 mx-auto rounded-lg" 
                      />
                      {/* Decorative corners */}
                      <div className="absolute top-2 left-2 w-4 h-4 lg:w-6 lg:h-6 border-t-2 border-l-2 border-primary-500"></div>
                      <div className="absolute top-2 right-2 w-4 h-4 lg:w-6 lg:h-6 border-t-2 border-r-2 border-primary-500"></div>
                      <div className="absolute bottom-2 left-2 w-4 h-4 lg:w-6 lg:h-6 border-b-2 border-l-2 border-primary-500"></div>
                      <div className="absolute bottom-2 right-2 w-4 h-4 lg:w-6 lg:h-6 border-b-2 border-r-2 border-primary-500"></div>
                    </div>
                  </div>
                </div>

                {/* Share Info & Actions */}
                <div className="space-y-4 lg:space-y-6 flex flex-col justify-center">
                  {/* Share URL */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm lg:text-base text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>Expires in {expiryOptions.find(opt => opt.value === expiryTime)?.label}</span>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 lg:p-4">
                      <p className="text-xs lg:text-sm text-gray-500 mb-1">Share URL:</p>
                      <p className="text-xs sm:text-sm lg:text-base font-mono text-gray-800 dark:text-gray-200 break-all">
                        {shareUrl}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={copyLink}
                      className={`btn-primary flex-1 flex items-center justify-center gap-2 text-sm lg:text-base py-2 lg:py-3 ${
                        copied ? 'bg-green-500 hover:bg-green-600' : ''
                      }`}
                      disabled={copied}
                    >
                      {copied ? <Check className="w-4 h-4 lg:w-5 lg:h-5" /> : <Copy className="w-4 h-4 lg:w-5 lg:h-5" />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    
                    <button
                      onClick={regenerateQRCode}
                      className="btn-secondary px-4 lg:px-6 py-2 lg:py-3 flex items-center justify-center gap-2 text-sm lg:text-base"
                      title="Regenerate QR Code"
                    >
                      <Share2 className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span className="hidden sm:inline">Regenerate</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <button onClick={generateQRCode} className="btn-primary">
                Generate QR Code
              </button>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h4 className="text-base lg:text-lg font-medium text-blue-800 dark:text-blue-200 mb-2 lg:mb-3">How to use:</h4>
            <ul className="text-sm lg:text-base text-blue-700 dark:text-blue-300 space-y-1 lg:space-y-2">
              <li>• Scan QR code with any camera or QR reader</li>
              <li>• Share the link via messaging or email</li>
              <li>• Recipients can view and download the file</li>
              <li>• Link expires automatically for security</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRShare;
