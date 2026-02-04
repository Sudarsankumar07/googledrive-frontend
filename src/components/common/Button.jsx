import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20 hover:shadow-xl focus:ring-primary-500',
    secondary: 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 focus:ring-gray-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 focus:ring-emerald-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
