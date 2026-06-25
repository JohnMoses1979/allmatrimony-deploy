import React, { createContext, useContext, useMemo } from "react";
import { staticTranslations } from "./staticTranslation";
import { useMatrimony } from "../context/MatrimonyContext";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { language, setLanguage } = useMatrimony();

  const t = useMemo(
    () => (key) => staticTranslations[language]?.[key] || staticTranslations.en?.[key] || key,
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  const { language, setLanguage } = useMatrimony();

  const t = useMemo(
    () => (key) => staticTranslations[language]?.[key] || staticTranslations.en?.[key] || key,
    [language]
  );

  return context || { language, setLanguage, t };
};