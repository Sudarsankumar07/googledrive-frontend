import { createContext, useEffect, useMemo, useState } from 'react';

const IconContext = createContext(null);

export const IconProvider = ({ children }) => {
  const [materialSymbolsReady, setMaterialSymbolsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        if (!document?.fonts?.check) return;

        if (document.fonts.check('16px "Material Symbols Rounded"')) {
          if (!cancelled) setMaterialSymbolsReady(true);
          return;
        }

        await document.fonts.load('24px "Material Symbols Rounded"', 'cloud');
        const ok = document.fonts.check('16px "Material Symbols Rounded"');
        if (!cancelled) setMaterialSymbolsReady(ok);
      } catch {
        if (!cancelled) setMaterialSymbolsReady(false);
      }
    };

    check();
    const retry = setTimeout(check, 1500);

    return () => {
      cancelled = true;
      clearTimeout(retry);
    };
  }, []);

  const value = useMemo(() => ({ materialSymbolsReady }), [materialSymbolsReady]);

  return (
    <IconContext.Provider value={value}>
      {children}
    </IconContext.Provider>
  );
};

export default IconContext;

