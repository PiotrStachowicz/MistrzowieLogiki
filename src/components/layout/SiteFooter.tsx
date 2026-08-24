import type { ContactDetails, NavigationItem } from '@/types/site-content';
import { getPhoneHref } from '@/lib/contact';
import { languageOptions, layoutCopy, type Language } from '@/lib/i18n';
import { Mail, Phone } from 'lucide-react';
import { Link, NavLink } from '@/components/navigation/LocalizedLink';

type SiteFooterProps = {
  contactDetails: ContactDetails,
  language: Language,
  navigationItems: NavigationItem[],
  onLanguageChange: (language: Language) => void,
};

function normalizeRoutePath(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '');
  return normalizedPath || '/';
}

function toAbsoluteRoute(path: string): string {
  const normalizedPath = normalizeRoutePath(path);
  return normalizedPath === '/' ? '/' : `/${normalizedPath}`;
}

export default function SiteFooter({ contactDetails, language, navigationItems, onLanguageChange }: SiteFooterProps) {
  const { phoneNumber, email } = contactDetails;
  const currentYear = new Date().getFullYear();
  const copy = layoutCopy[language].footer;
  const footerIntro = language === 'pl'
    ? {
        eyebrow: 'Kontakt',
        heading: 'Porozmawiajmy o zajęciach.',
        description: 'Krótka rozmowa pomoże nam poznać poziom ucznia, jego cel i preferowaną formę zajęć.',
      }
    : {
        eyebrow: 'Contact',
        heading: 'Let’s talk about lessons.',
        description: 'A short conversation helps us understand the student’s level, goal and preferred lesson format.',
      };

  return (
    <footer
      id='site-footer'
      data-story-footer
      className='site-footer-section relative isolate overflow-hidden bg-[#061611] text-white'>
      <div className='story-grid-art opacity-20' aria-hidden='true' />
      <div
        className='absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(52,211,153,0.09),transparent_30%),radial-gradient(circle_at_8%_92%,rgba(252,211,77,0.07),transparent_34%)]'
        aria-hidden='true' />

      <div className='container relative px-4 py-8'>
        <div className='grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end'>
          <div>
            <p className='story-kicker text-emerald-200'>
              {footerIntro.eyebrow}
            </p>
            <h2 className='mt-5 max-w-2xl text-[clamp(2.15rem,3.6vw,4rem)] font-black leading-[0.98] tracking-[-0.045em] text-white'>
              {footerIntro.heading}
            </h2>
            <p className='mt-5 max-w-xl text-base leading-7 text-white/[0.68] sm:text-lg'>
              {footerIntro.description}
            </p>
          </div>

          <div className='grid gap-3'>
            <a
              href={getPhoneHref(phoneNumber)}
              className='group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#10251f] p-3 transition duration-300 hover:-translate-y-1 hover:border-amber-300/40 hover:bg-[#153029] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300'>
              <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-300 text-[#071712] transition-transform duration-300 group-hover:rotate-6'>
                <Phone className='h-5 w-5' />
              </span>
              <span className='min-w-0'>
                <span className='block text-[0.68rem] font-black uppercase tracking-[0.16em] text-white/[0.65]'>
                  {copy.phone}
                </span>
                <span className='mt-1 block text-base font-black text-white sm:text-lg'>
                  {phoneNumber}
                </span>
              </span>
            </a>

            <a
              href={`mailto:${email}`}
              className='group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#10251f] p-3 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-[#153029] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300'>
              <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-[#071712] transition-transform duration-300 group-hover:-rotate-6'>
                <Mail className='h-5 w-5' />
              </span>
              <span className='min-w-0'>
                <span className='block text-[0.68rem] font-black uppercase tracking-[0.16em] text-white/[0.65]'>
                  {copy.email}
                </span>
                <span className='mt-1 block break-all text-base font-black text-white sm:text-lg'>
                  {email}
                </span>
              </span>
            </a>
          </div>
        </div>

        <div className='grid gap-8 py-7 md:grid-cols-[1fr_1.45fr] md:items-start'>
          <div>
            <Link
              to='/'
              className='inline-flex text-2xl font-black tracking-[-0.04em] text-white transition-colors hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300'>
              Mistrzowie Logiki
            </Link>
            <p className='mt-3 max-w-sm text-sm leading-7 text-white/[0.65]'>
              {language === 'pl'
                ? 'Regularne zajęcia online i stacjonarnie, dopasowane do poziomu i konkretnego celu ucznia.'
                : 'Regular online and in-person lessons shaped around the student’s level and a clear goal.'}
            </p>
          </div>

          <nav aria-label={copy.navigation}>
            <h3 className='text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/60'>
              {copy.navigation}
            </h3>
            <div className='mt-5 flex flex-wrap gap-x-7 gap-y-4'>
              {navigationItems.map((item) => (
                <NavLink
                  key={`${item.path}-${item.label}`}
                  to={toAbsoluteRoute(item.path)}
                  className='border-b border-transparent pb-1 text-sm font-bold text-white/[0.68] transition-colors hover:border-amber-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300'>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>

        <div className='flex flex-col gap-4 border-t border-white/10 pt-5 text-sm text-white/60 md:flex-row md:items-center md:justify-between'>
          <p>
            © {currentYear} Mistrzowie Logiki. {copy.copyright}
          </p>

          <div className='flex flex-col gap-5 sm:flex-row sm:items-center'>
            <div className='inline-flex items-center gap-2'>
              <span className='text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/60'>
                {copy.language}
              </span>
              <div className='inline-flex rounded-full border border-white/10 bg-white/[0.045] p-1'>
                {languageOptions.map((option) => {
                  const isActive = option.code === language;

                  return (
                    <button
                      key={option.code}
                      type='button'
                      aria-pressed={isActive}
                      aria-label={option.label}
                      className={`h-8 rounded-full px-3 text-xs font-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                        isActive
                          ? 'bg-amber-300 text-[#071712]'
                          : 'text-white/70 hover:bg-white/[0.08] hover:text-white'
                      }`}
                      onClick={() => onLanguageChange(option.code)}>
                      {option.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            <nav className='flex flex-wrap gap-x-5 gap-y-2' aria-label={language === 'pl' ? 'Informacje prawne' : 'Legal information'}>
              {copy.legalLinks
                .filter((link) => link.path !== '/dokumenty')
                .map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className='transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300'>
                    {link.label}
                  </NavLink>
                ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
