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
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Clock3,
  Eye,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  RotateCcw,
  School,
  Target,
  type LucideIcon,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { Link } from '@/components/navigation/LocalizedLink';

type ChessProgram = {
  actionLabel: string,
  actionType: 'contact' | 'registration',
  bestFor: string,
  description: string,
  eyebrow: string,
  format: string,
  Icon: LucideIcon,
  id: string,
  imageAlt: string,
  imagePosition?: string,
  imageSrc: string,
  navigationLabel: string,
  outcomes: string[],
  title: string,
};

const getResponsiveImageSrcSet = (src: string) =>
  `${src.replace(/\.webp$/, '-640.webp')} 640w, ${src.replace(/\.webp$/, '-1024.webp')} 1024w, ${src} 1536w`;

const chessProgramsByLanguage: Record<Language, ChessProgram[]> = {
  pl: [
    {
      id: 'chess-preschool',
      navigationLabel: 'Przedszkola',
      eyebrow: 'Pierwsze spotkanie z planszą',
      title: 'Pierwsze ruchy przy szachownicy.',
      description:
        'Dzieci poznają figury i zasady poprzez zabawę, zagadki oraz krótkie partie.',
      bestFor: 'Młodsze dzieci, które dopiero poznają figury i zasady gry.',
      format: 'Krótkie aktywności, praca w grupie, dużo praktyki przy planszy.',
      imageSrc: '/redesign/story-chess-young.webp',
      imageAlt: 'Dzieci grają wspólnie w szachy przy stole',
      imagePosition: '48% center',
      Icon: Clock3,
      outcomes: ['rozpoznawanie figur i pól', 'pierwsze świadome ruchy', 'ćwiczenie cierpliwości i uwagi'],
      actionLabel: 'Zapytaj o zajęcia',
      actionType: 'contact',
    },
    {
      id: 'chess-schools',
      navigationLabel: 'Szkoły',
      eyebrow: 'Stały rytm w szkole lub świetlicy',
      title: 'Czas na taktykę i strategię.',
      description:
        'Przechodzimy od utrwalania zasad do planowania i prostych kombinacji.',
      bestFor: 'Klasy, świetlice i koła zainteresowań szukające regularnych zajęć.',
      format: 'Cykliczne spotkania z poziomem dopasowanym do grupy.',
      imageSrc: '/redesign/chess-primary.webp',
      imageAlt: 'Prowadząca omawia pozycję szachową z grupą dzieci w wieku szkolnym',
      imagePosition: '50% center',
      Icon: School,
      outcomes: ['zadania taktyczne', 'partie z rówieśnikami', 'rozmowa o decyzjach przy planszy'],
      actionLabel: 'Zapisz dziecko',
      actionType: 'registration',
    },
    {
      id: 'chess-individual',
      navigationLabel: 'Indywidualnie',
      eyebrow: 'Trening jeden na jeden',
      title: 'Trening dopasowany do ucznia.',
      description:
        'Poziom, rozegrane partie i cel wyznaczają sposób naszej pracy.',
      bestFor: 'Uczeń chce przyspieszyć, uporządkować podstawy albo przygotować się do turnieju.',
      format: 'Online lub stacjonarnie, z regularną informacją zwrotną.',
      imageSrc: '/redesign/chess-individual.webp',
      imageAlt: 'Nastoletnia uczennica analizuje pozycję z trenerem podczas zajęć indywidualnych',
      imagePosition: '50% center',
      Icon: UserRound,
      outcomes: ['analiza własnych partii', 'zadania dobrane do poziomu', 'konkretny plan dalszej pracy'],
      actionLabel: 'Umów trening',
      actionType: 'registration',
    },
    {
      id: 'chess-groups',
      navigationLabel: 'Małe grupy',
      eyebrow: 'Partnerzy na podobnym poziomie',
      title: 'Uczymy się od siebie.',
      description:
        'Każda partia daje okazję do poznania innego pomysłu i sprawdzenia własnego.',
      bestFor: 'Dzieci i młodzież, którym pomaga regularna gra z rówieśnikami.',
      format: 'Małe grupy dobrane poziomem i stały termin spotkań.',
      imageSrc: '/redesign/chess-group.webp',
      imageAlt: 'Nastolatki analizują dwie partie podczas kameralnych zajęć szachowych',
      imagePosition: '50% center',
      Icon: UsersRound,
      outcomes: ['praktyka w różnych pozycjach', 'nauka z cudzych pomysłów', 'spokojna, zdrowa rywalizacja'],
      actionLabel: 'Dołącz do grupy',
      actionType: 'registration',
    },
    {
      id: 'chess-institutions',
      navigationLabel: 'Placówki',
      eyebrow: 'Program i organizacja po naszej stronie',
      title: 'Szachy w Twojej placówce.',
      description:
        'Dopasowujemy program do grupy oraz zapewniamy prowadzącego i potrzebny sprzęt.',
      bestFor: 'Szkoły, przedszkola, biblioteki, domy kultury i lokalne organizacje.',
      format: 'Stały cykl, pojedynczy warsztat lub wydarzenie szachowe.',
      imageSrc: '/redesign/story-chess-workshop.webp',
      imageAlt: 'Dzieci i dorośli grają w szachy podczas wspólnego spotkania',
      imagePosition: '58% center',
      Icon: GraduationCap,
      outcomes: ['program pod wiek uczestników', 'sprzęt i prowadzący', 'czytelne ustalenia organizacyjne'],
      actionLabel: 'Porozmawiajmy o współpracy',
      actionType: 'contact',
    },
    {
      id: 'chess-companies',
      navigationLabel: 'Firmy',
      eyebrow: 'Warsztat, turniej lub integracja',
      title: 'Zespół przy jednej planszy.',
      description:
        'Szachy stają się przestrzenią do współpracy, rozmowy i lekkiej rywalizacji.',
      bestFor: 'Firmy szukające angażującego wydarzenia o strategii i decyzjach.',
      format: 'Na miejscu lub online, scenariusz dopasowany do czasu i grupy.',
      imageSrc: '/redesign/story-chess-corporate.webp',
      imageAlt: 'Dorośli uczestniczą w kameralnym warsztacie szachowym',
      imagePosition: '72% center',
      Icon: BriefcaseBusiness,
      outcomes: ['jasny przebieg wydarzenia', 'miejsce dla osób początkujących', 'gra i rozmowa zamiast prezentacji'],
      actionLabel: 'Poproś o propozycję',
      actionType: 'contact',
    },
  ],
  en: [
    {
      id: 'chess-preschool',
      navigationLabel: 'Preschools',
      eyebrow: 'A first meeting with the board',
      title: 'Pieces, rules and short tasks introduced through play.',
      description:
        'Children learn the board step by step. Explanations alternate with movement, puzzles and mini-games so attention has a natural rhythm.',
      bestFor: 'Younger children who are just learning the pieces and basic rules.',
      format: 'Short activities, group work and plenty of board practice.',
      imageSrc: '/redesign/story-chess-young.webp',
      imageAlt: 'Children play chess together around a table',
      imagePosition: '48% center',
      Icon: Clock3,
      outcomes: ['recognising pieces and squares', 'first deliberate moves', 'practising patience and attention'],
      actionLabel: 'Ask about classes',
      actionType: 'contact',
    },
    {
      id: 'chess-schools',
      navigationLabel: 'Schools',
      eyebrow: 'A steady rhythm at school',
      title: 'Tactics, strategy and plenty of play at the board.',
      description:
        'The programme grows with the group: from secure rules to planning, simple combinations and analysis of played games.',
      bestFor: 'Classes, after-school groups and clubs looking for regular sessions.',
      format: 'A recurring lesson with the level matched to the group.',
      imageSrc: '/redesign/chess-primary.webp',
      imageAlt: 'An instructor discusses a chess position with primary-school children',
      imagePosition: '50% center',
      Icon: School,
      outcomes: ['tactical exercises', 'games with peers', 'talking through decisions at the board'],
      actionLabel: 'Enrol a child',
      actionType: 'registration',
    },
    {
      id: 'chess-individual',
      navigationLabel: 'Individual',
      eyebrow: 'One-to-one training',
      title: 'A plan matched to the level, games and a concrete goal.',
      description:
        'We calmly analyse how the student thinks. Tasks develop the current level instead of restarting the entire programme.',
      bestFor: 'A student wants to progress, organise the foundations or prepare for a tournament.',
      format: 'Online or in person, with regular feedback.',
      imageSrc: '/redesign/chess-individual.webp',
      imageAlt: 'A teenage student analyses a position with her coach during individual training',
      imagePosition: '50% center',
      Icon: UserRound,
      outcomes: ['analysis of the student’s games', 'tasks matched to level', 'a concrete plan for further work'],
      actionLabel: 'Book training',
      actionType: 'registration',
    },
    {
      id: 'chess-groups',
      navigationLabel: 'Small groups',
      eyebrow: 'Partners at a similar level',
      title: 'A small group leaves time for games, exercises and shared analysis.',
      description:
        'A small group brings different playing styles and room to discuss moves. Students see that one problem can have several approaches.',
      bestFor: 'Children and teenagers who benefit from regular games with peers.',
      format: 'Small groups matched by level and a fixed meeting time.',
      imageSrc: '/redesign/chess-group.webp',
      imageAlt: 'Teenagers analyse two games during a small-group chess session',
      imagePosition: '50% center',
      Icon: UsersRound,
      outcomes: ['practice in varied positions', 'learning from other ideas', 'calm and healthy competition'],
      actionLabel: 'Join a group',
      actionType: 'registration',
    },
    {
      id: 'chess-institutions',
      navigationLabel: 'Institutions',
      eyebrow: 'Programme and organisation handled by us',
      title: 'Classes, a workshop or a tournament ready to launch.',
      description:
        'We agree on the group’s age, goal and the institution’s practical needs. We prepare the instructor, programme and equipment.',
      bestFor: 'Schools, preschools, libraries, culture centres and local organisations.',
      format: 'A regular cycle, one workshop or a chess event.',
      imageSrc: '/redesign/story-chess-workshop.webp',
      imageAlt: 'Children and adults play chess during a group session',
      imagePosition: '58% center',
      Icon: GraduationCap,
      outcomes: ['programme matched to age', 'equipment and instructor', 'clear organisational arrangements'],
      actionLabel: 'Discuss cooperation',
      actionType: 'contact',
    },
    {
      id: 'chess-companies',
      navigationLabel: 'Companies',
      eyebrow: 'Workshop, tournament or team event',
      title: 'A well-structured chess event.',
      description:
        'We combine a short introduction with board practice. The format can be a relaxed workshop or an informal team tournament.',
      bestFor: 'Companies looking for an engaging event about strategy and decisions.',
      format: 'On site or online, matched to the available time and group.',
      imageSrc: '/redesign/story-chess-corporate.webp',
      imageAlt: 'Adults take part in a small chess workshop',
      imagePosition: '72% center',
      Icon: BriefcaseBusiness,
      outcomes: ['a clear event structure', 'room for complete beginners', 'playing and discussion instead of slides'],
      actionLabel: 'Request a proposal',
      actionType: 'contact',
    },
  ],
};

