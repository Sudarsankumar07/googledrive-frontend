import { useState } from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import Button from '../common/Button';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.deleteAccount(password);
      if (result.success) {
        toast.success('Account deleted successfully');
        logout();
        navigate('/login');
      } else {
        toast.error(result.message || 'Failed to delete account');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Delete Account Button */}
      <div className="p-6 border-t border-red-100 dark:border-red-900/20 bg-red-50 dark:bg-red-900/10 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Account
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              variant="danger"
              size="sm"
              className="mt-4"
              onClick={() => {
                setPassword('');
                setConfirmText('');
                setShowDialog(true);
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-dark-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Delete Account?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This cannot be undone
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Warning:</strong> Deleting your account will:
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1 ml-4">
                  <li>• Permanently delete all your files</li>
                  <li>• Remove all folders</li>
                  <li>• Clear all account data</li>
                </ul>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Confirmation Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type <strong>DELETE</strong> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="Type DELETE"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-dark-700 flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowDialog(false);
                  setPassword('');
                  setConfirmText('');
                }}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteAccount}
                disabled={loading || confirmText !== 'DELETE' || !password}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccount;
