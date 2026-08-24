import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { getPhoneHref } from '@/lib/contact';
import { languageOptions, layoutCopy, type Language } from '@/lib/i18n';
import { stripLanguagePrefix } from '@/lib/routing';
import { cn } from '@/lib/utils';
import type { NavigationItem } from '@/types/site-content';
import { Facebook, Instagram, Mail, Menu, Phone } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from '@/components/navigation/LocalizedLink';
import { useLocation } from 'react-router-dom';

type SiteHeaderProps = {
  items: NavigationItem[],
  language: Language,
  logoSrc?: string,
  facebookUrl?: string,
  instagramUrl?: string,
  phoneNumber?: string,
  email?: string,
  onLanguageChange: (language: Language) => void,
};

type HeaderIconLink = {
  href: string,
  label: string,
  Icon: typeof Facebook,
  isExternal?: boolean,
};

const navigationLinkBaseClass = 'relative flex h-16 items-center px-3 text-sm font-bold transition-colors xl:px-4';

function normalizeRoutePath(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '');
  return normalizedPath || '/';
}

function toAbsoluteRoute(path: string): string {
  const normalizedPath = normalizeRoutePath(path);
  return normalizedPath === '/' ? '/' : `/${normalizedPath}`;
}

function isActiveRoute(currentPath: string, itemPath: string): boolean {
  return normalizeRoutePath(currentPath) === normalizeRoutePath(itemPath);
}

