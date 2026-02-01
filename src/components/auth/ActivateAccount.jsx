import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../layout/AuthLayout';
import Button from '../common/Button';
import authService from '../../services/authService';

const ActivateAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const result = await authService.activateAccount(token);
        if (result.success) {
          setStatus('success');
          setMessage('Your account has been activated successfully!');
        } else {
          setStatus('error');
          setMessage(result.message || 'Failed to activate account');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Something went wrong');
      }
    };

    if (token) {
      activateAccount();
    } else {
      setStatus('error');
      setMessage('Invalid activation link');
    }
  }, [token]);

  if (status === 'loading') {
    return (
      <AuthLayout
        title="Activating account"
        subtitle="Please wait..."
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary-600 dark:text-primary-400 animate-spin" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Activating your account...
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (status === 'success') {
    return (
      <AuthLayout
        title="Account activated!"
        subtitle="You're all set"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-scale-in">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          
          <p className="text-gray-600 dark:text-gray-400">
            {message}
          </p>

          <div className="pt-4">
            <Button
              fullWidth
              onClick={() => navigate('/login')}
            >
              Continue to login
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Activation failed"
      subtitle="Something went wrong"
    >
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        
        <p className="text-gray-600 dark:text-gray-400">
          {message}
        </p>

        <div className="pt-4 space-y-3">
          <Link
            to="/register"
            className="block"
          >
            <Button fullWidth variant="secondary">
              Create new account
            </Button>
          </Link>
          <Link
            to="/login"
            className="block text-center text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
          >
            Back to login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ActivateAccount;
