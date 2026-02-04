import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AppIcon from './Icon';

const PageHeader = ({
  title,
  subtitle,
  iconSymbol,
  iconFallback,
  backTo,
  actions,
}) => {
  const navigate = useNavigate();
  const IconFallback = iconFallback;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        {backTo && (
          <button
            type="button"
            onClick={() => navigate(backTo)}
            className="btn-ghost p-2 rounded-xl"
            title="Back"
          >
            <AppIcon symbol="arrow_back" fallback={ArrowLeft} size={20} />
          </button>
        )}

        <div className="flex items-start gap-3">
          {(iconSymbol || IconFallback) && (
            <div className="mt-0.5 w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100/80 dark:border-primary-900/30 flex items-center justify-center">
              <AppIcon
                symbol={iconSymbol}
                fallback={IconFallback}
                size={20}
                className="text-primary-700 dark:text-primary-400"
                aria-label=""
              />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {actions ? (
        <div className="flex items-center gap-2 sm:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  );
};

export default PageHeader;

