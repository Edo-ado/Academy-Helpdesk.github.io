import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('language') || 'es'
  );

  // Cambiar el idioma
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    localStorage.setItem('language', lng);
  };

  // Sincronizar con i18n cuando cambia
  useEffect(() => {
    const savedLng = localStorage.getItem('language') || 'es';
    if (i18n.language !== savedLng) {
      i18n.changeLanguage(savedLng);
      setCurrentLanguage(savedLng);
    }
  }, [i18n]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe usarse dentro de LanguageProvider');
  }
  return context;
}
