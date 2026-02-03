import { useState, useEffect } from 'react';
import fileService from '../services/fileService';

/**
 * Hook to fetch accurate storage statistics from backend
 * This ensures we count ALL user files, not just current folder
 * 
 * @param {boolean} autoRefresh - Whether to auto-refresh every 30 seconds
 * @returns {Object} { storageStats, loading, error, refresh }
 */
export const useStorageStats = (autoRefresh = false) => {
    const [storageStats, setStorageStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStorageStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fileService.getStorageStats();

            if (response.success) {
                setStorageStats(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch storage stats:', err);
            setError(err);
            // Set default empty state on error
            setStorageStats({
                totalUsed: 0,
                activeStorage: 0,
                trashStorage: 0,
                storageLimit: 5 * 1024 * 1024 * 1024, // 5GB
                usagePercentage: 0,
                fileCount: 0,
                trashCount: 0
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStorageStats();

        // Auto-refresh if enabled
        if (autoRefresh) {
            const interval = setInterval(fetchStorageStats, 30000); // Every 30 seconds
            return () => clearInterval(interval);
        }
    }, [autoRefresh]);

    return {
        storageStats,
        loading,
        error,
        refresh: fetchStorageStats
    };
};

/**
 * Helper function to get progress bar color based on backend stats
 */
export const getStorageColor = (percentage) => {
    if (percentage >= 90) return {
        bar: 'bg-gradient-to-r from-red-500 to-red-600',
        text: 'text-red-500',
        bg: 'bg-red-100 dark:bg-red-900'
    };
    if (percentage >= 75) return {
        bar: 'bg-gradient-to-r from-amber-500 to-amber-600',
        text: 'text-amber-500',
        bg: 'bg-amber-100 dark:bg-amber-900'
    };
    if (percentage >= 50) return {
        bar: 'bg-gradient-to-r from-blue-500 to-blue-600',
        text: 'text-blue-500',
        bg: 'bg-blue-100 dark:bg-blue-900'
    };
    return {
        bar: 'bg-gradient-to-r from-primary-500 to-purple-500',
        text: 'text-green-500',
        bg: 'bg-green-100 dark:bg-green-900'
    };
};
