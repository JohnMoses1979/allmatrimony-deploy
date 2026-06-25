import React, {createContext, useContext, useMemo} from 'react';
import {useMatrimony} from './MatrimonyContext';

const VendorLanguageContext = createContext(null);

const normalizeVendorLanguage = language =>
  String(language || 'en').toLowerCase().startsWith('te') ? 'te' : 'en';

export function VendorLanguageProvider({children}) {
  const {language, setLanguage} = useMatrimony();
  const vendorLanguage = normalizeVendorLanguage(language);

  const setVendorLanguage = async nextLanguage => {
    const normalizedLanguage = normalizeVendorLanguage(nextLanguage);
    await setLanguage(normalizedLanguage);
    return normalizedLanguage;
  };

  const value = useMemo(
    () => ({vendorLanguage, setVendorLanguage}),
    [vendorLanguage, setLanguage],
  );

  return (
    <VendorLanguageContext.Provider value={value}>
      {children}
    </VendorLanguageContext.Provider>
  );
}

export function useVendorLanguage() {
  const context = useContext(VendorLanguageContext);

  if (!context) {
    throw new Error('useVendorLanguage must be used inside VendorLanguageProvider');
  }

  return context;
}

