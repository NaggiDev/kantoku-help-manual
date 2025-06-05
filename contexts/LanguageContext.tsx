'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Import all translation files
import enMessages from '@/messages/en.json';
import jaMessages from '@/messages/ja.json';
import viMessages from '@/messages/vi.json';

type Locale = 'en' | 'ja' | 'vi';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, section?: string) => string;
}

const messages = {
  en: enMessages,
  ja: jaMessages,
  vi: viMessages,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ja');
  const [mounted, setMounted] = useState(false);

  // Load saved language preference on mount
  useEffect(() => {
    setMounted(true);

    const initializeLanguage = () => {
      try {
        const savedLocale = localStorage.getItem('kantoku-locale') as Locale;
        if (savedLocale && ['en', 'ja', 'vi'].includes(savedLocale)) {
          setLocaleState(savedLocale);
        } else {
          // Detect browser language, default to Japanese
          const browserLang = navigator.language.split('-')[0];
          if (['en', 'vi'].includes(browserLang)) {
            setLocaleState(browserLang as Locale);
          }
          // If not en or vi, keep default 'ja'
        }
      } catch (error) {
        // Fallback to Japanese if localStorage/navigator is not available
        console.warn('Failed to initialize language preference:', error);
      }
    };

    initializeLanguage();
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('kantoku-locale', newLocale);
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  };

  // Translation function
  const t = (key: string, section?: string): string => {
    const currentMessages = messages[locale];
    
    if (section) {
      // Handle nested keys like t('title', 'homepage')
      const sectionMessages = currentMessages[section as keyof typeof currentMessages];
      if (sectionMessages && typeof sectionMessages === 'object') {
        const value = sectionMessages[key as keyof typeof sectionMessages];
        if (typeof value === 'string') return value;
      }
    } else {
      // Handle dot notation like t('homepage.title')
      const keys = key.split('.');
      let value: any = currentMessages;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          value = undefined;
          break;
        }
      }
      
      if (typeof value === 'string') return value;
    }
    
    // Fallback to Japanese if translation not found
    if (locale !== 'ja') {
      const japaneseMessages = messages.ja;
      if (section) {
        const sectionMessages = japaneseMessages[section as keyof typeof japaneseMessages];
        if (sectionMessages && typeof sectionMessages === 'object') {
          const value = sectionMessages[key as keyof typeof sectionMessages];
          if (typeof value === 'string') return value;
        }
      } else {
        const keys = key.split('.');
        let value: any = japaneseMessages;
        
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            value = undefined;
            break;
          }
        }
        
        if (typeof value === 'string') return value;
      }
    }
    
    // Return key if no translation found
    return key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
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
