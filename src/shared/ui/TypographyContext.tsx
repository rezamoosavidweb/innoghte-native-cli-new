import * as React from 'react';

import i18n from '@/shared/infra/i18n';

export type TypographyContextValue = {
  locale: string;
};

export const TypographyContext = React.createContext<TypographyContextValue>({
  locale: i18n.language ?? 'fa',
});

export function TypographyProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState(
    () => i18n.resolvedLanguage ?? i18n.language ?? 'fa',
  );

  React.useEffect(() => {
    const sync = () => setLocale(i18n.resolvedLanguage ?? i18n.language);

    sync();
    i18n.on('initialized', sync);
    i18n.on('languageChanged', sync);

    return () => {
      i18n.off('initialized', sync);
      i18n.off('languageChanged', sync);
    };
  }, []);

  const value = React.useMemo(() => ({ locale }), [locale]);

  return <TypographyContext.Provider value={value}>{children}</TypographyContext.Provider>;
}

export function useTypographyLocale(): TypographyContextValue {
  return React.useContext(TypographyContext);
}
