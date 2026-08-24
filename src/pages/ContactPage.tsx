import { Button } from '@/components/ui/button';
import {
  Reveal,
  ScrollCue,
  ScrollStory,
  StorySection,
  type StoryNavigationItem,
} from '@/components/immersive/ScrollStory';
import { navigateToStorySection } from '@/lib/section-navigation';
import { getPhoneHref } from '@/lib/contact';
import type { Language } from '@/lib/i18n';
import type { ContactDetails } from '@/types/site-content';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CreditCard,
  FileText,
  type LucideIcon,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { Link } from '@/components/navigation/LocalizedLink';

type ContactPageProps = {
  contactDetails: ContactDetails,
  language: Language,
};

type ContactMethod = {
  title: string,
  description: string,
  actionLabel: string,
  href: string,
  Icon: LucideIcon,
};

const contactCopy = {
  pl: {
    heroEyebrow: 'Kontakt',
    heroTitle: 'Porozmawiajmy o zajęciach',
    heroLead:
      'Napisz, z czym uczeń potrzebuje pomocy. Zaproponujemy odpowiednie zajęcia, poziom i termin oraz wyjaśnimy sposób rozliczenia.',
    methodsEyebrow: 'Wybierz wygodny kontakt',
    methodsTitle: 'Krótka rozmowa wystarczy, żeby ustalić dobry początek.',
    methodsLead: 'Telefon sprawdzi się przy szybkim pytaniu. W mailu możesz spokojnie opisać sytuację ucznia lub zakres współpracy.',
    call: 'Zadzwoń',
    writeEmail: 'Napisz maila',
    methods: {
      phone: {
        title: 'Telefon',
        description: 'Najlepszy wybór, jeśli chcesz szybko ustalić, od czego zacząć.',
      },
      email: {
        title: 'E-mail',
        description: 'Dobry, gdy chcesz opisać sytuację ucznia albo zapytać o współpracę.',
      },
      address: {
        title: 'Adres',
        description: 'Dane firmowe i rozliczeniowe dla rodziców, szkół oraz partnerów.',
        actionLabel: 'Zapłocie 23, Pawłowice',
      },
    },
    companyEyebrow: 'Dane firmy',
    companyTitle: 'Mistrzowie Logiki',
    companyDetails: [
      ['Nazwa', 'Mistrzowie Logiki - Wojciech Szmidt'],
      ['Adres', 'Zapłocie 23, Pawłowice 43-250'],
      ['NIP', '6381841359'],
      ['REGON', '385981838'],
    ],
    paymentEyebrow: 'Dane do przelewu',
    paymentTitle: 'Płatność po podsumowaniu miesiąca',
    paymentLead: 'Po zakończeniu miesiąca wysyłamy informację o zajęciach i kwocie do zapłaty. Poniżej są dane do przelewu.',
    paymentDetails: [
      ['Odbiorca', 'Wojciech Szmidt'],
      ['Numer konta', '77 1050 1605 1000 0092 7700 5980'],
      ['Bank', 'ING Bank Śląski'],
    ],
    transferEyebrow: 'Tytuł przelewu',
    transferTitle: 'Wpisz czytelny tytuł przelewu.',
    paymentTitles: [
      {
        title: 'Zajęcia indywidualne',
        example: 'Imię i nazwisko dziecka + miesiąc zajęć',
        hint: 'np. Jan Kowalski — marzec',
      },
      {
        title: 'Zajęcia grupowe',
        example: 'Imię i nazwisko dziecka, szkoła, klasa + miesiąc zajęć',
        hint: 'np. Jan Kowalski, SP 1 Wrocław, klasa 5 — marzec',
      },
    ],
    ctaEyebrow: 'Zapis na zajęcia',
    ctaTitle: 'Zacznijmy od krótkiego zgłoszenia.',
    ctaLead: 'Podaj podstawowe informacje. Skontaktujemy się, żeby dobrać zajęcia i dogodny termin.',
    ctaStepsTitle: 'Jak to działa',
    ctaSteps: ['Dane ucznia', 'Wybór zajęć', 'Potwierdzenie mailowe'],
    enroll: 'Zapisz ucznia',
    heroImageAlt: 'Koordynatorka rozmawia telefonicznie o zajęciach',
  },
  en: {
    heroEyebrow: 'Contact',
    heroTitle: 'Let’s talk about classes',
    heroLead:
      'Tell us what the student needs help with. We will suggest a suitable class, level and schedule, and explain how billing works.',
    methodsEyebrow: 'Choose what works for you',
    methodsTitle: 'A short conversation is enough to find a sensible starting point.',
    methodsLead: 'Call with a quick question, or use email to describe the student’s situation or the scope of cooperation in more detail.',
    call: 'Call us',
    writeEmail: 'Write an email',
    methods: {
      phone: {
        title: 'Phone',
        description: 'Best if you want to quickly decide where to start.',
      },
      email: {
        title: 'E-mail',
        description: 'Good when you want to describe the student’s situation or ask about cooperation.',
      },
      address: {
        title: 'Address',
        description: 'Company and billing details for parents, schools and partners.',
        actionLabel: 'Zapłocie 23, Pawłowice',
      },
    },
    companyEyebrow: 'Company details',
    companyTitle: 'Mistrzowie Logiki',
    companyDetails: [
      ['Name', 'Mistrzowie Logiki - Wojciech Szmidt'],
      ['Address', 'Zapłocie 23, Pawłowice 43-250, Poland'],
      ['Tax ID', '6381841359'],
      ['REGON', '385981838'],
    ],
    paymentEyebrow: 'Bank transfer details',
    paymentTitle: 'Payment after the monthly summary',
    paymentLead: 'At the end of the month, we send the class summary and amount due. Bank transfer details are below.',
    paymentDetails: [
      ['Recipient', 'Wojciech Szmidt'],
      ['Account number', '77 1050 1605 1000 0092 7700 5980'],
      ['Bank', 'ING Bank Śląski'],
    ],
    transferEyebrow: 'Transfer title',
    transferTitle: 'Use a clear transfer title.',
    paymentTitles: [
      {
        title: 'Individual classes',
        example: 'Child’s full name + class month',
        hint: 'e.g. Jan Kowalski — March',
      },
      {
        title: 'Group classes',
        example: 'Child’s full name, school, class + class month',
        hint: 'e.g. Jan Kowalski, SP 1 Wrocław, grade 5 — March',
      },
    ],
    ctaEyebrow: 'Class registration',
    ctaTitle: 'Start with a short form.',
    ctaLead: 'Share the essential details. We’ll get in touch to choose the right class and a convenient time.',
    ctaStepsTitle: 'How it works',
    ctaSteps: ['Student details', 'Class selection', 'Email confirmation'],
    enroll: 'Enrol a student',
    heroImageAlt: 'An education coordinator discusses lessons by phone',
  },
} satisfies Record<Language, {
  call: string,
  companyDetails: string[][],
  companyEyebrow: string,
  companyTitle: string,
  ctaEyebrow: string,
  ctaLead: string,
  ctaSteps: string[],
  ctaStepsTitle: string,
  ctaTitle: string,
  enroll: string,
  heroEyebrow: string,
  heroImageAlt: string,
  heroLead: string,
  heroTitle: string,
  methodsEyebrow: string,
  methodsLead: string,
  methodsTitle: string,
  methods: {
    address: { actionLabel: string, description: string, title: string },
    email: { description: string, title: string },
    phone: { description: string, title: string },
  },
  paymentDetails: string[][],
  paymentEyebrow: string,
  paymentLead: string,
  paymentTitle: string,
  paymentTitles: Array<{ example: string, hint: string, title: string }>,
  transferEyebrow: string,
  transferTitle: string,
  writeEmail: string,
}>;

