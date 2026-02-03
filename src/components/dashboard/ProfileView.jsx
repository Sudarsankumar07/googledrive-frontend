import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Mail, Save, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import Button from '../common/Button';
import Input from '../common/Input';

const ProfileView = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
  }, [user]);

  const initials = useMemo(() => {
    const first = user?.firstName?.charAt(0) || '';
    const last = user?.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  }, [user]);

  const createdAtLabel = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : '—';

  const handleSave = async () => {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (!trimmedFirst || !trimmedLast) {
      toast.error('First name and last name are required');
      return;
    }

    setSaving(true);
    try {
      const response = await authService.updateProfile({
        firstName: trimmedFirst,
        lastName: trimmedLast
      });

      if (response?.success) {
        toast.success('Profile updated');
        await checkAuth();
      } else {
        toast.error(response?.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
  };

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile summary */}
        <div className="card p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold shadow-lg shadow-primary-500/30">
              {initials || <User className="w-10 h-10" />}
            </div>
            <div className="mt-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-sm text-gray-500">{user?.email}</div>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="truncate">{user?.email || '—'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Joined {createdAtLabel}</span>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account details
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
            <Input
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </div>

          <div className="mt-4">
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              variant="primary"
              onClick={handleSave}
              loading={saving}
              icon={Save}
            >
              Save changes
            </Button>
            <Button
              variant="secondary"
              onClick={handleReset}
              disabled={saving}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

