import { useContext } from 'react';
import IconContext from '../../context/IconContext';

const AppIcon = ({
  symbol,
  fallback: Fallback,
  size = 20,
  className = '',
  title,
  'aria-label': ariaLabel,
  ...props
}) => {
  const ctx = useContext(IconContext);
  const materialSymbolsReady = Boolean(ctx?.materialSymbolsReady);

  const ariaHidden = ariaLabel ? undefined : true;

  if (symbol && materialSymbolsReady) {
    return (
      <span
        className={`material-symbols-rounded ${className}`}
        style={{ fontSize: size }}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        title={title}
        {...props}
      >
        {symbol}
      </span>
    );
  }

  if (Fallback) {
    return (
      <Fallback
        size={size}
        className={className}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        title={title}
        {...props}
      />
    );
  }

  return null;
};

export default AppIcon;