function ContactMethodCard({ method }: { method: ContactMethod }) {
  const { Icon } = method;
  const isPageAnchor = method.href.startsWith('#');
  const handlePageAnchorClick = () => {
    navigateToStorySection(method.href.slice(1));
  };

  return (
    <article className='story-card flex h-full min-h-[20rem] min-w-0 flex-col p-6 sm:p-7'>
      <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#123d32] text-[#b9f3dc] shadow-[0_14px_30px_rgba(18,61,50,0.18)]'>
        <Icon className='h-6 w-6' />
      </div>
      <h3 className='mt-7 text-2xl font-black tracking-[-0.03em] text-[#0a1713]'>
        {method.title}
      </h3>
      <p className='mt-3 text-sm leading-7 text-[#385047]'>
        {method.description}
      </p>
      {isPageAnchor
        ? (
          <Button
            className='mt-auto h-auto min-h-12 w-full whitespace-normal rounded-full bg-[#187b5d] px-4 py-3 font-black text-white shadow-[0_12px_28px_rgba(24,123,93,0.2)] hover:bg-[#123d32]'
            onClick={handlePageAnchorClick}>
            <span className='min-w-0 break-words text-center'>
              {method.actionLabel}
            </span>
            <ArrowRight className='ml-2 h-5 w-5 shrink-0' />
          </Button>
        )
        : (
          <Button
            asChild
            className='mt-auto h-auto min-h-12 w-full whitespace-normal rounded-full bg-[#187b5d] px-4 py-3 font-black text-white shadow-[0_12px_28px_rgba(24,123,93,0.2)] hover:bg-[#123d32]'>
            <a href={method.href}>
              <span className='min-w-0 break-all text-center'>
                {method.actionLabel}
              </span>
              <ArrowRight className='ml-2 h-5 w-5 shrink-0' />
            </a>
          </Button>
        )}
    </article>
  );
}

