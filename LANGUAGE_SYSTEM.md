# YK Buddy - Multilingual System

## 🌐 Language Support

YK Buddy supports **9 languages** with dynamic switching across all pages.

### Supported Languages

| Language | Flag | Code |
|----------|------|------|
| **English** | 🇨🇦 Canadian Flag | `en` |
| **Français** | Quebec Flag (SVG) | `fr` |
| **中文** (Chinese) | 🇨🇳 | `zh` |
| **日本語** (Japanese) | 🇯🇵 | `ja` |
| **한국어** (Korean) | 🇰🇷 | `ko` |
| **Español** (Spanish) | 🇪🇸 | `es` |
| **Deutsch** (German) | 🇩🇪 | `de` |
| **Tiếng Việt** (Vietnamese) | 🇻🇳 | `vi` |
| **Tagalog** (Filipino) | 🇵🇭 | `tl` |

---

## 🏁 Regional Flags

### Canadian Context
- **English** uses the 🇨🇦 **Canadian flag** (not UK 🇬🇧)
- **Français** uses a custom **Quebec flag SVG** (not France 🇫🇷)

This reflects YK Buddy's Canadian and Northern focus.

---

## 🔧 How It Works

### 1. Language Context Provider

**Location:** `apps/web/src/contexts/LanguageContext.tsx`

```typescript
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: (lang) => {},
  t: (key) => key
});
```

**Features:**
- Creates React context for language state
- Provides `t()` translation function
- Stores selection in `localStorage`
- Persists across page navigation
- Uses lazy initialization to load saved preference immediately (no flash of English)
- SSR-safe with `typeof window` check

### 2. Language Selector Component

**Location:** `apps/web/src/components/LanguageSelector.tsx`

**Features:**
- Dropdown with all 9 languages
- Shows flag + language name
- Highlights current selection
- Custom Quebec flag SVG
- Mobile-responsive
- Accessible on all pages

**Usage:**
```tsx
import LanguageSelector from '@/components/LanguageSelector';

<LanguageSelector />
```

### 3. Translation Dictionary

**Location:** `apps/web/src/contexts/LanguageContext.tsx`

```typescript
const translations: Record<Language, Record<string, string>> = {
  en: {
    'home': 'Home',
    'about': 'About',
    'contact': 'Contact',
    // ... more translations
  },
  fr: {
    'home': 'Accueil',
    'about': 'À propos',
    'contact': 'Contact',
    // ... more translations
  },
  // ... other languages
}
```

**Translation Keys:**
- `home`, `about`, `contact` - Navigation
- `visiting`, `living`, `moving` - User pathways
- `are_you` - Homepage question
- `plan_your_trip`, `explore_your_city`, `start_your_move` - CTAs
- `visiting_desc`, `living_desc`, `moving_desc` - Descriptions
- `footer` - Footer acknowledgment
- `sign_in`, `sign_out` - Authentication

---

## 📝 Using Translations in Components

### Import the Hook
```tsx
import { useLanguage } from '@/contexts/LanguageContext';

export default function MyComponent() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('home')}</h1>
      <p>Current language: {language}</p>
    </div>
  );
}
```

### Translation Function
```tsx
t('home')           // Returns: "Home" (en) or "Accueil" (fr)
t('about')          // Returns: "About" (en) or "À propos" (fr)
t('visiting_desc')  // Returns full translated description
```

### Fallback Behavior
If a translation key doesn't exist:
1. Falls back to English translation
2. If English doesn't exist, returns the key itself

```tsx
t('nonexistent_key') // Returns: "nonexistent_key"
```

---

## 🌍 Where Language Selector Appears

### Main Pages
- ✅ **Homepage** (`/`) - Top right corner
- ✅ **About** (`/about`) - Top right
- ✅ **Contact** (`/contact`) - Top right

### User Pathway Pages
- ✅ **Visiting** (`/visiting`) - Via homepage selector
- ✅ **Living** (`/living`) - Via homepage selector
- ✅ **Moving** (`/moving`) - Via homepage selector

### Admin Pages
- ✅ **Admin Dashboard** (`/admin`) - Available
- ✅ **Premium Sponsors** (`/admin/sponsors`) - Available
- ✅ **Pricing Plans** (`/admin/pricing-plans`) - Available

---

## 💾 Persistence

### LocalStorage
Language selection is saved to browser's `localStorage`:

```javascript
localStorage.setItem('yk-buddy-language', 'fr');
```

**Key:** `yk-buddy-language`
**Value:** Language code (`en`, `fr`, `zh`, etc.)

### Cross-Page Persistence
1. User selects language on homepage
2. Choice saved to localStorage
3. Navigate to `/about`
4. Language context reads from localStorage
5. Same language automatically applied
6. Works across browser sessions

