import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'cs' | 'uk';

export function localizeText(value: string, language: Language) {
  const [csText, ukText] = value.split(/\s*\/\s*/);
  return (language === 'cs' ? csText : ukText || csText).trim();
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (csText: string, ukText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('cs');

  useEffect(() => {
    const saved = localStorage.getItem('bobal-stav-lang') as Language;
    if (saved === 'cs' || saved === 'uk') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bobal-stav-lang', lang);
  };

  const t = (csText: string, ukText: string) => {
    return language === 'cs' ? csText : ukText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
