import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';

import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';
import { LocalizedLinkProvider } from '@/components/navigation/LocalizedLink';
import {
  getInitialLanguage,
  localizeSiteContent,
  type Language,
} from '@/lib/i18n';
import { notFoundMetadata, pageMetadata } from '@/lib/page-metadata';
import { getLocalizedPath, stripLanguagePrefix } from '@/lib/routing';
import { getFallbackSiteContent, loadOfferPlans, loadSiteContent } from '@/lib/site-content';
import HomePage from '@/pages/HomePage';
import StatusPage from '@/pages/StatusPage';
import type { SiteContent } from '@/types/site-content';

const ChessProgramsPage = lazy(() => import('@/pages/ChessProgramsPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const CookiesPage = lazy(() => import('@/pages/CookiesPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const MathTutoringPage = lazy(() => import('@/pages/MathTutoringPage'));
const OfferPage = lazy(() => import('@/pages/OfferPage'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const RegistrationPage = lazy(() => import('@/pages/RegistrationPage'));

function resetWindowScrollPosition() {
  const root = document.documentElement;
  const previousInlineBehavior = root.style.scrollBehavior;

  // `behavior: auto` still follows the global `scroll-behavior: smooth` rule.
  // Override it briefly so route changes never animate through an old page.
  root.style.scrollBehavior = 'auto';
  window.scrollTo({ top: 0, left: 0 });
  root.scrollTop = 0;
  document.body.scrollTop = 0;
  root.style.scrollBehavior = previousInlineBehavior;
}

function ScrollToTop() {
  const location = useLocation();
  const routeKey = `${stripLanguagePrefix(location.pathname)}${location.search}`;
  const previousRouteKey = useRef(routeKey);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    const shouldMoveFocus = routeKey !== previousRouteKey.current;
    previousRouteKey.current = routeKey;

    resetWindowScrollPosition();
    const frameId = window.requestAnimationFrame(() => {
      resetWindowScrollPosition();

      if (shouldMoveFocus) {
        document.getElementById('main-content')?.focus({ preventScroll: true });
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [routeKey]);

  return null;
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.append(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
}

function upsertLink(rel: string, href: string, hrefLang?: string) {
  const selector = hrefLang ? `link[rel="${rel}"][hreflang="${hrefLang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    if (hrefLang) element.hreflang = hrefLang;
    document.head.append(element);
  }
  element.href = href;
}

function PageMetadata({
  email,
  language,
  phoneNumber,
}: {
  email: string,
  language: Language,
  phoneNumber: string,
}) {
  const location = useLocation();

  useEffect(() => {
    const basePath = stripLanguagePrefix(location.pathname);
    const isKnownPage = Boolean(pageMetadata[basePath]);
    const metadata = pageMetadata[basePath]?.[language] ?? notFoundMetadata[language];
    document.title = metadata.title;

    const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
    const localizedUrl = (targetLanguage: Language) => `${siteUrl}${getLocalizedPath(basePath, targetLanguage)}`;
    const currentUrl = localizedUrl(language);

    upsertMeta('meta[name="description"]', { name: 'description', content: metadata.description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: isKnownPage ? 'index, follow' : 'noindex, follow' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: metadata.title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: metadata.description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: currentUrl });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: `${siteUrl}/redesign/home-hero-1536.webp` });
    upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1536' });
    upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '864' });
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: language === 'pl' ? 'Zajęcia Mistrzów Logiki' : 'Mistrzowie Logiki lessons' });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: language === 'pl' ? 'pl_PL' : 'en_GB' });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: metadata.title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: metadata.description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: `${siteUrl}/redesign/home-hero-1536.webp` });
    upsertLink('canonical', currentUrl);
    upsertLink('alternate', localizedUrl('pl'), 'pl');
    upsertLink('alternate', localizedUrl('en'), 'en');
    upsertLink('alternate', localizedUrl('pl'), 'x-default');

    let structuredData = document.getElementById('site-structured-data') as HTMLScriptElement | null;
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.id = 'site-structured-data';
      structuredData.type = 'application/ld+json';
      document.head.append(structuredData);
    }
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Mistrzowie Logiki',
      url: siteUrl,
      email,
      telephone: phoneNumber,
      areaServed: 'Poland',
    });
  }, [email, language, location.pathname, phoneNumber]);

  return null;
}

function RouteLoadingFallback({ language }: { language: Language }) {
  return (
    <div
      className='flex min-h-[50vh] items-center justify-center px-4 text-center text-sm font-semibold text-muted-foreground'
      role='status'
      aria-live='polite'
      aria-atomic='true'>
      <span
        className='mr-3 size-2.5 animate-pulse rounded-full bg-amber-400 motion-reduce:animate-none'
        aria-hidden='true' />
      {language === 'pl' ? 'Otwieramy stronę…' : 'Opening the page…'}
    </div>
  );
}

function PageContent({
  content,
  language,
  onOfferPlansNeeded,
}: {
  content: SiteContent,
  language: Language,
  onOfferPlansNeeded: () => void,
}) {
  const location = useLocation();
  const basePath = stripLanguagePrefix(location.pathname);
  const { contactDetails } = content;
  const needsOfferPlans = basePath === '/cennik' || basePath === '/zapisz';

  useEffect(() => {
    if (needsOfferPlans && content.offerPlans.length === 0) {
      onOfferPlansNeeded();
    }
  }, [content.offerPlans.length, needsOfferPlans, onOfferPlansNeeded]);

  switch (basePath) {
    case '/':
      return <HomePage content={content.homePage} language={language} />;
    case '/cennik':
      if (content.offerPlans.length === 0) {
        return <RouteLoadingFallback language={language} />;
      }
      return <OfferPage offerPlans={content.offerPlans} language={language} />;
    case '/faq':
      return <FaqPage language={language} />;
    case '/szachy':
      return <ChessProgramsPage language={language} />;
    case '/matematyka':
      return <MathTutoringPage language={language} />;
    case '/kontakt':
      return <ContactPage contactDetails={contactDetails} language={language} />;
    case '/dokumenty':
      return <StatusPage kind='documents-unavailable' email={contactDetails.email} language={language} />;
    case '/zapisz':
      if (content.offerPlans.length === 0) {
        return <RouteLoadingFallback language={language} />;
      }
      return (
        <RegistrationPage
          language={language}
          offerPlans={content.offerPlans} />
      );
    case '/cookies':
      return <CookiesPage email={contactDetails.email} language={language} />;
    case '/politykaprywatnosci':
      return <PrivacyPolicy email={contactDetails.email} language={language} />;
    default:
      return <StatusPage kind='not-found' language={language} />;
  }
}

function App() {
  const [siteContent, setSiteContent] = useState<SiteContent>(getFallbackSiteContent);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const offerPlansRequestRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadSiteContent()
      .then((content) => {
        if (isMounted) {
          setSiteContent((currentContent) => ({
            ...content,
            offerPlans: currentContent.offerPlans,
          }));
        }
      })
      .catch((error) => {
        console.error('Error loading site content:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const ensureOfferPlans = useCallback(() => {
    if (siteContent.offerPlans.length > 0 || offerPlansRequestRef.current) {
      return;
    }

    const request = loadOfferPlans()
      .then((offerPlans) => {
        setSiteContent((currentContent) => ({ ...currentContent, offerPlans }));
      })
      .finally(() => {
        offerPlansRequestRef.current = null;
      });

    offerPlansRequestRef.current = request;
  }, [siteContent.offerPlans.length]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const localizedSiteContent = useMemo(
    () => localizeSiteContent(siteContent, language),
    [language, siteContent],
  );

  const { contactDetails } = localizedSiteContent;
  const navigationItems = localizedSiteContent.navigationItems.filter((item) => item.path !== 'dokumenty');

  const handleLanguageChange = (nextLanguage: Language) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('lang');
    const localizedPath = getLocalizedPath(`${url.pathname}${url.search}${url.hash}`, nextLanguage);
    window.history.replaceState(window.history.state, '', localizedPath);
    window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
    setLanguage(nextLanguage);
  };

  return (
    <BrowserRouter>
      <LocalizedLinkProvider language={language}>
      <ScrollToTop />
      <PageMetadata
        email={contactDetails.email}
        language={language}
        phoneNumber={contactDetails.phoneNumber} />
      <a
        href='#main-content'
        onClick={(event) => {
          event.preventDefault();
          const mainContent = document.getElementById('main-content');
          mainContent?.focus();
          mainContent?.scrollIntoView({ block: 'start' });
        }}
        className='fixed left-4 top-3 z-[100] -translate-y-24 rounded-full bg-amber-400 px-5 py-3 font-black text-slate-950 shadow-xl transition-transform focus:translate-y-0'>
        {language === 'pl' ? 'Przejdź do treści' : 'Skip to content'}
      </a>
      <div className='flex min-h-screen flex-col pt-16'>
        <SiteHeader
          items={navigationItems}
          language={language}
          logoSrc='/logo4.png'
          phoneNumber={contactDetails.phoneNumber}
          email={contactDetails.email}
          onLanguageChange={handleLanguageChange} />
        <main id='main-content' tabIndex={-1} className='flex-grow outline-none'>
          <Suspense fallback={<RouteLoadingFallback language={language} />}>
            <PageContent
              content={localizedSiteContent}
              language={language}
              onOfferPlansNeeded={ensureOfferPlans} />
          </Suspense>
        </main>
        <SiteFooter
          contactDetails={contactDetails}
          language={language}
          navigationItems={navigationItems}
          onLanguageChange={handleLanguageChange} />
      </div>
      </LocalizedLinkProvider>
    </BrowserRouter>
  );
}

export default App;
