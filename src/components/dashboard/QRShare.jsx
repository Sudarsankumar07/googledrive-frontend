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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="glass max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white border-opacity-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Quick Share</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Generate QR code for instant sharing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-2"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* File Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="font-medium text-gray-800 dark:text-white truncate">{file?.name}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                View Only
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                Download
              </span>
            </div>
          </div>

          {/* Expiry Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Link Expires In
            </label>
            <select
              value={expiryTime}
              onChange={(e) => setExpiryTime(e.target.value)}
              className="input w-full"
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
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
              {/* QR Code */}
              <div className="bg-white p-6 rounded-xl shadow-inner mx-auto w-fit">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 mx-auto" 
                />
              </div>

              {/* Share URL */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Expires in {expiryOptions.find(opt => opt.value === expiryTime)?.label}</span>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Share URL:</p>
                  <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                    {shareUrl}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={copyLink}
                  className={`btn-primary flex-1 flex items-center justify-center gap-2 ${
                    copied ? 'bg-green-500 hover:bg-green-600' : ''
                  }`}
                  disabled={copied}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                
                <button
                  onClick={regenerateQRCode}
                  className="btn-secondary px-4"
                  title="Regenerate QR Code"
                >
                  <Share2 className="w-4 h-4" />
                </button>
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
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">How to use:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
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