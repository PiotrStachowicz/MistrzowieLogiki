import type { NavigationItem, SiteContent } from '@/types/site-content';
import { getLocalizedPath, getPathLanguage } from '@/lib/routing';

export type Language = 'pl' | 'en';

export const languageOptions: Array<{ code: Language, label: string, shortLabel: string }> = [
  { code: 'pl', label: 'Polski', shortLabel: 'PL' },
  { code: 'en', label: 'English', shortLabel: 'EN' },
];

const navigationItemsByLanguage: Record<Language, NavigationItem[]> = {
  pl: [
    { label: 'Szachy', path: 'szachy' },
    { label: 'Matematyka', path: 'matematyka' },
    { label: 'Cennik', path: 'cennik' },
    { label: 'Kontakt', path: 'kontakt' },
    { label: 'Dokumenty', path: 'dokumenty' },
    { label: 'FAQ', path: 'faq' },
    { label: 'Zapisz ucznia na zajęcia', path: 'zapisz' },
  ],
  en: [
    { label: 'Chess', path: 'szachy' },
    { label: 'Math', path: 'matematyka' },
    { label: 'Pricing', path: 'cennik' },
    { label: 'Contact', path: 'kontakt' },
    { label: 'Documents', path: 'dokumenty' },
    { label: 'FAQ', path: 'faq' },
    { label: 'Enrol a student', path: 'zapisz' },
  ],
};

export const layoutCopy = {
  pl: {
    loading: 'Ładowanie...',
    loadError: 'Nie udało się załadować danych strony.',
    footer: {
      tagline:
        'Szachy i matematyka dla uczniów, którzy mają nie tylko znać odpowiedź, ale rozumieć następny krok.',
      navigation: 'Nawigacja',
      contact: 'Kontakt',
      phone: 'Telefon',
      email: 'Email',
      copyright: 'Wszelkie prawa zastrzeżone.',
      language: 'Język',
      legalLinks: [
        { label: 'Polityka prywatności', path: '/politykaprywatnosci' },
        { label: 'Cookies', path: '/cookies' },
        { label: 'Dokumenty', path: '/dokumenty' },
      ],
    },
    header: {
      phone: 'Telefon',
      email: 'Email',
      openMenu: 'Otwórz menu',
      navMenu: 'Menu nawigacji',
    },
    team: {
      title: 'Nasz zespół',
      moreInfo: 'Więcej informacji',
    },
  },
  en: {
    loading: 'Loading...',
    loadError: 'Could not load site data.',
    footer: {
      tagline: 'Chess and math for students who need to understand the next step, not just know the answer.',
      navigation: 'Navigation',
      contact: 'Contact',
      phone: 'Phone',
      email: 'Email',
      copyright: 'All rights reserved.',
      language: 'Language',
      legalLinks: [
        { label: 'Privacy policy', path: '/politykaprywatnosci' },
        { label: 'Cookies', path: '/cookies' },
        { label: 'Documents', path: '/dokumenty' },
      ],
    },
    header: {
      phone: 'Phone',
      email: 'Email',
      openMenu: 'Open menu',
      navMenu: 'Navigation menu',
    },
    team: {
      title: 'Our team',
      moreInfo: 'More information',
    },
  },
} satisfies Record<Language, unknown>;

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'pl';
  }

  const pathLanguage = getPathLanguage(window.location.pathname);
  if (pathLanguage) {
    return pathLanguage;
  }

  const url = new URL(window.location.href);
  const requestedLanguage = url.searchParams.get('lang');
  if (requestedLanguage === 'en' || requestedLanguage === 'pl') {
    url.searchParams.delete('lang');
    window.history.replaceState(
      window.history.state,
      '',
      `${getLocalizedPath(url.pathname, requestedLanguage)}${url.search}${url.hash}`,
    );
    return requestedLanguage;
  }

  return 'pl';
}

export function localizeSiteContent(content: SiteContent, language: Language): SiteContent {
  return {
    ...content,
    navigationItems: navigationItemsByLanguage[language],
  };
}
