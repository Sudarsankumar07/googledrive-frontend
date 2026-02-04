import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Cloud, FileUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { useFiles } from '../../context/FileContext';
import fileService from '../../services/fileService';

const UploadDropzone = ({ children }) => {
  const { currentFolder, refreshFiles, setUploadProgress, setIsUploading } = useFiles();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    const totalFiles = acceptedFiles.length;
    let uploadedCount = 0;

    for (const file of acceptedFiles) {
      try {
        setUploadProgress({
          current: uploadedCount + 1,
          total: totalFiles,
          fileName: file.name,
          percentage: 0
        });

        const result = await fileService.uploadFile(
          file,
          currentFolder?._id || null,
          (progress) => {
            setUploadProgress(prev => ({
              ...prev,
              percentage: progress
            }));
          }
        );

        if (result.success) {
          uploadedCount++;
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      } catch (error) {
        toast.error(`Error uploading ${file.name}`);
      }
    }

    setIsUploading(false);
    setUploadProgress(null);

    if (uploadedCount > 0) {
      toast.success(`${uploadedCount} file${uploadedCount > 1 ? 's' : ''} uploaded successfully!`);
      refreshFiles();
    }
  }, [currentFolder, refreshFiles, setUploadProgress, setIsUploading]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });

  return (
    <div
      {...getRootProps()}
      className="relative min-h-[calc(100vh-12rem)]"
    >
      <input {...getInputProps()} />
      
      {/* Drag overlay */}
      {isDragActive && (
        <div className="fixed inset-0 z-50 bg-primary-500/10 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-dark-800 rounded-3xl p-12 shadow-2xl border-2 border-dashed border-primary-400 m-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center animate-bounce">
                <Cloud className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Drop files to upload
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Files will be uploaded to the current folder
              </p>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default UploadDropzone;
