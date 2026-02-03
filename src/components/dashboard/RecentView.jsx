import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import fileService from '../../services/fileService';
import FileList from './FileList';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';

const RecentView = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecentFiles();
    }, []);

    const loadRecentFiles = async () => {
        setLoading(true);
        try {
            const response = await fileService.getRecentFiles(50);
            if (response.success) {
                setFiles(response.data);
            }
        } catch (error) {
            toast.error('Failed to load recent files');
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
                icon={Clock}
                title="No Recent Files"
                message="Files you access will appear here"
            />
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-orange-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Recent Files
                </h1>
            </div>
            <FileList files={files} folders={[]} onRefresh={loadRecentFiles} />
        </div>
    );
};

export default RecentView;
