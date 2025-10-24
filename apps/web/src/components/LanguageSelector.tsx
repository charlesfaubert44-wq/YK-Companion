'use client';

import { useState } from 'react';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = LANGUAGES.find(lang => lang.code === language) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-aurora-blue/50 transition-all text-sm"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="text-gray-300 hidden sm:inline">{currentLanguage.name}</span>
        <span className="text-gray-500 text-xs">▼</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-lg shadow-xl z-50 min-w-[200px] overflow-hidden">
            <div className="py-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-aurora-blue/10 transition-colors ${
                    language === lang.code ? 'bg-aurora-blue/20 text-aurora-blue' : 'text-gray-300'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                  {language === lang.code && (
                    <span className="ml-auto text-aurora-blue">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