export default function ContactPage({ contactDetails, language }: ContactPageProps) {
  const copy = contactCopy[language];
  const phoneHref = getPhoneHref(contactDetails.phoneNumber);
  const emailHref = `mailto:${contactDetails.email}`;
  const sections: StoryNavigationItem[] = language === 'pl'
    ? [
        { id: 'contact-start', label: 'Początek' },
        { id: 'contact-methods', label: 'Kontakt' },
        { id: 'company-details', label: 'Dane i płatność' },
        { id: 'contact-transfer', label: 'Tytuł przelewu' },
        { id: 'contact-next', label: 'Następny krok' },
      ]
    : [
        { id: 'contact-start', label: 'Start' },
        { id: 'contact-methods', label: 'Contact' },
        { id: 'company-details', label: 'Details and payment' },
        { id: 'contact-transfer', label: 'Transfer title' },
        { id: 'contact-next', label: 'Next step' },
      ];
  const contactMethods: ContactMethod[] = [
    {
      title: copy.methods.phone.title,
      description: copy.methods.phone.description,
      actionLabel: contactDetails.phoneNumber,
      href: phoneHref,
      Icon: Phone,
    },
    {
      title: copy.methods.email.title,
      description: copy.methods.email.description,
      actionLabel: contactDetails.email,
      href: emailHref,
      Icon: Mail,
    },
    {
      title: copy.methods.address.title,
      description: copy.methods.address.description,
      actionLabel: copy.methods.address.actionLabel,
      href: '#company-details',
      Icon: MapPin,
    },
  ];

  return (
    <ScrollStory
      items={sections}
      ariaLabel={language === 'pl' ? 'Sekcje strony kontaktowej' : 'Contact page sections'}>
      <StorySection id='contact-start' className='min-h-[calc(100svh-4rem)] bg-[#071712] py-0 text-white'>
        <img
          src='/redesign/contact-hero.webp'
          srcSet='/redesign/contact-hero-640.webp 640w, /redesign/contact-hero-1024.webp 1024w, /redesign/contact-hero.webp 1536w'
          sizes='100vw'
          alt=''
          width='1536'
          height='1024'
          {...{ fetchpriority: 'high' }}
          decoding='async'
          className='absolute inset-0 h-full w-full object-cover object-[68%_center]' />
        <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,16,0.98)_0%,rgba(5,20,16,0.9)_45%,rgba(5,20,16,0.38)_82%,rgba(5,20,16,0.3)_100%)]'>
        </div>
        <div className='story-grid-art'>
        </div>
        <div className='story-ring-art -right-40 -top-28'>
        </div>

        <div className='container relative z-10 flex min-h-[calc(100svh-4rem)] items-center px-4 py-16 lg:py-20'>
          <div className='w-full max-w-5xl'>
            <Reveal>
              <p className='story-kicker text-[#b9f3dc]'>
                {copy.heroEyebrow}
              </p>
              <h1 className='story-display mt-7 max-w-4xl !text-[clamp(2.3rem,11.5vw,7rem)] text-white'>
                {copy.heroTitle}
              </h1>
            </Reveal>

            <Reveal delay={120} className='mt-7'>
              <p className='story-lead text-white/[0.78]'>
                {copy.heroLead}
              </p>
            </Reveal>

            <Reveal delay={220} className='mt-9 flex flex-col gap-3 sm:flex-row'>
              <Button
                asChild
                size='lg'
                className='h-14 rounded-full bg-[#f5b942] px-7 font-black text-[#0a1713] shadow-[0_14px_40px_rgba(245,185,66,0.22)] hover:bg-[#ffd071]'>
                <a href={phoneHref}>
                  {copy.call}
                  <Phone className='ml-2 h-5 w-5' />
                </a>
              </Button>
              <Button
                asChild
                size='lg'
                variant='outline'
                className='h-14 rounded-full border-white/25 bg-white/[0.12] px-7 font-black text-white hover:bg-white hover:text-[#0a1713]'>
                <a href={emailHref}>
                  {copy.writeEmail}
                  <Mail className='ml-2 h-5 w-5' />
                </a>
              </Button>
            </Reveal>

            <Reveal delay={340} className='mt-12'>
              <ScrollCue label={language === 'pl' ? 'Przewiń po konkretne dane' : 'Scroll for the practical details'} />
            </Reveal>
          </div>
        </div>
      </StorySection>

      <StorySection id='contact-methods' className='bg-[#f7f1e6]'>
        <div className='story-orb -left-48 top-10 bg-[#d9cffb]/[0.55]'>
        </div>
        <div className='container relative z-10 min-w-0 px-4'>
          <Reveal className='max-w-4xl'>
            <p className='story-kicker text-[#126044]'>
              {copy.methodsEyebrow}
            </p>
            <h2 className='story-title mt-6 text-[#0a1713]'>
              {copy.methodsTitle}
            </h2>
            <p className='story-lead mt-6 text-[#385047]'>
              {copy.methodsLead}
            </p>
          </Reveal>

          <div className='mt-12 grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {contactMethods.map((method, index) => (
              <Reveal key={method.title} delay={index * 90} className='min-w-0'>
                <ContactMethodCard method={method} />
              </Reveal>
            ))}
          </div>
        </div>
      </StorySection>

      <StorySection id='company-details' className='bg-[#dcecdf]'>
        <div className='story-grid-art opacity-[0.09] [background-image:linear-gradient(rgba(10,23,19,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(10,23,19,0.1)_1px,transparent_1px)]'>
        </div>
        <div className='container relative z-10 grid gap-7 px-4 lg:grid-cols-[0.95fr_1.05fr]'>
          <Reveal>
          <article className='story-paper h-full p-6 sm:p-8 lg:p-10'>
            <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#123d32] text-[#b9f3dc]'>
              <Building2 className='h-6 w-6' />
            </div>
            <p className='story-kicker mt-8 text-[#126044]'>
              {copy.companyEyebrow}
            </p>
            <h2 className='mt-5 text-3xl font-black tracking-[-0.045em] text-[#0a1713] sm:text-4xl'>
              {copy.companyTitle}
            </h2>

            <dl className='mt-8 grid gap-3'>
              {copy.companyDetails.map(([label, value]) => (
                <div key={label} className='rounded-2xl border border-[#123d32]/10 bg-white/[0.65] p-4'>
                  <dt className='text-xs font-black uppercase tracking-[0.13em] text-[#5a6d66]'>
                    {label}
                  </dt>
                  <dd className='mt-2 break-words text-base font-bold text-[#0a1713]'>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
          </Reveal>

          <Reveal delay={130}>
          <article className='story-paper h-full p-6 sm:p-8 lg:p-10'>
            <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5b942] text-[#0a1713]'>
              <CreditCard className='h-6 w-6' />
            </div>
            <p className='story-kicker mt-8 text-[#126044]'>
              {copy.paymentEyebrow}
            </p>
            <h2 className='mt-5 text-3xl font-black tracking-[-0.045em] text-[#0a1713] sm:text-4xl'>
              {copy.paymentTitle}
            </h2>
            <p className='mt-5 text-base leading-8 text-[#385047]'>
              {copy.paymentLead}
            </p>

            <dl className='mt-8 grid gap-3'>
              {copy.paymentDetails.map(([label, value]) => (
                <div key={label} className='rounded-2xl border border-[#123d32]/10 bg-white/[0.65] p-4'>
                  <dt className='text-xs font-black uppercase tracking-[0.13em] text-[#5a6d66]'>
                    {label}
                  </dt>
                  <dd className='mt-2 break-words text-base font-bold text-[#0a1713]'>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
          </Reveal>
        </div>
      </StorySection>

      <StorySection id='contact-transfer' className='bg-[#fffaf1]'>
        <div className='story-orb -right-52 bottom-0 bg-[#f5b942]/25'>
        </div>
        <div className='container relative z-10 grid gap-12 px-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-center'>
          <Reveal>
            <p className='story-kicker text-[#126044]'>
              {copy.transferEyebrow}
            </p>
            <h2 className='story-title story-title-compact mt-6 max-w-xl text-[#0a1713]'>
              {copy.transferTitle}
            </h2>
          </Reveal>

          <div className='grid gap-4'>
            {copy.paymentTitles.map((paymentTitle, index) => (
              <Reveal key={paymentTitle.title} delay={index * 110}>
              <article className='story-card p-6 sm:p-7'>
                <div className='flex items-start gap-4'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#123d32] text-[#b9f3dc] shadow-sm'>
                    <FileText className='h-5 w-5' />
                  </div>
                  <div>
                    <h3 className='text-xl font-black tracking-[-0.025em] text-[#0a1713]'>
                      {paymentTitle.title}
                    </h3>
                    <p className='mt-3 text-sm font-semibold leading-7 text-[#385047]'>
                      {paymentTitle.example}
                    </p>
                    <p className='mt-1 font-mono text-sm leading-7 text-[#126044]'>
                      {paymentTitle.hint}
                    </p>
                  </div>
                </div>
              </article>
              </Reveal>
            ))}
          </div>
        </div>
      </StorySection>

      <StorySection id='contact-next' className='bg-[#0a2a22] text-white'>
        <img
          src='/redesign/contact-welcome.webp'
          srcSet='/redesign/contact-welcome-640.webp 640w, /redesign/contact-welcome-1024.webp 1024w, /redesign/contact-welcome.webp 1536w'
          sizes='100vw'
          alt=''
          loading='lazy'
          decoding='async'
          width='1536'
          height='1024'
          className='absolute inset-0 h-full w-full object-cover object-center opacity-35' />
        <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(7,23,18,0.98),rgba(7,23,18,0.82)_60%,rgba(7,23,18,0.58))]'>
        </div>
        <div className='story-grid-art'>
        </div>

        <div className='container relative z-10 grid gap-8 px-4 lg:grid-cols-[1.05fr_0.75fr] lg:items-center lg:gap-16'>
          <Reveal className='max-w-3xl'>
            <p className='story-kicker text-[#f5b942]'>
              {copy.ctaEyebrow}
            </p>
            <h2 className='story-title story-title-compact mt-6 max-w-3xl text-white'>
              {copy.ctaTitle}
            </h2>
            <p className='story-lead mt-6 max-w-2xl text-emerald-50/75'>
              {copy.ctaLead}
            </p>

            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Button
                asChild
                size='lg'
                className='h-14 rounded-full bg-[#f5b942] px-8 font-black text-[#0a1713] shadow-[0_16px_36px_rgba(245,185,66,0.2)] hover:bg-[#ffd071]'>
                <Link to='/zapisz'>
                  {copy.enroll}
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
              </Button>
              <Button
                asChild
                size='lg'
                variant='outline'
                className='h-14 rounded-full border-white/25 bg-white/[0.08] px-8 font-black text-white backdrop-blur-sm hover:bg-white hover:text-[#0a1713]'>
                <a href={emailHref}>
                  {copy.writeEmail}
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <aside className='rounded-[2rem] border border-white/15 bg-white/[0.09] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.2)] backdrop-blur-md sm:p-7'>
              <p className='text-xs font-black uppercase tracking-[0.18em] text-amber-200'>
                {copy.ctaStepsTitle}
              </p>
              <ol className='mt-5 divide-y divide-white/10'>
                {copy.ctaSteps.map((step, index) => {
                  const StepIcon = [UserRound, ShieldCheck, BadgeCheck][index];

                  return (
                    <li key={step} className='flex items-center gap-4 py-4 first:pt-1 last:pb-1'>
                      <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f5b942] text-[#0a2a22] shadow-[0_10px_24px_rgba(245,185,66,0.18)]'>
                        <StepIcon className='h-5 w-5' />
                      </span>
                      <div className='min-w-0'>
                        <span className='block text-[0.65rem] font-black uppercase tracking-[0.16em] text-emerald-100/45'>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className='mt-1 block text-base font-bold text-white'>
                          {step}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </aside>
          </Reveal>
        </div>
      </StorySection>
    </ScrollStory>
  );
}