---

## 🎨 Quebec Flag Implementation

Since there's no Quebec flag emoji, we use a custom SVG:

```tsx
function QuebecFlag() {
  return (
    <svg width="24" height="18" viewBox="0 0 900 600">
      {/* Blue background */}
      <rect width="900" height="600" fill="#003D9F"/>
      {/* White cross */}
      <rect x="0" y="240" width="900" height="120" fill="white"/>
      <rect x="390" y="0" width="120" height="600" fill="white"/>
      {/* Four fleur-de-lis symbols in quadrants */}
      {/* ... SVG paths ... */}
    </svg>
  );
}
```

**Features:**
- Accurate Quebec flag colors (#003D9F blue)
- Four white fleur-de-lis symbols
- Scales properly with UI
- Renders inline with emoji flags

---

## 📋 Current Translation Coverage

### Fully Translated
- ✅ Navigation menu (Home, About, Contact)
- ✅ Three user pathways (Visiting, Living, Moving)
- ✅ Homepage question ("Are you...")
- ✅ Pathway descriptions
- ✅ Call-to-action buttons
- ✅ Footer acknowledgment
- ✅ Auth buttons (Sign In, Sign Out)

### English Only (Narrative Content)
- ⚠️ About page content (detailed narrative)
- ⚠️ Contact page content (detailed narrative)

**Why?** These pages contain long-form storytelling that's less critical to translate initially. Focus is on navigation and key actions.

---

## 🚀 Adding New Languages

### Step 1: Add to Type Definition
```typescript
// apps/web/src/contexts/LanguageContext.tsx
export type Language = 'en' | 'fr' | 'zh' | 'ja' | 'ko' | 'es' | 'de' | 'vi' | 'tl' | 'NEW';
```

### Step 2: Add Translations
```typescript
const translations: Record<Language, Record<string, string>> = {
  // ... existing languages
  NEW: {
    'home': 'Translation',
    'about': 'Translation',
    // ... all keys
  }
}
```

### Step 3: Add to Selector
```typescript
// apps/web/src/components/LanguageSelector.tsx
const LANGUAGES = [
  // ... existing languages
  { code: 'NEW', name: 'Language Name', flag: '🏳️' },
];
```

---

## 🔍 Testing Language Switching

### Manual Test
1. Open homepage
2. Click language selector (top right)
3. Select different language
4. Verify UI updates immediately
5. Navigate to `/about`
6. Navigate back to `/`
7. Verify language still selected
8. Refresh page
9. Verify language persists

### Console Test
```javascript
// In browser console
localStorage.getItem('yk-buddy-language')  // Check current
localStorage.setItem('yk-buddy-language', 'fr')  // Change to French
window.location.reload()  // Reload page
```

---

## 🐛 Troubleshooting

### Language Not Persisting
**Problem:** Language resets to English on page refresh or navigation

**Solution:**
✅ **FIXED** - Updated to use lazy initialization in `useState` instead of `useEffect`

**Previous issue:** The state was initialized with 'en' and then updated via useEffect, causing timing issues with Next.js client-side navigation.

**Current implementation:** Language is now read from localStorage immediately during state initialization using lazy initialization pattern.

**If still experiencing issues:**
1. Check browser localStorage is enabled
2. Check for localStorage errors in console
3. Verify `LanguageProvider` wraps entire app in `layout.tsx`
4. Clear browser cache and localStorage to test fresh

### Translation Not Showing
**Problem:** `t('key')` returns the key itself

**Solutions:**
1. Check translation key exists in dictionary
2. Verify key spelling matches exactly
3. Check language code is valid
4. Add fallback handling

### Flag Not Displaying
**Problem:** Quebec flag or other flag not showing

**Solutions:**
1. Check emoji rendering support
2. For Quebec, verify SVG component loaded
3. Check console for component errors

---

## 📊 Language Analytics (Future)

### Potential Metrics to Track
- Most selected languages
- Language switching patterns
- Completion rates by language
- Geographic correlation
- Time spent per language

### Implementation Ideas
```typescript
const trackLanguageChange = (from: Language, to: Language) => {
  // Google Analytics event
  gtag('event', 'language_change', {
    from_language: from,
    to_language: to,
    page: window.location.pathname
  });
};
```

---

## 📝 Translation Guidelines

### Tone
- Friendly and conversational
- Culturally appropriate
- Maintains "northern companion" feel

### Length
- Try to match English length
- Buttons: Short and actionable
- Descriptions: Can be longer if needed

### Testing
- Test with native speakers when possible
- Use professional translation for critical content
- Community feedback welcome

---

**Last Updated:** January 2025
**Languages:** 9
**Coverage:** Navigation + Key Actions
**Persistence:** ✅ localStorage
**Mobile:** ✅ Responsive
