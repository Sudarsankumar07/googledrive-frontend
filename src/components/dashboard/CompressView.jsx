import { useMemo, useState } from 'react';
import { Archive, UploadCloud } from 'lucide-react';
import { toast } from 'react-toastify';
import { useFiles } from '../../context/FileContext';
import Button from '../common/Button';
import compressionService from '../../services/compressionService';

const CompressView = () => {
  const { currentFolder, refreshFiles } = useFiles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [format, setFormat] = useState('gzip');
  const [level, setLevel] = useState(6);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);

  const parentId = useMemo(() => currentFolder?._id || null, [currentFolder]);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please choose a file');
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const result = await compressionService.upload(
        { file: selectedFile, parentId, format, level },
        (p) => setProgress(p)
      );

      if (result?.success) {
        toast.success('Uploaded and stored compressed');
        setSelectedFile(null);
        setProgress(null);
        await refreshFiles();
      } else {
        toast.error(result?.message || 'Compression upload failed');
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Compression upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Archive className="w-7 h-7 text-primary-500" />
            Compress Upload
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Upload a file and store it compressed in the cloud. Downloads auto-decompress.
          </p>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Choose file</div>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-700 dark:text-gray-200"
          />
          {selectedFile && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Selected: {selectedFile.name} ({Math.round((selectedFile.size / 1024) * 10) / 10} KB)
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Format</div>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="input"
              disabled={uploading}
            >
              <option value="gzip">GZIP</option>
            </select>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              GZIP is stream-friendly and enables automatic decompression on download.
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Compression level (GZIP)
            </div>
            <input
              type="range"
              min={0}
              max={9}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              disabled={uploading}
              className="w-full"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Level: {level}</div>
          </div>
        </div>

        {typeof progress === 'number' && (
          <div className="space-y-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">Uploading: {progress}%</div>
            <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleUpload}
            loading={uploading}
            disabled={!selectedFile || uploading}
            icon={UploadCloud}
          >
            Upload Compressed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompressView;
