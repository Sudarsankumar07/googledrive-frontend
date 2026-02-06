import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { User, Mail, Lock, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import AuthLayout from '../layout/AuthLayout';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { registerSchema } from '../../utils/validators';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password
      });

      if (result.success) {
        setRegistered(true);
        toast.success('Account created! Please check your email to activate.');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (registered) {
    return (
      <AuthLayout
        title="Check Your Email!"
        subtitle="Activation email sent"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-400">
              We've sent an activation link to your email address.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Please check your inbox and click the activation link to activate your account before logging in.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Don't forget to check your spam folder if you don't see the email.
            </p>
          </div>

          <div className="pt-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start storing your files securely"
    >
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                name="firstName"
                placeholder="John"
                icon={User}
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName && errors.firstName}
              />
              <Input
                label="Last name"
                name="lastName"
                placeholder="Doe"
                icon={User}
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.lastName && errors.lastName}
              />
            </div>

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

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && errors.password}
            />

            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && errors.confirmPassword}
            />

            {/* Password strength indicator */}
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full ${values.password.length >= level * 3
                        ? level <= 2
                          ? 'bg-red-500'
                          : level === 3
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        : 'bg-gray-200 dark:bg-dark-700'
                      }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Use 8+ characters with a mix of letters, numbers & symbols
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
                className="py-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default Register;
