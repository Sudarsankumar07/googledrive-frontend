import { useState, useEffect } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import fileService from '../../services/fileService';
import { useFiles } from '../../context/FileContext';
import FileList from './FileList';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import ConfirmDialog from '../common/ConfirmDialog';

const TrashView = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
    const { emptyTrash } = useFiles();

    useEffect(() => {
        loadTrashFiles();
    }, []);

    const loadTrashFiles = async () => {
        setLoading(true);
        try {
            const response = await fileService.getTrashFiles();
            if (response.success) {
                setFiles(response.data);
            }
        } catch (error) {
            toast.error('Failed to load trash');
        } finally {
            setLoading(false);
        }
    };

    const handleEmptyTrash = async () => {
        await emptyTrash();
        setShowEmptyConfirm(false);
        loadTrashFiles();
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Trash2 className="w-6 h-6 text-red-500" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Trash
                    </h1>
                </div>
                {files.length > 0 && (
                    <button
                        onClick={() => setShowEmptyConfirm(true)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Empty Trash
                    </button>
                )}
            </div>

            {files.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Items in trash will be automatically deleted after 30 days
                    </p>
                </div>
            )}

            {files.length === 0 ? (
                <EmptyState
                    icon={Trash2}
                    title="Trash is Empty"
                    message="Deleted files will appear here"
                />
            ) : (
                <FileList
                    files={files}
                    folders={[]}
                    onRefresh={loadTrashFiles}
                    isTrashView={true}
                />
            )}

            <ConfirmDialog
                isOpen={showEmptyConfirm}
                onClose={() => setShowEmptyConfirm(false)}
                onConfirm={handleEmptyTrash}
                title="Empty Trash"
                message={`Are you sure you want to permanently delete ${files.length} item(s)? This action cannot be undone.`}
                confirmText="Empty Trash"
                confirmVariant="danger"
            />
        </div>
    );
};

export default TrashView;