const chessCopy = {
  pl: {
    progressLabel: 'Sekcje strony o szachach',
    startLabel: 'Szachy',
    lessonLabel: 'Przebieg lekcji',
    nextLabel: 'Kontakt',
    heroKicker: 'Zajęcia szachowe',
    heroTitle: 'Szachy zaczynają się od myślenia.',
    heroLead:
      'Pomagamy zrozumieć pozycję, znaleźć plan i samodzielnie wybrać ruch.',
    heroPrimary: 'Znajdź swój format',
    heroSecondary: 'Zapisz ucznia',
    scroll: 'Poznaj programy',
    heroFacts: ['dzieci i młodzież', 'grupy i 1:1', 'placówki i firmy'],
    sectionPrefix: 'Program',
    bestFor: 'Dla kogo',
    format: 'Jak pracujemy',
    outcomes: 'Na czym skupiamy uwagę',
    lessonKicker: 'Przykładowa lekcja',
    lessonTitle: 'Najpierw pozycja. Potem własny pomysł.',
    lessonLead:
      'Instruktor nie podaje ruchu od razu. Pomaga uczniowi zobaczyć możliwości, nazwać plan i sprawdzić go w praktyce.',
    lessonSteps: [
      { title: 'Zobacz', text: 'Co zmieniło się w pozycji i które figury są ważne?' },
      { title: 'Zaproponuj', text: 'Uczeń wybiera ruch i mówi, co chce nim osiągnąć.' },
      { title: 'Sprawdź', text: 'Razem analizujemy odpowiedź przeciwnika i konsekwencje.' },
      { title: 'Zagraj', text: 'Pomysł wraca w zadaniu albo krótkiej partii.' },
    ],
    nextKicker: 'Pierwszy ruch',
    nextTitle: 'Powiedz nam, ile uczeń już potrafi.',
    nextLead: 'Dobierzemy odpowiednią grupę, tempo albo trening indywidualny. Jeśli nie masz pewności, krótka wiadomość wystarczy.',
    nextPrimary: 'Zapisz ucznia',
    nextSecondary: 'Zapytaj o zajęcia',
  },
  en: {
    progressLabel: 'Chess page sections',
    startLabel: 'Chess',
    lessonLabel: 'A lesson',
    nextLabel: 'Contact',
    heroKicker: 'Chess classes',
    heroTitle: 'Chess teaches students to think several moves ahead.',
    heroLead:
      'From a first meeting with the pieces to deliberate training and tournaments. We match the language, pace and tasks to age and level.',
    heroPrimary: 'Find the right format',
    heroSecondary: 'Enrol a student',
    scroll: 'Explore the programmes',
    heroFacts: ['children and teenagers', 'groups and 1:1', 'institutions and companies'],
    sectionPrefix: 'Programme',
    bestFor: 'Best for',
    format: 'How we work',
    outcomes: 'What we focus on',
    lessonKicker: 'A sample lesson',
    lessonTitle: 'First the position. Then the student’s own idea.',
    lessonLead:
      'The instructor does not give away the move. They help the student see options, name a plan and test it in practice.',
    lessonSteps: [
      { title: 'Notice', text: 'What changed in the position and which pieces matter?' },
      { title: 'Propose', text: 'The student chooses a move and explains its purpose.' },
      { title: 'Check', text: 'Together we analyse the reply and its consequences.' },
      { title: 'Play', text: 'The idea returns in a task or a short game.' },
    ],
    nextKicker: 'First move',
    nextTitle: 'Tell us what the student can already do.',
    nextLead: 'We will match a group, pace or individual training. If you are unsure, a short message is enough.',
    nextPrimary: 'Enrol a student',
    nextSecondary: 'Ask about classes',
  },
};

