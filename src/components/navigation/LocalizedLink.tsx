import { createContext, useContext, type ReactNode } from 'react';
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  type LinkProps,
  type NavLinkProps,
} from 'react-router-dom';

import type { Language } from '@/lib/i18n';
import { getLocalizedPath } from '@/lib/routing';

const LanguageContext = createContext<Language>('pl');

export function LocalizedLinkProvider({ children, language }: { children: ReactNode, language: Language }) {
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
}

export function Link({ to, ...props }: LinkProps) {
  const language = useContext(LanguageContext);
  const localizedTarget = typeof to === 'string' ? getLocalizedPath(to, language) : to;

  return <RouterLink {...props} to={localizedTarget} />;
}

export function NavLink({ to, ...props }: NavLinkProps) {
  const language = useContext(LanguageContext);
  const localizedTarget = typeof to === 'string' ? getLocalizedPath(to, language) : to;

  return <RouterNavLink {...props} to={localizedTarget} />;
}
