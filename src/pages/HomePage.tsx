import {
  Reveal,
  ScrollCue,
  ScrollStory,
  StorySection,
  type StoryNavigationItem,
} from '@/components/immersive/ScrollStory';
import { navigateToStorySection } from '@/lib/section-navigation';
import { Button } from '@/components/ui/button';
import type { Language } from '@/lib/i18n';
import type { HomePageContent } from '@/types/site-content';
import {
  ArrowRight,
  BrainCircuit,
  Calculator,
  CalendarDays,
  Check,
  Crown,
  MapPin,
  MessageCircle,
  Route,
  Sparkles,
  Target,
} from 'lucide-react';
import { Link } from '@/components/navigation/LocalizedLink';

type HomePageProps = {
  content: HomePageContent,
  language: Language,
};

const homeCopy = {
  pl: {
    progressLabel: 'Sekcje strony głównej',
    sections: [
      { id: 'home-start', label: 'Początek' },
      { id: 'home-paths', label: 'Dwie ścieżki' },
      { id: 'home-method', label: 'Jak pracujemy' },
      { id: 'home-results', label: 'Co zostaje' },
      { id: 'home-next', label: 'Następny krok' },
    ] satisfies StoryNavigationItem[],
    heroKicker: 'Matematyka i szachy • online i stacjonarnie',
    heroTitle: 'Każdy uczeń myśli inaczej.',
    heroLead:
      'Dlatego sposób tłumaczenia dopasowujemy do konkretnej osoby.',
    heroPrimary: 'Zapisz ucznia',
    heroSecondary: 'Zobacz kierunki',
    scroll: 'Zobacz, jak pracujemy',
    facts: [
      { value: 'od 2020 roku', label: 'prowadzimy regularne zajęcia' },
      { value: 'indywidualnie i w grupach', label: 'zależnie od poziomu i celu' },
      { value: 'online i stacjonarnie', label: 'w formie wygodnej dla ucznia' },
    ],
    pathsKicker: 'Zakres zajęć',
    pathsTitle: 'Matematyka czy szachy?',
    pathsLead:
      'Jeśli nie wiesz, który format będzie odpowiedni, pomożemy go wybrać na podstawie wieku, poziomu i celu ucznia.',
    chess: {
      kicker: 'Szachy',
      title: 'Nauka gry i świadomego planowania.',
      lead: 'Od zasad dla początkujących po analizę partii i przygotowanie turniejowe.',
      chips: ['dla początkujących', 'grupy i zajęcia 1:1', 'szkoły i firmy'],
      action: 'Zobacz zajęcia szachowe',
      imageAlt: 'Uczeń i instruktor analizują pozycję na szachownicy',
    },
    math: {
      kicker: 'Matematyka',
      title: 'Zrozumienie zamiast zapamiętywania schematów.',
      lead: 'Pomagamy w bieżącym materiale, uzupełnianiu braków oraz przygotowaniu do egzaminu ósmoklasisty i matury.',
      chips: ['szkoła podstawowa', 'szkoła średnia', 'przygotowanie do egzaminów'],
      action: 'Zobacz zajęcia z matematyki',
      imageAlt: 'Uczeń pracuje nad matematyką z korepetytorem',
    },
    methodKicker: 'Sposób pracy',
    methodTitle: 'Zaczynamy od tego, co sprawia trudność.',
    methodLead:
      'Najpierw sprawdzamy, co uczeń już rozumie i gdzie pojawia się problem. Na tej podstawie dobieramy wyjaśnienia, ćwiczenia i tempo zajęć.',
    methodSteps: [
      {
        title: 'Sprawdzamy poziom',
        text: 'Krótka rozmowa i kilka zadań pokazują, co jest już opanowane, a co wymaga powtórzenia.',
      },
      {
        title: 'Wyjaśniamy krok po kroku',
        text: 'Dzielimy problem na mniejsze części i pokazujemy, dlaczego kolejne kroki prowadzą do rozwiązania.',
      },
      {
        title: 'Uczeń próbuje sam',
        text: 'Nowe podejście od razu wykorzystuje w zadaniu lub partii, przy wsparciu prowadzącego.',
      },
      {
        title: 'Utrwalamy materiał',
        text: 'Wracamy do najważniejszych elementów, sprawdzamy postęp i planujemy dalszą pracę.',
      },
    ],
    resultsKicker: 'Po zajęciach',
    resultsTitle: 'Uczeń wie, co robi.',
    resultsLead:
      'Rozumie metodę i potrafi wykorzystać ją przy kolejnym zadaniu.',
    results: [
      'wie, jak zacząć zadanie',
      'rozumie przyczynę błędu',
      'potrafi sprawdzić swoje rozwiązanie',
      'zna kolejny krok w nauce',
    ],
    quote: 'Regularna praca przynosi lepsze efekty niż nauka na ostatnią chwilę.',
    nextKicker: 'Kontakt i zapisy',
    nextTitle: 'Napisz, czego potrzebuje uczeń.',
    nextLead:
      'Podaj wiek, poziom i aktualny cel. Odpowiemy, jaki format zajęć może być odpowiedni i jakie terminy są dostępne.',
    nextPrimary: 'Zapisz ucznia',
    nextSecondary: 'Zapytaj o dobór zajęć',
  },
  en: {
    progressLabel: 'Homepage sections',
    sections: [
      { id: 'home-start', label: 'Start' },
      { id: 'home-paths', label: 'Two paths' },
      { id: 'home-method', label: 'How we work' },
      { id: 'home-results', label: 'What remains' },
      { id: 'home-next', label: 'Next step' },
    ] satisfies StoryNavigationItem[],
    heroKicker: 'Maths and chess • online and in person',
    heroTitle: 'Every student thinks differently.',
    heroLead:
      'That is why we adapt the way we explain things to the individual student.',
    heroPrimary: 'Enrol a student',
    heroSecondary: 'See both paths',
    scroll: 'See how we teach',
    facts: [
      { value: 'teaching since 2020', label: 'with regular weekly lessons' },
      { value: 'one-to-one and groups', label: 'depending on level and goals' },
      { value: 'online and in person', label: 'in the format that works best' },
    ],
    pathsKicker: 'Subjects',
    pathsTitle: 'Maths or chess?',
    pathsLead:
      'If you are unsure which format would work best, we can recommend one based on the student’s age, level and goals.',
    chess: {
      kicker: 'Chess',
      title: 'Learn the game and how to plan ahead.',
      lead: 'From the rules for beginners to game analysis and tournament preparation.',
      chips: ['for beginners', 'groups and one-to-one', 'schools and companies'],
      action: 'See chess lessons',
      imageAlt: 'A student and instructor analyse a chess position',
    },
    math: {
      kicker: 'Mathematics',
      title: 'Understand the method instead of memorising a formula.',
      lead: 'We help with current schoolwork, fill knowledge gaps and prepare students for the Grade 8 exam and Matura.',
      chips: ['primary school', 'secondary school', 'exam preparation'],
      action: 'See maths lessons',
      imageAlt: 'A student works on mathematics with a tutor',
    },
    methodKicker: 'How lessons work',
    methodTitle: 'We begin with the part the student finds difficult.',
    methodLead:
      'First we check what the student already understands and where the problem begins. That tells us how to explain the topic and which exercises to use.',
    methodSteps: [
      {
        title: 'Check the current level',
        text: 'A short conversation and a few tasks show what is already secure and what needs revisiting.',
      },
      {
        title: 'Explain it step by step',
        text: 'We divide the problem into smaller parts and show why each step leads to the next.',
      },
      {
        title: 'Let the student try',
        text: 'The student applies the new approach to a problem or game with support from the tutor.',
      },
      {
        title: 'Review and consolidate',
        text: 'We return to the key points, check progress and plan what to work on next.',
      },
    ],
    resultsKicker: 'After the lesson',
    resultsTitle: 'The student knows what they are doing.',
    resultsLead:
      'They understand the method and can use it in the next problem.',
    results: [
      'knows how to start a problem',
      'understands the cause of an error',
      'can check their own solution',
      'knows what to practise next',
    ],
    quote: 'Regular practice works better than last-minute revision.',
    nextKicker: 'Contact and enrolment',
    nextTitle: 'Tell us what the student needs.',
    nextLead:
      'Include the student’s age, current level and goal. We will recommend a suitable format and let you know which times are available.',
    nextPrimary: 'Enrol a student',
    nextSecondary: 'Ask which format fits',
  },
};

