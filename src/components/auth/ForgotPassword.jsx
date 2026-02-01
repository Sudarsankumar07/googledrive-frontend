import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import AuthLayout from '../layout/AuthLayout';
import Input from '../common/Input';
import Button from '../common/Button';
import authService from '../../services/authService';
import { forgotPasswordSchema } from '../../utils/validators';

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await authService.forgotPassword(values.email);
      if (result.success) {
        setEmailSent(true);
        toast.success('Password reset link sent!');
      } else {
        toast.error(result.message || 'Failed to send reset link');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent you a password reset link"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          
          <p className="text-gray-600 dark:text-gray-400">
            If an account exists with that email, you'll receive a password reset link shortly.
          </p>

          <div className="pt-4 space-y-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setEmailSent(false)}
            >
              Try another email
            </Button>
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
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="No worries, we'll send you reset instructions"
    >
      <Formik
        initialValues={{ email: '' }}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
          <Form className="space-y-5">
            <Input
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
            />

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              className="py-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending link...
                </>
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default ForgotPassword;
