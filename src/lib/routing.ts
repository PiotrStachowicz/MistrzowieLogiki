import type { Language } from '@/lib/i18n';

const englishPathPrefix = '/en';

export function stripLanguagePrefix(pathname: string): string {
  if (pathname === englishPathPrefix) {
    return '/';
  }

  if (pathname.startsWith(`${englishPathPrefix}/`)) {
    return pathname.slice(englishPathPrefix.length) || '/';
  }

  return pathname || '/';
}

export function getPathLanguage(pathname: string): Language | null {
  return pathname === englishPathPrefix || pathname.startsWith(`${englishPathPrefix}/`) ? 'en' : null;
}

export function getLocalizedPath(path: string, language: Language): string {
  const url = new URL(path, 'https://mistrzowielogiki.local');
  const basePath = stripLanguagePrefix(url.pathname);
  const localizedPath = language === 'en'
    ? `${englishPathPrefix}${basePath === '/' ? '' : basePath}`
    : basePath;

  return `${localizedPath || '/'}${url.search}${url.hash}`;
}

export function getRouterBasename(language: Language): string | undefined {
  return language === 'en' ? englishPathPrefix : undefined;
}
