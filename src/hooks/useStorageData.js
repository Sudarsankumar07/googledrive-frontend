import { useMemo } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

/**
 * Shared hook for calculating storage statistics
 * Used by both StorageIndicator (dashboard) and Sidebar
 */
export const useStorageData = (files = [], totalSpaceLimit = 5 * 1024 * 1024 * 1024) => {
    return useMemo(() => {
        const usedSpace = files.reduce((sum, file) => sum + (file.size || 0), 0);
        const percentage = totalSpaceLimit > 0 ? (usedSpace / totalSpaceLimit) * 100 : 0;
        const remainingSpace = totalSpaceLimit - usedSpace;

        // Determine status
        let status = 'normal';
        let statusIcon = CheckCircle;
        let statusColor = 'text-green-500';
        let statusBg = 'bg-green-100 dark:bg-green-900';
        let message = 'You have plenty of storage space';

        if (percentage >= 90) {
            status = 'critical';
            statusIcon = AlertTriangle;
            statusColor = 'text-red-500';
            statusBg = 'bg-red-100 dark:bg-red-900';
            message = 'Storage almost full! Consider upgrading or cleaning up files';
        } else if (percentage >= 75) {
            status = 'warning';
            statusIcon = AlertTriangle;
            statusColor = 'text-amber-500';
            statusBg = 'bg-amber-100 dark:bg-amber-900';
            message = 'Storage getting full. Consider managing your files';
        } else if (percentage >= 50) {
            status = 'info';
            statusIcon = Info;
            statusColor = 'text-blue-500';
            statusBg = 'bg-blue-100 dark:bg-blue-900';
            message = 'You\'re using a moderate amount of storage';
        }

        return {
            usedSpace,
            totalSpaceLimit,
            remainingSpace,
            percentage: Math.min(percentage, 100),
            status,
            statusIcon,
            statusColor,
            statusBg,
            message
        };
    }, [files, totalSpaceLimit]);
};

/**
 * Get progress bar color based on percentage
 */
export const getProgressBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-amber-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-green-500';
};

/**
 * Get gradient progress bar color
 */
export const getProgressBarGradient = (percentage) => {
    if (percentage >= 90) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (percentage >= 75) return 'bg-gradient-to-r from-amber-500 to-amber-600';
    if (percentage >= 50) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    return 'bg-gradient-to-r from-primary-500 to-purple-500';
};
