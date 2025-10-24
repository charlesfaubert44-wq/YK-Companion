'use client';

import { useState } from 'react';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

const LANGUAGES: { code: Language; name: string; flag: string; customFlag?: JSX.Element }[] = [
  { code: 'en', name: 'English', flag: '🇨🇦' },
  { code: 'fr', name: 'Français', flag: '', customFlag: <QuebecFlag /> },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
];

// Quebec Flag Component
function QuebecFlag() {
  return (
    <svg width="24" height="18" viewBox="0 0 900 600" className="inline-block">
      {/* Blue background */}
      <rect width="900" height="600" fill="#003D9F"/>
      {/* White cross */}
      <rect x="0" y="240" width="900" height="120" fill="white"/>
      <rect x="390" y="0" width="120" height="600" fill="white"/>
      {/* Fleur-de-lis in each quadrant */}
      <g transform="translate(225, 150) scale(0.8)">
        <path d="M 50,0 L 55,15 L 70,10 L 60,25 L 75,35 L 55,35 L 50,50 L 45,35 L 25,35 L 40,25 L 30,10 L 45,15 Z" fill="white"/>
      </g>
      <g transform="translate(575, 150) scale(0.8)">
        <path d="M 50,0 L 55,15 L 70,10 L 60,25 L 75,35 L 55,35 L 50,50 L 45,35 L 25,35 L 40,25 L 30,10 L 45,15 Z" fill="white"/>
      </g>
      <g transform="translate(225, 450) scale(0.8)">
        <path d="M 50,0 L 55,15 L 70,10 L 60,25 L 75,35 L 55,35 L 50,50 L 45,35 L 25,35 L 40,25 L 30,10 L 45,15 Z" fill="white"/>
      </g>
      <g transform="translate(575, 450) scale(0.8)">
        <path d="M 50,0 L 55,15 L 70,10 L 60,25 L 75,35 L 55,35 L 50,50 L 45,35 L 25,35 L 40,25 L 30,10 L 45,15 Z" fill="white"/>
      </g>
    </svg>
  );
}

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
        {currentLanguage.customFlag ? (
          <span className="text-xl">{currentLanguage.customFlag}</span>
        ) : (
          <span className="text-xl">{currentLanguage.flag}</span>
        )}
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
                  {lang.customFlag ? (
                    <span className="text-2xl">{lang.customFlag}</span>
                  ) : (
                    <span className="text-2xl">{lang.flag}</span>
                  )}
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
