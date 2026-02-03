import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';

const SettingsView = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="btn-ghost p-2 rounded-xl"
          title="Back to Drive"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appearance */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h2>

          <div className="flex items-center justify-between gap-4 py-2">
            <div className="min-w-0">
              <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                Dark mode
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Toggle the interface theme
              </div>
            </div>

            <button
              type="button"
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-dark-700'
                }`}
              aria-pressed={darkMode}
              title="Toggle dark mode"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account
          </h2>

          <div className="flex items-center justify-between gap-4 py-2">
            <div className="min-w-0">
              <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                View and update your account details
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/dashboard/profile')}
            >
              Open
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

