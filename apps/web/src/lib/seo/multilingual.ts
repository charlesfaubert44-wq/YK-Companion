import { SITE_CONFIG } from './metadata';

/**
 * Multilingual SEO Support
 *
 * Utilities for generating hreflang tags and language-specific metadata
 * Supports: English, French, Dene, Inuktitut
 */

export type SupportedLanguage = 'en' | 'fr' | 'dene' | 'inuktitut';

export const LANGUAGE_CONFIG = {
  en: {
    code: 'en-CA',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
  },
  fr: {
    code: 'fr-CA',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
  },
  dene: {
    code: 'den',
    name: 'Dene',
    nativeName: 'Dëne',
    direction: 'ltr',
  },
  inuktitut: {
    code: 'iu',
    name: 'Inuktitut',
    nativeName: 'ᐃᓄᒃᑎᑐᑦ',
    direction: 'ltr',
  },
} as const;

/**
 * Generate hreflang alternate links for a page
 *
 * Used to tell search engines about language/regional variations
 * of the same page
 */
export function generateHreflangLinks(
  path: string,
  availableLanguages: SupportedLanguage[] = ['en']
): Array<{ hreflang: string; href: string }> {
  const links: Array<{ hreflang: string; href: string }> = [];

  // Add link for each available language
  availableLanguages.forEach(lang => {
    const langCode = LANGUAGE_CONFIG[lang].code;
    const href = `${SITE_CONFIG.url}${lang === 'en' ? '' : `/${lang}`}${path}`;

    links.push({
      hreflang: langCode,
      href,
    });
  });

  // Add x-default for the default language (English)
  links.push({
    hreflang: 'x-default',
    href: `${SITE_CONFIG.url}${path}`,
  });

  return links;
}

/**
 * Generate language-specific metadata
 *
 * Returns metadata object with language-specific title, description, etc.
 */
export function generateLanguageMetadata(
  language: SupportedLanguage,
  translations: {
    title: Record<SupportedLanguage, string>;
    description: Record<SupportedLanguage, string>;
    keywords?: Record<SupportedLanguage, string[]>;
  }
) {
  const langConfig = LANGUAGE_CONFIG[language];

  return {
    title: translations.title[language],
    description: translations.description[language],
    keywords: translations.keywords?.[language],
    openGraph: {
      locale: langConfig.code,
    },
    alternates: {
      languages: Object.entries(translations.title).reduce(
        (acc, [lang, _]) => {
          const l = lang as SupportedLanguage;
          const code = LANGUAGE_CONFIG[l].code;
          acc[code] = `/${l === 'en' ? '' : l}`;
          return acc;
        },
        {} as Record<string, string>
      ),
    },
  };
}

/**
 * Translations for common SEO terms
 *
 * Helpful for generating metadata in different languages
 */