export default function SiteHeader({
  items,
  language,
  logoSrc,
  facebookUrl = '',
  instagramUrl = '',
  phoneNumber = '',
  email = '',
  onLanguageChange,
}: SiteHeaderProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const copy = layoutCopy[language].header;

  const iconLinks = useMemo<HeaderIconLink[]>(
    () =>
      [
        facebookUrl && { href: facebookUrl, label: 'Facebook', Icon: Facebook, isExternal: true },
        instagramUrl && { href: instagramUrl, label: 'Instagram', Icon: Instagram, isExternal: true },
        phoneNumber && { href: getPhoneHref(phoneNumber), label: copy.phone, Icon: Phone },
        email && { href: `mailto:${email}`, label: copy.email, Icon: Mail },
      ].filter(Boolean) as HeaderIconLink[],
    [copy.email, copy.phone, email, facebookUrl, instagramUrl, phoneNumber],
  );

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <header
      className='fixed inset-x-0 top-0 z-[70] w-full border-b border-white/10 bg-[#071712] text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)]'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {logoSrc && (
            <Link
              to='/'
              aria-label='Mistrzowie Logiki'
              className='relative flex h-12 w-32 shrink-0 items-center overflow-hidden'
              onClick={closeMobileMenu}>
              <img
                src={logoSrc}
                alt=''
                width='600'
                height='350'
                className='absolute -left-2.5 top-1/2 h-[5.5rem] w-auto max-w-none -translate-y-1/2 object-contain brightness-0 invert transition-transform duration-300 hover:scale-[1.03]' />
            </Link>
          )}

          <nav aria-label={copy.navMenu} className='hidden flex-1 lg:block'>
            <ul className='flex items-center justify-center space-x-1'>
              {items.map((item, index) => {
                const isCallToAction = index === items.length-1;
                const isActive = isActiveRoute(stripLanguagePrefix(location.pathname), item.path);

                return (
                  <li key={`${item.path}-${item.label}`}>
                    <Link
                      to={toAbsoluteRoute(item.path)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        navigationLinkBaseClass,
                        !isCallToAction
                          && 'text-white/[0.64] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:origin-left after:scale-x-0 after:rounded-full after:bg-amber-400 after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100',
                        isActive && !isCallToAction && 'text-white after:scale-x-100',
                        isCallToAction
                          && cn(
                            'mx-2 h-10 rounded-full bg-amber-400 px-5 py-2 font-black text-slate-950 shadow-[0_8px_24px_rgba(245,185,66,0.2)] hover:bg-amber-300',
                          ),
                      )}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className='flex items-center space-x-4'>
            <div className='hidden rounded-full border border-white/10 bg-white/[0.045] p-1 lg:inline-flex'>
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  type='button'
                  aria-label={option.label}
                  aria-pressed={option.code === language}
                  onClick={() => onLanguageChange(option.code)}
                  className={`h-7 rounded-full px-2.5 text-[0.65rem] font-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${option.code === language ? 'bg-amber-300 text-[#071712]' : 'text-white/70 hover:text-white'}`}>
                  {option.shortLabel}
                </button>
              ))}
            </div>
            {iconLinks.length > 0 && (
              <div className='hidden items-center space-x-2 xl:flex'>
                {iconLinks.map(({ href, label, Icon, isExternal }) => (
                  <a
                    key={label}
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className='flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] text-white/[0.72] transition-colors hover:border-amber-300/50 hover:bg-white/[0.12] hover:text-amber-200'>
                    <Icon className='h-4 w-4' />
                    <span className='sr-only'>
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='text-white hover:bg-white/10 hover:text-amber-200 lg:hidden'>
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>
                    {copy.openMenu}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side='right'
                closeLabel={language === 'pl' ? 'Zamknij menu' : 'Close menu'}
                className='w-[300px] overflow-y-auto border-white/10 bg-[#071712] text-white sm:w-[400px]'>
                <SheetTitle className='sr-only'>
                  {copy.navMenu}
                </SheetTitle>
                <SheetDescription className='sr-only'>
                  {language === 'pl'
                    ? 'Główna nawigacja oraz szybkie dane kontaktowe.'
                    : 'Main navigation and quick contact details.'}
                </SheetDescription>
                <div className='flex flex-col space-y-6 py-6'>
                  {logoSrc && (
                    <Link
                      to='/'
                      aria-label='Mistrzowie Logiki'
                      className='relative flex h-12 w-32 items-center overflow-hidden'
                      onClick={closeMobileMenu}>
                      <img
                        src={logoSrc}
                        alt=''
                        width='600'
                        height='350'
                        className='absolute -left-2.5 top-1/2 h-[5.5rem] w-auto max-w-none -translate-y-1/2 object-contain brightness-0 invert' />
                    </Link>
                  )}

                  <nav aria-label={copy.navMenu} className='flex flex-col space-y-3'>
                    {items.map((item) => {
                      const isActive = isActiveRoute(location.pathname, item.path);
                      const isCallToAction = item === items[items.length-1];

                      return (
                        <Link
                          key={`${item.path}-${item.label}`}
                          to={toAbsoluteRoute(item.path)}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'group flex items-center rounded-md px-3 py-3 text-base font-semibold transition-colors',
                            isCallToAction
                              ? 'mt-3 justify-center bg-amber-400 text-slate-950 hover:bg-amber-300'
                              : 'text-white/[0.72] hover:bg-white/[0.07] hover:text-white',
                            isActive && !isCallToAction && 'bg-white/[0.08] text-white',
                          )}
                          onClick={closeMobileMenu}>
                          <span className='relative'>
                            {item.label}
                            {!isCallToAction && (
                              <span
                                className={cn(
                                  'absolute -bottom-1 left-0 h-[2px] w-full bg-amber-400 transition-transform duration-300',
                                  isActive ? 'scale-x-100' : 'scale-x-0',
                                )}>
                              </span>
                            )}
                          </span>
                        </Link>
                      );
                    })}
                  </nav>

                  <div className='flex items-center gap-3 border-t border-white/10 pt-5'>
                    <span className='text-xs font-black uppercase tracking-[0.15em] text-white/60'>
                      {language === 'pl' ? 'Język' : 'Language'}
                    </span>
                    <div className='inline-flex rounded-full border border-white/10 bg-white/[0.045] p-1'>
                      {languageOptions.map((option) => (
                        <button
                          key={option.code}
                          type='button'
                          aria-label={option.label}
                          aria-pressed={option.code === language}
                          onClick={() => onLanguageChange(option.code)}
                          className={`h-8 rounded-full px-3 text-xs font-black ${option.code === language ? 'bg-amber-300 text-[#071712]' : 'text-white/70'}`}>
                          {option.shortLabel}
                        </button>
                      ))}
                    </div>
                  </div>

                  {iconLinks.length > 0 && (
                    <div className='flex items-center space-x-4 pt-4'>
                      {iconLinks.map(({ href, label, Icon, isExternal }) => (
                        <a
                          key={label}
                          href={href}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          onClick={closeMobileMenu}
                          className='flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] text-white/[0.72] transition-colors hover:border-amber-300/50 hover:text-amber-200'>
                          <Icon className='h-5 w-5' />
                          <span className='sr-only'>
                            {label}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
