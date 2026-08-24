import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from '@/components/navigation/LocalizedLink';

import { Button } from '@/components/ui/button';
import type { Language } from '@/lib/i18n';

type StatusPageProps = {
  language: Language,
  kind: 'not-found' | 'documents-unavailable',
  email?: string,
};

const copy = {
  pl: {
    'not-found': {
      eyebrow: 'Błąd 404',
      title: 'Tej strony tu nie ma.',
      lead: 'Adres mógł się zmienić albo zawiera literówkę. Wróć na stronę główną i wybierz właściwą sekcję.',
    },
    'documents-unavailable': {
      eyebrow: 'Dokumenty',
      title: 'Dokumenty nie są jeszcze dostępne online.',
      lead: 'Nie pokazujemy pustych ani roboczych plików. W sprawie aktualnych regulaminów skontaktuj się z nami.',
    },
    home: 'Wróć na stronę główną',
    email: 'Napisz do nas',
  },
  en: {
    'not-found': {
      eyebrow: 'Error 404',
      title: 'This page does not exist.',
      lead: 'The address may have changed or contain a typo. Return home and choose the right section.',
    },
    'documents-unavailable': {
      eyebrow: 'Documents',
      title: 'Documents are not available online yet.',
      lead: 'We do not publish empty or draft files. Contact us for the current terms and policies.',
    },
    home: 'Return home',
    email: 'Email us',
  },
} as const;

export default function StatusPage({ email, kind, language }: StatusPageProps) {
  const pageCopy = copy[language];
  const statusCopy = pageCopy[kind];

  return (
    <section className='story-shell relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-[#071712] px-4 py-20 text-white'>
      <div className='story-grid-art' aria-hidden='true' />
      <div className='story-orb -right-40 -top-40 bg-[#187b5d]/45' aria-hidden='true' />
      <div className='relative z-10 mx-auto w-full max-w-3xl text-center'>
        <p className='story-kicker text-[#b9f3dc]'>{statusCopy.eyebrow}</p>
        <h1 className='mt-7 text-[clamp(3rem,8vw,6rem)] font-black leading-[0.92] tracking-[-0.06em]'>
          {statusCopy.title}
        </h1>
        <p className='mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/70'>{statusCopy.lead}</p>
        <div className='mt-10 flex flex-col justify-center gap-3 sm:flex-row'>
          <Button asChild className='h-14 rounded-full bg-[#f5b942] px-7 font-black text-[#071712] hover:bg-[#ffd071]'>
            <Link to='/'><ArrowLeft className='mr-2 h-4 w-4' />{pageCopy.home}</Link>
          </Button>
          {kind === 'documents-unavailable' && email && (
            <Button asChild variant='outline' className='h-14 rounded-full border-white/20 bg-white/5 px-7 font-black text-white hover:bg-white hover:text-[#071712]'>
              <a href={`mailto:${email}`}><Mail className='mr-2 h-4 w-4' />{pageCopy.email}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
