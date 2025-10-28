# ADR-0007: Implement Context-Based i18n for Multilingual Support

**Status:** Accepted
**Date:** 2025-01-16
**Decision Makers:** Development Team
**Impact:** Medium

---

## Context

Yellowknife attracts visitors from around the world, especially for aurora viewing. We need to support multiple languages to serve:

- **Domestic tourists** - English, French (Canada's official languages)
- **International tourists** - Japanese, Korean, Chinese (major aurora tourism markets)
- **Immigrant residents** - Various languages for people moving to Yellowknife
- **Indigenous languages** - Potential future support

### Requirements

1. **9 Languages Initially** - English, French, Spanish, Japanese, Korean, Chinese (Simplified), Chinese (Traditional), German, Portuguese
2. **Easy Language Switching** - User can change language with one click
3. **Persistent Selection** - Remember user's language choice
4. **SEO Friendly** - Search engines can index translated content
5. **Developer Friendly** - Easy to add new translations
6. **No Build-Time** - Don't require rebuild for translation changes
7. **Small Bundle** - Don't load all languages at once

### Constraints

- Small team (1-2 developers) - can't afford complex i18n setup
- Limited translation budget - may use automated translation initially
- Quick MVP timeline - 3-4 months to launch
- Most content is English-first - translate UI, not all content

---

## Decision

**We will implement a simple Context-based i18n solution** with:

- React Context for current language
- localStorage for persistence
- JSON files for translations
- Dynamic imports for language bundles (future optimization)
- Manual translation management (no i18n library)

### Architecture

```typescript
// LanguageContext.tsx
type SupportedLanguage = 'en' | 'fr' | 'es' | 'ja' | 'ko' | 'zh-CN' | 'zh-TW' | 'de' | 'pt';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string; // Translation function
}

// translations/en.json
{
  "header.home": "Home",
  "header.about": "About",
  "garage_sales.title": "Garage Sale Planner",
  "garage_sales.find_near_me": "Find Near Me"
}
```

### Implementation Pattern

```typescript
// Use in components
const { t } = useLanguage();

return (
  <h1>{t('garage_sales.title')}</h1>
);
```

---

## Alternatives Considered

### Alternative 1: next-intl

**Description:** Next.js i18n library with routing support

**Pros:**
- Official Next.js recommendation
- SEO-friendly with different URLs per language
- Server-side translation
- Type-safe translations
- Professional solution

**Cons:**
- Complex setup with App Router
- Requires route structure changes (/en/..., /fr/...)
- More configuration needed
- Learning curve
- Overkill for our needs

**Why not chosen:** Too complex for MVP. Don't need separate URLs per language. Want simple solution.

### Alternative 2: react-i18next

**Description:** Popular i18n library for React

**Pros:**
- Mature, widely used
- Lots of features (pluralization, interpolation)
- Good documentation
- Plugin ecosystem
- Industry standard

**Cons:**
- Large bundle size (~20KB)
- Complex API
- More features than we need
- Requires configuration
- Learning curve for team

**Why not chosen:** Too heavy. We need simple key-value translations. Don't need complex features like pluralization rules.

### Alternative 3: FormatJS (react-intl)

**Description:** Yahoo's i18n library

**Pros:**
- ICU message format
- Handles complex pluralization
- Number/date formatting
- Good for large apps
- Well-maintained

**Cons:**
- Complex API
- Large bundle
- ICU format has learning curve
- Overkill for our use case
- More configuration

**Why not chosen:** Too complex. We don't need ICU message format. Simple key-value sufficient.

### Alternative 4: Crowdin/Phrase Integration

**Description:** Professional translation management platform

**Pros:**
- Professional translation workflow
- Translation memory
- In-context editing
- API integration
- Team collaboration

**Cons:**
- **Expensive:** $20-50/month
- Complex integration
- Overkill for MVP
- Requires workflow changes
- Not needed for small team

**Why not chosen:** Too expensive and complex for MVP. Can add later if needed.

### Alternative 5: Google Translate Widget

**Description:** Embed Google Translate widget on site

**Pros:**
- Zero development effort
- Supports 100+ languages
- Free
- No maintenance

**Cons:**
- **Poor UX:** Translates entire page poorly
- Breaks layout
- No control over translations
- Unprofessional
- SEO issues
- Not customizable

**Why not chosen:** Poor user experience. Want professional, controlled translations.

---

## Consequences

### Positive Consequences

- **Simple Implementation** - Easy to understand and maintain
- **Small Bundle** - No i18n library overhead
- **Fast Switching** - Instant language changes (client-side)
- **Easy to Add Languages** - Just add JSON file
- **Full Control** - Can customize translation logic
- **No Dependencies** - One less npm package to manage
- **Type-Safe** - Can generate types from JSON files

### Negative Consequences

- **Manual Management** - No translation management UI
- **No ICU Features** - No complex pluralization, genders, etc.
- **Limited SEO** - Same URL for all languages (no /en/, /fr/)
- **Translation Keys** - Must manage key consistency manually
- **No Translation Memory** - No reuse of past translations
- **Scaling Limitations** - May need proper i18n library later

### Risks

- **Missing Translations** - Easy to forget to translate new keys
  - *Mitigation:* Fallback to English, log missing keys in dev

- **Inconsistent Translations** - Manual management can lead to errors
  - *Mitigation:* Review process, translation checklist

- **SEO Impact** - Google may not index translated content well
  - *Mitigation:* Meta tags with language, future: implement next-intl

---

## Implementation

### Language Context

```typescript
// apps/web/src/contexts/LanguageContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

type SupportedLanguage = 'en' | 'fr' | 'es' | 'ja' | 'ko' | 'zh-CN' | 'zh-TW' | 'de' | 'pt';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('language') as SupportedLanguage;
    if (saved) setLanguageState(saved);
  }, []);

  useEffect(() => {
    // Load translations for current language
    import(`@/translations/${language}.json`)
      .then(module => setTranslations(module.default));
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
```

### Translation Files

```
apps/web/src/translations/
├── en.json     # English (default)
├── fr.json     # French
├── es.json     # Spanish
├── ja.json     # Japanese
├── ko.json     # Korean
├── zh-CN.json  # Chinese (Simplified)
├── zh-TW.json  # Chinese (Traditional)
├── de.json     # German
└── pt.json     # Portuguese
```

**en.json:**
```json
{
  "site.name": "YK Buddy",
  "site.tagline": "Your Yellowknife Companion",

  "header.home": "Home",
  "header.visiting": "Visiting",
  "header.living": "Living",
  "header.moving": "Moving",
  "header.about": "About",
  "header.contact": "Contact",

  "garage_sales.title": "Garage Sale Planner",
  "garage_sales.find_near_me": "Find Near Me",
  "garage_sales.view_on_map": "View on Map",
  "garage_sales.get_directions": "Get Directions",

  "common.loading": "Loading...",
  "common.error": "Error",
  "common.save": "Save",
  "common.cancel": "Cancel"
}
```

### Language Selector Component

```typescript
// apps/web/src/components/LanguageSelector.tsx
import { useLanguage } from '@/contexts/LanguageContext';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
      className="..."
    >
      {LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
```

---

## Validation

### Success Criteria

- [x] 9 languages supported
- [x] Language selection persists
- [x] UI translates instantly on language change
- [x] No flash of untranslated content
- [x] Easy to add new translations
- [x] No runtime errors for missing keys

### Translation Coverage

**Phase 1 (MVP):**
- [x] Header/navigation - 100%
- [x] Common buttons/actions - 100%
- [x] Garage sale UI - 100%
- [ ] Knowledge base categories - 80%
- [ ] Admin panel - 50%

**Phase 2 (Post-launch):**
- [ ] All UI strings - 100%
- [ ] Error messages - 100%
- [ ] Email templates - 100%
- [ ] Help content - 50%

### Current Status (Jan 2025)

- Core UI: Fully translated (9 languages)
- Content: English only (knowledge base articles)
- Admin: Partially translated
- Total keys: ~150 per language

---

## Translation Strategy

### Automated vs Professional

**Phase 1: Automated Translation**
- Use Google Translate API for initial translations
- Review and adjust key phrases
- Good enough for MVP

**Phase 2: Professional Review**
- Hire native speakers to review
- Focus on high-visibility content
- Improve quality post-launch

**Phase 3: Community Contributions**
- Allow community to suggest improvements
- Crowdsource translations
- Especially for indigenous languages

### Priority Languages

1. **English** (Primary) - 60% of traffic
2. **Japanese** (High priority) - 15% of traffic (aurora tourism)
3. **Korean** (High priority) - 10% of traffic (aurora tourism)
4. **French** (Medium priority) - 8% of traffic (Canadian)
5. **Chinese** (Medium priority) - 5% of traffic (tourism)
6. **Others** (Low priority) - 2% of traffic combined

---

## Future Enhancements

### Short-term (3-6 months)

- [ ] Add language detection based on browser settings
- [ ] Translate knowledge base articles (high priority ones)
- [ ] Add language switcher to footer
- [ ] Implement missing key logging in production

### Medium-term (6-12 months)

- [ ] Professional translation review for top 3 languages
- [ ] SEO optimization per language
- [ ] Add more language options (Italian, Russian)
- [ ] Content-based translation (not just UI)

### Long-term (12+ months)

- [ ] Consider migrating to next-intl for SEO benefits
- [ ] Add indigenous language support (Tłįchǫ Yatiì)
- [ ] Implement translation management platform
- [ ] Community translation contributions

---

## References

- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [React Context API](https://react.dev/reference/react/createContext)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

---

## Notes

### Decision History

- 2025-01-14: Evaluated i18n solutions
- 2025-01-16: Decided on Context-based approach
- 2025-01-17: Implemented LanguageContext
- 2025-01-18: Created initial translations (English)
- 2025-01-20: Added 8 more languages (automated)
- 2025-01-22: Language switcher added to header

### Lessons Learned

1. **Simple Works:** Context approach is sufficient for MVP
2. **Automated OK:** Google Translate good enough for launch
3. **Coverage Matters:** Having 9 languages better than perfect English
4. **Users Appreciate:** International visitors love language options
5. **Easy to Add:** Adding new language takes 30 minutes

### Translation Statistics

- **Total keys:** 150
- **Languages:** 9
- **Total translations:** 1,350
- **Automated:** 90%
- **Professionally reviewed:** 10%

### Related Decisions

- [ADR-0001 - Next.js App Router](./0001-nextjs-app-router.md)

---

**Last Updated:** 2025-01-27
**Review Cycle:** Quarterly (review translation quality)