const sceneTones = [
  'bg-[#f7f1e6] text-[#0a1713]',
  'bg-[#dff5eb] text-[#0a1713]',
  'bg-[#efe8db] text-[#0a1713]',
];

const chessOfferIds: Record<string, string> = {
  'chess-preschool': 'preschool',
  'chess-schools': 'primary-school',
  'chess-individual': 'individual-chess',
  'chess-groups': 'group-chess',
};

function ChessProgramScene({
  copy,
  index,
  program,
}: {
  copy: (typeof chessCopy)[Language],
  index: number,
  program: ChessProgram,
}) {
  const Icon = program.Icon;
  const imageFirst = index % 2 === 0;

  return (
    <StorySection deferRendering deferIntrinsicSize='900px' id={program.id} className={sceneTones[index % sceneTones.length]}>
      <div className='story-orb -right-48 -top-48 bg-[#b9f3dc]/[0.45]'>
      </div>
      <div className='container relative z-10 grid gap-12 px-4 lg:grid-cols-2 lg:items-center'>
        <Reveal className={`story-photo-frame min-h-[30rem] lg:min-h-[43rem] ${imageFirst ? '' : 'lg:order-2'}`}>
          <img
            src={program.imageSrc}
            srcSet={getResponsiveImageSrcSet(program.imageSrc)}
            sizes='(min-width: 1536px) 660px, (min-width: 1280px) 600px, (min-width: 1024px) 472px, (min-width: 768px) 736px, (min-width: 640px) 608px, calc(100vw - 2rem)'
            alt={program.imageAlt}
            width='1536'
            height='1024'
            loading='lazy'
            decoding='async'
            className='story-photo absolute inset-0'
            style={{ objectPosition: program.imagePosition }} />
          <div className='absolute inset-x-5 bottom-5 z-10 flex items-center justify-between gap-4 rounded-2xl border border-white/20 bg-[#071712]/95 p-5 text-white sm:inset-x-7 sm:bottom-7'>
            <div>
              <p className='text-xs font-black uppercase tracking-[0.16em] text-[#b9f3dc]'>
                {program.eyebrow}
              </p>
              <p className='mt-2 text-sm font-bold text-white/[0.72]'>
                {program.navigationLabel}
              </p>
            </div>
            <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f5b942] text-[#0a1713]'>
              <Icon className='h-6 w-6' />
            </span>
          </div>
        </Reveal>

        <div className={imageFirst ? '' : 'lg:order-1'}>
          <Reveal>
            <p className='story-index'>
              {copy.sectionPrefix} {String(index + 1).padStart(2, '0')}
            </p>
            <h2 className='story-title mt-6'>
              {program.title}
            </h2>
            <p className='story-lead mt-6 text-[#365a50]'>
              {program.description}
            </p>
          </Reveal>

          <Reveal delay={120} className='mt-8 grid gap-3 sm:grid-cols-2'>
            <article className='story-paper p-5'>
              <p className='text-xs font-black uppercase tracking-[0.13em] text-[#126044]'>
                {copy.bestFor}
              </p>
              <p className='mt-3 text-sm font-semibold leading-7 text-[#29483f]'>
                {program.bestFor}
              </p>
            </article>
            <article className='story-paper p-5'>
              <p className='text-xs font-black uppercase tracking-[0.13em] text-[#126044]'>
                {copy.format}
              </p>
              <p className='mt-3 text-sm font-semibold leading-7 text-[#29483f]'>
                {program.format}
              </p>
            </article>
          </Reveal>

          <Reveal delay={220} className='mt-8'>
            <p className='text-xs font-black uppercase tracking-[0.13em] text-[#126044]'>
              {copy.outcomes}
            </p>
            <ul className='mt-4 grid gap-3'>
              {program.outcomes.map((outcome) => (
                <li key={outcome} className='flex items-center gap-3 font-bold text-[#29483f]'>
                  <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#123d32] text-[#b9f3dc]'>
                    <Check className='h-4 w-4' />
                  </span>
                  {outcome}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={320} className='mt-9'>
            <Button asChild size='lg' className='h-14 rounded-full bg-[#123d32] px-7 font-black text-white hover:bg-[#187b5d]'>
              <Link to={program.actionType === 'contact'
                ? `/kontakt?source=${encodeURIComponent(program.id)}`
                : `/zapisz?offer=${encodeURIComponent(chessOfferIds[program.id] ?? program.id)}`}>
                {program.actionLabel}
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </StorySection>
  );
}

export default function ChessProgramsPage({ language }: { language: Language }) {
  const copy = chessCopy[language];
  const programs = chessProgramsByLanguage[language];
  const navigationItems: StoryNavigationItem[] = [
    { id: 'chess-start', label: copy.startLabel },
    ...programs.map(({ id, navigationLabel }) => ({ id, label: navigationLabel })),
    { id: 'chess-lesson', label: copy.lessonLabel },
    { id: 'chess-next', label: copy.nextLabel },
  ];

  return (
    <ScrollStory items={navigationItems} ariaLabel={copy.progressLabel}>
      <StorySection id='chess-start' className='min-h-[calc(100svh-4rem)] bg-[#071712] py-0 text-white'>
        <img
          src='/redesign/story-chess-hero.webp'
          srcSet='/redesign/story-chess-hero-640.webp 640w, /redesign/story-chess-hero-1024.webp 1024w, /redesign/story-chess-hero.webp 1536w'
          sizes='100vw'
          alt=''
          width='1536'
          height='1024'
          {...{ fetchpriority: 'high' }}
          decoding='async'
          className='absolute inset-0 h-full w-full object-cover object-[67%_center]' />
        <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,16,0.98)_0%,rgba(5,20,16,0.9)_43%,rgba(5,20,16,0.38)_78%,rgba(5,20,16,0.28)_100%)]'>
        </div>
        <div className='story-grid-art'>
        </div>
        <div className='story-ring-art -right-28 -top-28'>
        </div>

        <div className='container relative z-10 flex min-h-[calc(100svh-4rem)] items-center px-4 py-16 lg:py-20'>
          <div className='max-w-5xl'>
            <Reveal>
              <p className='story-kicker text-[#b9f3dc]'>
                {copy.heroKicker}
              </p>
              <h1 className='story-display mt-7 max-w-5xl'>
                {copy.heroTitle}
              </h1>
            </Reveal>
            <Reveal delay={120} className='mt-7'>
              <p className='story-lead text-white/[0.74]'>
                {copy.heroLead}
              </p>
            </Reveal>
            <Reveal delay={220} className='mt-9 flex flex-col gap-3 sm:flex-row'>
              <Button size='lg' className='h-14 rounded-full bg-[#f5b942] px-7 font-black text-[#0a1713] hover:bg-[#ffd071]' onClick={() => navigateToStorySection(programs[0].id)}>
                {copy.heroPrimary}
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
              <Button asChild size='lg' variant='outline' className='h-14 rounded-full border-white/25 bg-white/[0.08] px-7 font-black text-white hover:bg-white hover:text-[#0a1713]'>
                <Link to='/zapisz?source=chess-hero'>{copy.heroSecondary}</Link>
              </Button>
            </Reveal>
            <Reveal delay={320} className='mt-10 flex flex-wrap gap-2'>
              {copy.heroFacts.map((fact) => (
                <span key={fact} className='rounded-full border border-white/[0.15] bg-white/[0.12] px-4 py-2 text-xs font-black text-white/[0.72]'>
                  {fact}
                </span>
              ))}
            </Reveal>
            <Reveal delay={420} className='mt-10 text-white/[0.62]'>
              <ScrollCue label={copy.scroll} />
            </Reveal>
          </div>
        </div>
      </StorySection>

      {programs.map((program, index) => (
        <ChessProgramScene key={program.id} copy={copy} index={index} program={program} />
      ))}

      <StorySection deferRendering deferIntrinsicSize='900px' id='chess-lesson' className='bg-[#103a30] text-white'>
        <div className='story-grid-art opacity-25'>
        </div>
        <div className='story-orb -left-36 -top-36 bg-[#187b5d]/80'>
        </div>
        <div className='container relative z-10 grid gap-12 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-center'>
          <Reveal>
            <p className='story-kicker text-[#b9f3dc]'>
              {copy.lessonKicker}
            </p>
            <h2 className='story-title mt-6 text-white'>
              {copy.lessonTitle}
            </h2>
            <p className='story-lead mt-7 text-white/[0.68]'>
              {copy.lessonLead}
            </p>
          </Reveal>
          <div className='grid gap-4 sm:grid-cols-2'>
            {copy.lessonSteps.map((step, index) => {
              const icons = [Eye, Lightbulb, Target, RotateCcw];
              const Icon = icons[index];

              return (
                <Reveal key={step.title} delay={100 + index * 90}>
                  <article className='story-glass h-full min-h-[14rem] p-6 text-white'>
                    <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5b942] text-[#0a1713]'>
                      <Icon className='h-5 w-5' />
                    </span>
                    <h3 className='mt-7 text-2xl font-black'>
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

      <StorySection deferRendering deferIntrinsicSize='800px' id='chess-next' className='bg-[#f5b942] text-[#0a1713]'>
        <div className='story-grid-art !opacity-20 [background-image:linear-gradient(rgba(10,23,19,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(10,23,19,0.1)_1px,transparent_1px)]'>
        </div>
        <div className='story-ring-art -right-20 top-1/3 !border-[#0a1713]/[0.15]'>
        </div>
        <div className='container relative z-10 px-4'>
          <Reveal className='max-w-6xl'>
            <p className='story-kicker text-[#123d32]'>
              {copy.nextKicker}
            </p>
            <h2 className='story-title mt-7'>
              {copy.nextTitle}
            </h2>
            <p className='story-lead mt-7 text-[#29483f]'>
              {copy.nextLead}
            </p>
          </Reveal>
          <Reveal delay={160} className='mt-10 flex flex-col gap-3 sm:flex-row'>
            <Button asChild size='lg' className='h-14 rounded-full bg-[#0a1713] px-7 font-black text-white hover:bg-[#123d32]'>
              <Link to='/zapisz?source=chess-next'>
                {copy.nextPrimary}
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
            <Button asChild size='lg' variant='outline' className='h-14 rounded-full border-[#0a1713]/25 bg-white/30 px-7 font-black text-[#0a1713] hover:bg-white/70'>
              <Link to='/kontakt?source=chess-next'>
                {copy.nextSecondary}
                <MessageCircle className='ml-2 h-5 w-5' />
              </Link>
            </Button>
          </Reveal>
        </div>
      </StorySection>
    </ScrollStory>
  );
}
