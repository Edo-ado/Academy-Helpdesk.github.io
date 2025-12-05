import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const languages = [
    { code: 'es', name: t('common.spanish'), flag: '🇪🇸' },
    { code: 'en', name: t('common.english'), flag: '🇺🇸' },
     { code: 'ht', name: t('common.Haitiano'), flag: 'ht' },
     { code: 'sm', name: t('common.Simlish'), flag: 'sm' },
      { code: 'hi', name: t('common.Hindu'), flag: 'hi' },
    { code: 'ad', name: t('common.Andaluz'), flag: 'ad' },
  ];

  const handleLanguageChange = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm font-medium"
        title={t('common.language')}
      >
        <FontAwesomeIcon icon={faGlobe} className="text-lg" />
        <span className="uppercase font-bold">{currentLanguage}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition ${
                currentLanguage === lang.code
                  ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
              {currentLanguage === lang.code && (
                <span className="ml-auto">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