export const SEO_TRANSLATIONS = {
  siteTitle: {
    en: 'YK Buddy - Your Yellowknife Companion',
    fr: 'YK Buddy - Votre compagnon de Yellowknife',
    dene: "YK Buddy - Nįłį wegots'ą",
    inuktitut: 'YK Buddy - ᐃᓚᖓᑦ Yellowknife',
  },
  siteDescription: {
    en: 'Your friendly companion for exploring Yellowknife - whether you are visiting, living here, or planning to move.',
    fr: 'Votre compagnon amical pour explorer Yellowknife - que vous soyez en visite, que vous y viviez ou que vous prévoyiez de déménager.',
    dene: "Yellowknife wegots'ą nedhé - gots'įh, gots'ę́dé, edádhe ts'ǫ́ gots'ǫ.",
    inuktitut: 'ᐃᓚᖓᑦ Yellowknife ᑐᑭᓯᒋᐊᕐᕕᒃ - ᑕᐃᑉᓱᒪᓐᓂᐊᕐᓗᑎᑦ, ᐃᓪᓕᕐᓗᑎᑦ, ᓅᑉᓗᑎᑦ ᐅᕝᕙᓘᓐᓃᑦ.',
  },
  pathways: {
    visiting: {
      en: 'Visiting',
      fr: 'Visite',
      dene: "Gots'įh",
      inuktitut: 'ᑕᐃᑉᓱᒪᓐᓂᐊᕐᓂᖅ',
    },
    living: {
      en: 'Living',
      fr: 'Vivre',
      dene: "Gots'ę́dé",
      inuktitut: 'ᐃᓪᓕᕐᓂᖅ',
    },
    moving: {
      en: 'Moving',
      fr: 'Déménagement',
      dene: 'Edádhe',
      inuktitut: 'ᓅᓕᕐᓂᖅ',
    },
  },
  features: {
    aurora: {
      en: 'Aurora Forecast',
      fr: 'Prévisions aurores boréales',
      dene: "Yahdaht'á",
      inuktitut: 'ᐊᕐᓴᖅᑐᐃᑦ ᓯᓚᑦᑐᖅ',
    },
    garageSales: {
      en: 'Garage Sales',
      fr: 'Ventes de garage',
      dene: "Nįdeé ts'edı",
      inuktitut: 'ᐊᐅᓚᔾᔭᐅᕙᒃᑐᑦ',
    },
    knowledge: {
      en: 'Knowledge Base',
      fr: 'Base de connaissances',
      dene: "Įt'ah xə",
      inuktitut: 'ᖃᐅᔨᒪᔭᐅᔪᑦ',
    },
  },
  common: {
    readMore: {
      en: 'Read More',
      fr: 'Lire la suite',
      dene: "K'áh xálį",
      inuktitut: 'ᐊᑐᓂ',
    },
    learnMore: {
      en: 'Learn More',
      fr: 'En savoir plus',
      dene: "K'áh įt'ah",
      inuktitut: 'ᐃᓕᓐᓂᐊᕐᓂᖅ',
    },
    search: {
      en: 'Search',
      fr: 'Rechercher',
      dene: "Náįts'edé",
      inuktitut: 'ᐅᔭᕐᓂᖅ',
    },
  },
} as const;

/**
 * Generate OpenGraph locale alternates
 *
 * For social media platforms to show correct language version
 */
export function generateOpenGraphLocales(
  currentLanguage: SupportedLanguage,
  availableLanguages: SupportedLanguage[]
): string[] {
  return availableLanguages
    .filter(lang => lang !== currentLanguage)
    .map(lang => LANGUAGE_CONFIG[lang].code);
}

/**
 * Get language from path
 *
 * Extracts language code from URL path (e.g., /fr/about -> 'fr')
 */
export function getLanguageFromPath(path: string): SupportedLanguage {
  const match = path.match(/^\/([a-z]{2,})\//);
  if (match && match[1] in LANGUAGE_CONFIG) {
    return match[1] as SupportedLanguage;
  }
  return 'en'; // default to English
}

/**
 * Generate language sitemap index
 *
 * Creates a sitemap index that points to language-specific sitemaps
 */
export function generateLanguageSitemapIndex(languages: SupportedLanguage[] = ['en']): string {
  const sitemaps = languages.map(lang => {
    const langPath = lang === 'en' ? '' : `/${lang}`;
    return `  <sitemap>
    <loc>${SITE_CONFIG.url}${langPath}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join('\n')}
</sitemapindex>`;
}

/**
 * Generate structured data with language support
 *
 * Adds inLanguage property to schemas
 */
export function addLanguageToSchema(schema: any, language: SupportedLanguage): any {
  return {
    ...schema,
    inLanguage: LANGUAGE_CONFIG[language].code,
  };
}

/**
 * Example usage helper for generating multilingual page metadata
 */
export function createMultilingualMetadata(
  path: string,
  currentLanguage: SupportedLanguage,
  availableLanguages: SupportedLanguage[],
  translations: {
    title: Record<SupportedLanguage, string>;
    description: Record<SupportedLanguage, string>;
  }
) {
  const langConfig = LANGUAGE_CONFIG[currentLanguage];
  const hreflangLinks = generateHreflangLinks(path, availableLanguages);

  return {
    title: translations.title[currentLanguage],
    description: translations.description[currentLanguage],
    openGraph: {
      locale: langConfig.code,
      alternateLocale: generateOpenGraphLocales(currentLanguage, availableLanguages),
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}${currentLanguage === 'en' ? '' : `/${currentLanguage}`}${path}`,
      languages: hreflangLinks.reduce(
        (acc, link) => {
          acc[link.hreflang] = link.href;
          return acc;
        },
        {} as Record<string, string>
      ),
    },
  };
}
