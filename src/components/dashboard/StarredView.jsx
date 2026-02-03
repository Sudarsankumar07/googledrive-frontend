import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';
import fileService from '../../services/fileService';
import FileList from './FileList';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';

const StarredView = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStarredFiles();
    }, []);

    const loadStarredFiles = async () => {
        setLoading(true);
        try {
            const response = await fileService.getStarredFiles();
            if (response.success) {
                setFiles(response.data);
            }
        } catch (error) {
            toast.error('Failed to load starred files');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (files.length === 0) {
        return (
            <EmptyState
                icon={Star}
                title="No Starred Files"
                message="Star important files for quick access"
            />
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-yellow-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Starred Files
                </h1>
            </div>
            <FileList files={files} folders={[]} onRefresh={loadStarredFiles} />
        </div>
    );
};

export default StarredView;