export default function HomePage({ content, language }: HomePageProps) {
  const copy = homeCopy[language];

  return (
    <ScrollStory items={copy.sections} ariaLabel={copy.progressLabel}>
      <StorySection id='home-start' className='min-h-[calc(100svh-4rem)] bg-[#071712] py-0 text-white'>
        <img
          src='/redesign/home-hero.webp'
          srcSet='/redesign/home-hero-640.webp 640w, /redesign/home-hero-1024.webp 1024w, /redesign/home-hero-1536.webp 1536w'
          sizes='100vw'
          alt=''
          width='1672'
          height='941'
          {...{ fetchpriority: 'high' }}
          decoding='async'
          className='absolute inset-0 h-full w-full object-cover object-[68%_center]' />
        <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,16,0.98)_0%,rgba(5,20,16,0.88)_43%,rgba(5,20,16,0.32)_78%,rgba(5,20,16,0.3)_100%)]'>
        </div>
        <div className='story-grid-art'>
        </div>
        <div className='story-ring-art -right-32 -top-28'>
        </div>

        <div className='container relative z-10 flex min-h-[calc(100svh-4rem)] items-center px-4 py-16 lg:py-20'>
          <div className='w-full max-w-5xl'>
            <Reveal>
              <p className='story-kicker text-[#b9f3dc]'>
                {copy.heroKicker}
              </p>
              <h1 className='story-display mt-7 max-w-5xl text-white'>
                {copy.heroTitle}
              </h1>
            </Reveal>

            <Reveal delay={120} className='mt-7'>
              <p className='story-lead text-white/[0.78]'>
                {copy.heroLead}
              </p>
            </Reveal>

            <Reveal delay={220} className='mt-9 flex flex-col gap-3 sm:flex-row'>
              <Button asChild size='lg' className='h-14 rounded-full bg-[#f5b942] px-7 font-black text-[#0a1713] shadow-[0_14px_40px_rgba(245,185,66,0.22)] hover:bg-[#ffd071]'>
                <Link to='/zapisz'>
                  {copy.heroPrimary}
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
              </Button>
              <Button asChild size='lg' variant='outline' className='h-14 rounded-full border-white/25 bg-white/[0.12] px-7 font-black text-white hover:bg-white hover:text-[#0a1713]'>
                <button type='button' onClick={() => navigateToStorySection('home-paths')}>
                  {copy.heroSecondary}
                </button>
              </Button>
            </Reveal>

            <Reveal delay={320} className='mt-12 grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-white/[0.15] bg-white/10 sm:grid-cols-3'>
              {copy.facts.map((fact) => (
                <div key={fact.label} className='bg-[#071712]/90 p-5'>
                  <p className='text-lg font-black text-white'>
                    {fact.value}
                  </p>
                  <p className='mt-1 text-xs font-bold leading-5 text-white/70'>
                    {fact.label}
                  </p>
                </div>
              ))}
            </Reveal>

            <Reveal delay={420} className='mt-10 text-white/[0.65]'>
              <ScrollCue label={copy.scroll} />
            </Reveal>
          </div>
        </div>
      </StorySection>

      <StorySection id='home-paths' className='bg-[#f7f1e6] text-[#0a1713]'>
        <div className='story-orb -left-36 -top-28 bg-[#b9f3dc]/[0.55]'>
        </div>
        <div className='story-orb -bottom-44 right-0 bg-[#f5b942]/[0.35] [animation-delay:-6s]'>
        </div>

        <div className='container relative z-10 px-4'>
          <Reveal className='max-w-4xl'>
            <p className='story-kicker text-[#126044]'>
              {copy.pathsKicker}
            </p>
            <h2 className='story-title mt-6'>
              {copy.pathsTitle}
            </h2>
            <p className='story-lead mt-6 text-[#365a50]'>
              {copy.pathsLead}
            </p>
          </Reveal>

          <div className='mt-12 grid gap-6 lg:grid-cols-2'>
            <Reveal delay={120}>
              <Link to={`/${content.chessPath}`} className='story-card story-card-chess group grid h-full min-h-[40rem] grid-rows-[20rem_1fr] bg-[#11372e] text-white sm:grid-rows-[22rem_1fr] xl:grid-rows-[24rem_1fr]'>
                <div className='relative overflow-hidden'>
                  <img
                    src='/redesign/story-chess-focus.webp'
                    srcSet='/redesign/story-chess-focus-640.webp 640w, /redesign/story-chess-focus-1024.webp 1024w, /redesign/story-chess-focus.webp 1536w'
                    sizes='(min-width: 1536px) 660px, (min-width: 1280px) 600px, (min-width: 1024px) 472px, (min-width: 768px) 736px, (min-width: 640px) 608px, calc(100vw - 2rem)'
                    alt={copy.chess.imageAlt}
                    width='1536'
                    height='1024'
                    loading='lazy'
                    decoding='async'
                    className='story-photo absolute inset-0' />
                  <div className='absolute inset-0 bg-gradient-to-t from-[#0a1713] via-transparent to-transparent'>
                  </div>
                  <span className='absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5b942] text-[#0a1713] shadow-lg'>
                    <Crown className='h-6 w-6' />
                  </span>
                </div>
                <div className='relative flex flex-col p-8 sm:p-10'>
                  <p className='story-kicker text-[#b9f3dc]'>
                    {copy.chess.kicker}
                  </p>
                  <h3 className='mt-5 text-[2.5rem] font-black leading-[1.02] tracking-[-0.045em] xl:text-[2.75rem]'>
                    {copy.chess.title}
                  </h3>
                  <p className='mt-5 max-w-xl text-lg leading-8 text-white/[0.68] lg:min-h-16'>
                    {copy.chess.lead}
                  </p>
                  <div className='mt-6 flex flex-wrap gap-2.5'>
                    {copy.chess.chips.map((chip) => (
                      <span key={chip} className='rounded-full border border-white/[0.15] bg-white/[0.07] px-3.5 py-2 text-sm font-bold text-white/[0.72]'>
                        {chip}
                      </span>
                    ))}
                  </div>
                  <span className='mt-auto inline-flex items-center gap-2 pt-9 text-lg font-black text-[#f5b942]'>
                    {copy.chess.action}
                    <ArrowRight className='h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5' />
                  </span>
                </div>
              </Link>
            </Reveal>

            <Reveal delay={220}>
              <Link to={`/${content.mathPath}`} className='story-card story-card-math group grid h-full min-h-[40rem] grid-rows-[20rem_1fr] bg-[#e4dcff] text-[#18122b] sm:grid-rows-[22rem_1fr] xl:grid-rows-[24rem_1fr]'>
                <div className='relative overflow-hidden'>
                  <img
                    src='/redesign/math-group.webp'
                    srcSet='/redesign/math-group-640.webp 640w, /redesign/math-group-1024.webp 1024w, /redesign/math-group.webp 1536w'
                    sizes='(min-width: 1536px) 660px, (min-width: 1280px) 600px, (min-width: 1024px) 472px, (min-width: 768px) 736px, (min-width: 640px) 608px, calc(100vw - 2rem)'
                    alt={language === 'pl' ? 'Kameralna grupa uczniów pracuje nad matematyką' : 'A small group of students works on mathematics'}
                    width='1536'
                    height='1024'
                    loading='lazy'
                    decoding='async'
                    className='story-photo absolute inset-0' />
                  <div className='absolute inset-0 bg-gradient-to-t from-[#e4dcff] via-transparent to-transparent'>
                  </div>
                  <span className='absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#18122b] text-[#f5b942] shadow-lg'>
                    <Calculator className='h-6 w-6' />
                  </span>
                </div>
                <div className='relative flex flex-col p-8 sm:p-10'>
                  <p className='story-kicker text-[#5e429f]'>
                    {copy.math.kicker}
                  </p>
                  <h3 className='mt-5 text-[2.5rem] font-black leading-[1.02] tracking-[-0.045em] xl:text-[2.75rem]'>
                    {copy.math.title}
                  </h3>
                  <p className='mt-5 max-w-xl text-lg leading-8 text-[#4b4168] lg:min-h-16'>
                    {copy.math.lead}
                  </p>
                  <div className='mt-6 flex flex-wrap gap-2.5'>
                    {copy.math.chips.map((chip) => (
                      <span key={chip} className='rounded-full border border-[#6f55b8]/[0.15] bg-white/[0.35] px-3.5 py-2 text-sm font-bold text-[#4b4168]'>
                        {chip}
                      </span>
                    ))}
                  </div>
                  <span className='mt-auto inline-flex items-center gap-2 pt-9 text-lg font-black text-[#5c419f]'>
                    {copy.math.action}
                    <ArrowRight className='h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5' />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </StorySection>

      <StorySection deferRendering deferIntrinsicSize='900px' id='home-method' className='bg-[#103a30] text-white'>
        <div className='story-grid-art opacity-25'>
        </div>
        <div className='story-orb -right-40 top-0 bg-[#187b5d]/70'>
        </div>
        <div className='story-ring-art -bottom-40 -left-28'>
        </div>

        <div className='container relative z-10 grid gap-12 px-4 lg:grid-cols-[0.88fr_1.12fr] lg:items-center'>
          <Reveal>
            <p className='story-kicker text-[#b9f3dc]'>
              {copy.methodKicker}
            </p>
            <h2 className='story-title mt-6 max-w-3xl text-white'>
              {copy.methodTitle}
            </h2>
            <p className='story-lead mt-7 text-white/[0.68]'>
              {copy.methodLead}
            </p>
            <div className='mt-9 inline-flex items-center gap-3 rounded-full border border-white/[0.15] bg-white/[0.06] px-5 py-3 text-sm font-bold text-[#b9f3dc]'>
              <BrainCircuit className='h-5 w-5' />
              {copy.quote}
            </div>
          </Reveal>

          <div className='grid gap-4 sm:grid-cols-2'>
            {copy.methodSteps.map((step, index) => {
              const icons = [Target, Sparkles, Route, CalendarDays];
              const Icon = icons[index];

              return (
                <Reveal key={step.title} delay={100 + index * 90}>
                  <article className='story-glass h-full min-h-[16rem] p-6 text-white'>
                    <div className='flex items-center justify-between'>
                      <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5b942] text-[#0a1713]'>
                        <Icon className='h-5 w-5' />
                      </span>
                      <span className='text-sm font-black text-white/70'>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className='mt-8 text-2xl font-black tracking-[-0.03em]'>
                      {step.title}
                    </h3>
                    <p className='mt-3 text-sm leading-7 text-white/[0.64]'>
                      {step.text}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </StorySection>

      <StorySection deferRendering deferIntrinsicSize='900px' id='home-results' className='bg-[#e8e0ff] text-[#18122b]'>
        <div className='story-orb -bottom-48 -left-32 bg-[#b9f3dc]/70'>
        </div>
        <div className='story-orb -right-40 -top-40 bg-[#f5b942]/[0.35] [animation-delay:-8s]'>
        </div>

        <div className='container relative z-10 grid gap-12 px-4 lg:grid-cols-[1.04fr_0.96fr] lg:items-center'>
          <Reveal className='story-photo-frame min-h-[30rem] lg:min-h-[42rem]'>
            <img
              src='/redesign/math-one-to-one.webp'
              srcSet='/redesign/math-one-to-one-640.webp 640w, /redesign/math-one-to-one-1024.webp 1024w, /redesign/math-one-to-one.webp 1536w'
              sizes='(min-width: 1536px) 687px, (min-width: 1280px) 624px, (min-width: 1024px) 491px, (min-width: 768px) 736px, (min-width: 640px) 608px, calc(100vw - 2rem)'
              alt={copy.math.imageAlt}
              width='1536'
              height='1024'
              loading='lazy'
              decoding='async'
              className='story-photo absolute inset-0 object-[48%_center]' />
            <div className='absolute inset-x-5 bottom-5 z-10 rounded-2xl border border-white/20 bg-[#0a1713]/95 p-6 text-white sm:inset-x-8 sm:bottom-8'>
              <BrainCircuit className='h-6 w-6 text-[#f5b942]' />
              <p className='mt-3 text-xl font-black leading-snug sm:text-2xl'>
                {copy.quote}
              </p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className='story-kicker text-[#5e429f]'>
                {copy.resultsKicker}
              </p>
              <h2 className='story-title mt-6'>
                {copy.resultsTitle}
              </h2>
              <p className='story-lead mt-7 text-[#4b4168]'>
                {copy.resultsLead}
              </p>
            </Reveal>

            <div className='mt-9 grid gap-3'>
              {copy.results.map((result, index) => (
                <Reveal key={result} delay={100 + index * 80}>
                  <div className='story-paper flex items-center gap-4 p-4 sm:p-5'>
                    <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#123d32] text-[#b9f3dc]'>
                      <Check className='h-5 w-5' />
                    </span>
                    <span className='font-bold leading-6 text-[#2d2545]'>
                      {result}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </StorySection>

      <StorySection deferRendering deferIntrinsicSize='800px' id='home-next' className='bg-[#f5b942] text-[#0a1713]'>
        <div className='story-grid-art !opacity-20 [background-image:linear-gradient(rgba(10,23,19,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(10,23,19,0.1)_1px,transparent_1px)]'>
        </div>
        <div className='story-ring-art -right-24 top-1/2 !border-[#0a1713]/[0.15] !shadow-[0_0_0_3rem_rgba(10,23,19,0.025),0_0_0_7rem_rgba(10,23,19,0.02),0_0_0_12rem_rgba(10,23,19,0.015)]'>
        </div>

        <div className='container relative z-10 px-4'>
          <Reveal className='max-w-6xl'>
            <p className='story-kicker text-[#123d32]'>
              {copy.nextKicker}
            </p>
            <h2 className='story-title mt-7 max-w-6xl'>
              {copy.nextTitle}
            </h2>
            <p className='story-lead mt-7 text-[#29483f]'>
              {copy.nextLead}
            </p>
          </Reveal>

          <Reveal delay={160} className='mt-10 flex flex-col gap-3 sm:flex-row'>
            <Button asChild size='lg' className='h-14 rounded-full bg-[#0a1713] px-7 font-black text-white hover:bg-[#123d32]'>
              <Link to='/zapisz'>
                {copy.nextPrimary}
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
            <Button asChild size='lg' variant='outline' className='h-14 rounded-full border-[#0a1713]/25 bg-white/30 px-7 font-black text-[#0a1713] hover:bg-white/70'>
              <Link to='/kontakt'>
                {copy.nextSecondary}
                <MessageCircle className='ml-2 h-5 w-5' />
              </Link>
            </Button>
          </Reveal>

          <Reveal delay={260} className='mt-14 flex flex-wrap gap-3'>
            <span className='story-chip border-[#0a1713]/[0.15] bg-white/30'>
              <MapPin className='h-4 w-4' />
              {copy.facts[2].value}
            </span>
            <span className='story-chip border-[#0a1713]/[0.15] bg-white/30'>
              <CalendarDays className='h-4 w-4' />
              {copy.facts[1].value}
            </span>
          </Reveal>
        </div>
      </StorySection>
    </ScrollStory>
  );
}
