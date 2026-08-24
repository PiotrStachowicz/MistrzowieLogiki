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
  BookOpenCheck,
  Check,
  ClipboardCheck,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  RotateCcw,
  Target,
  type LucideIcon,
  UsersRound,
} from 'lucide-react';
import { Link } from '@/components/navigation/LocalizedLink';

type MathOffer = {
  actionLabel: string,
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

const mathOffersByLanguage: Record<Language, MathOffer[]> = {
  pl: [
    {
      id: 'math-individual',
      navigationLabel: 'Indywidualnie',
      eyebrow: 'Praca jeden na jeden',
      title: 'Tempo dopasowane do ucznia.',
      description:
        'Zatrzymujemy się przy tym, co trudne, i przechodzimy dalej dopiero po zrozumieniu.',
      bestFor: 'Gdy materiał wymaga spokojnego wyjaśnienia, uzupełnienia braków albo przygotowania do sprawdzianu.',
      format: 'Regularne spotkania online lub stacjonarnie; zadania dobierane na bieżąco do potrzeb ucznia.',
      imageSrc: '/redesign/math-individual.webp',
      imageAlt: 'Uczeń i korepetytorka wspólnie analizują zadanie geometryczne',
      imagePosition: '50% center',
      Icon: BookOpenCheck,
      outcomes: [
        'rozumienie kolejnych etapów rozwiązania',
        'samodzielne sprawdzanie toku obliczeń',
        'porządkowanie wcześniejszych braków',
      ],
      actionLabel: 'Zapytaj o lekcje 1:1',
    },
    {
      id: 'math-groups',
      navigationLabel: 'Małe grupy',
      eyebrow: 'Nauka razem',
      title: 'Grupa pomaga zobaczyć więcej.',
      description:
        'Uczniowie poznają inne sposoby myślenia i wspólnie omawiają trudniejsze kroki.',
      bestFor: 'Uczniowie, którym pomaga stały termin, kontakt z rówieśnikami i wspólne omawianie zadań.',
      format: 'Grupa dobrana poziomem, regularne spotkania i materiał dopasowywany do bieżących potrzeb uczestników.',
      imageSrc: '/redesign/math-small-group.webp',
      imageAlt: 'Kameralna grupa uczniów porównuje sposoby rozwiązania zadania',
      imagePosition: '50% center',
      Icon: UsersRound,
      outcomes: [
        'porównywanie różnych metod rozwiązania',
        'regularne ćwiczenie bez szkolnego pośpiechu',
        'formułowanie pytań i wyjaśnianie własnego toku',
      ],
      actionLabel: 'Zapytaj o małą grupę',
    },
    {
      id: 'math-eighth-grade',
      navigationLabel: 'Egzamin 8-kl.',
      eyebrow: 'Przygotowanie do egzaminu',
      title: 'Egzamin zaczyna się od planu.',
      description:
        'Porządkujemy materiał, ćwiczymy zadania i uczymy się świadomie pracować z arkuszem.',
      bestFor: 'Uczniowie klas 7–8, którzy chcą uporządkować materiał i wejść w arkusze z czytelnym planem.',
      format: 'Powtórki tematyczne, fragmenty arkuszy i pełne próby wtedy, gdy potrzebne podstawy są już przećwiczone.',
      imageSrc: '/redesign/math-exam.webp',
      imageAlt: 'Nastoletni uczeń pracuje nad arkuszem zadań przy biurku',
      imagePosition: '43% center',
      Icon: ClipboardCheck,
      outcomes: [
        'rozpoznawanie typów zadań i danych w poleceniu',
        'planowanie kolejności pracy z arkuszem',
        'analiza błędu zamiast samego sprawdzenia odpowiedzi',
      ],
      actionLabel: 'Zapytaj o kurs egzaminacyjny',
    },
    {
      id: 'math-matura',
      navigationLabel: 'Matura',
      eyebrow: 'Poziom podstawowy',
      title: 'Matura krok po kroku.',
      description:
        'Wracamy do potrzebnych podstaw i spokojnie przechodzimy przez kolejne działy.',
      bestFor: 'Maturzyści przygotowujący się do poziomu podstawowego, także wtedy, gdy część wcześniejszego materiału wymaga odbudowania.',
      format: 'Plan powtórek, zadania z poszczególnych działów, arkusze i rozmowa o strategii pracy.',
      imageSrc: '/redesign/math-matura.webp',
      imageAlt: 'Maturzystka omawia rozwiązanie zadania z korepetytorką',
      imagePosition: '50% center',
      Icon: GraduationCap,
      outcomes: [
        'łączenie wzorów z konkretnymi typami zadań',
        'czytelne zapisywanie rozwiązań otwartych',
        'regularne sprawdzanie, które działy wymagają powrotu',
      ],
      actionLabel: 'Zapytaj o przygotowanie do matury',
    },
  ],
  en: [
    {
      id: 'math-individual',
      navigationLabel: 'Individual',
      eyebrow: 'One-to-one work',
      title: 'A pace tailored to the student.',
      description:
        'We pause at what is difficult and move on only once it is understood.',
      bestFor: 'When schoolwork needs a calm explanation, earlier gaps need attention or a test is approaching.',
      format: 'Regular online or in-person meetings, with tasks adjusted to the student’s needs as the work progresses.',
      imageSrc: '/redesign/math-individual.webp',
      imageAlt: 'A student and tutor analyse a geometry problem together',
      imagePosition: '50% center',
      Icon: BookOpenCheck,
      outcomes: [
        'understanding each stage of a solution',
        'checking calculations independently',
        'organising gaps from earlier topics',
      ],
      actionLabel: 'Ask about one-to-one lessons',
    },
    {
      id: 'math-groups',
      navigationLabel: 'Small groups',
      eyebrow: 'Learning together',
      title: 'A group helps students see more.',
      description:
        'Students discover different ways of thinking and discuss the more difficult steps together.',
      bestFor: 'Students who benefit from a fixed time, contact with peers and discussing tasks together.',
      format: 'A group matched by level, regular meetings and material adjusted to the participants’ current needs.',
      imageSrc: '/redesign/math-small-group.webp',
      imageAlt: 'A small group of students compares different ways to solve a problem',
      imagePosition: '50% center',
      Icon: UsersRound,
      outcomes: [
        'comparing different solution methods',
        'regular practice without school-style rush',
        'asking precise questions and explaining one’s reasoning',
      ],
      actionLabel: 'Ask about a small group',
    },
    {
      id: 'math-eighth-grade',
      navigationLabel: 'Grade 8 exam',
      eyebrow: 'Exam preparation',
      title: 'An exam begins with a plan.',
      description:
        'We organise the material, practise tasks and learn to work through an exam paper deliberately.',
      bestFor: 'Students in grades 7–8 who want to organise the material and approach exam papers with a clear plan.',
      format: 'Topic reviews, parts of exam papers and full practice papers once the necessary foundations are in place.',
      imageSrc: '/redesign/math-exam.webp',
      imageAlt: 'A teenage student works on a worksheet at a desk',
      imagePosition: '43% center',
      Icon: ClipboardCheck,
      outcomes: [
        'recognising task types and relevant information',
        'planning the order of work through a paper',
        'analysing an error rather than only checking the answer',
      ],
      actionLabel: 'Ask about exam preparation',
    },
    {
      id: 'math-matura',
      navigationLabel: 'Matura',
      eyebrow: 'Standard level',
      title: 'Matura, step by step.',
      description:
        'We return to the necessary foundations and work calmly through each topic.',
      bestFor: 'Students preparing for the standard-level Matura, including those who need to rebuild parts of earlier material.',
      format: 'A revision plan, topic-based tasks, exam papers and discussion of how to approach the work.',
      imageSrc: '/redesign/math-matura.webp',
      imageAlt: 'A Matura student discusses an open-response solution with her tutor',
      imagePosition: '50% center',
      Icon: GraduationCap,
      outcomes: [
        'connecting formulas with specific task types',
        'writing clear solutions to open questions',
        'regularly checking which topics need another pass',
      ],
      actionLabel: 'Ask about Matura preparation',
    },
  ],
};

const mathCopy = {
  pl: {
    progressLabel: 'Sekcje strony o matematyce',
    startLabel: 'Matematyka',
    approachLabel: 'Podejście',
    rhythmLabel: 'Przebieg lekcji',
    nextLabel: 'Kontakt',
    heroKicker: 'Korepetycje i kursy matematyczne',
    heroTitle: 'Matematyka bez nauki na ślepo.',
    heroLead:
      'Pomagamy uporządkować materiał, uzupełnić braki i przygotować się do egzaminu.',
    heroPrimary: 'Zobacz, jak pracujemy',
    heroSecondary: 'Zapisz ucznia',
    scroll: 'Poznaj dostępne formaty',
    heroFacts: ['lekcje 1:1 i małe grupy', 'szkoła podstawowa i średnia', 'egzaminy bez nauki na oślep'],
    approachKicker: 'Punkt wyjścia',
    approachTitle: 'Nie zaczynamy od przypadkowego zestawu zadań.',
    approachLead:
      'Najpierw ustalamy, czy trudność leży w aktualnym dziale, wcześniejszej podstawie czy samym sposobie czytania zadania. Dopiero potem wybieramy ćwiczenia.',
    approachSteps: [
      {
        title: 'Znajdź miejsce trudności',
        text: 'Krótka rozmowa i kilka przykładów pokazują, w którym momencie tok rozwiązania przestaje być jasny.',
      },
      {
        title: 'Wyjaśnij zasadę',
        text: 'Łączymy wzór lub regułę z konkretnym przykładem, zamiast zostawiać ją jako zdanie do zapamiętania.',
      },
      {
        title: 'Sprawdź w praktyce',
        text: 'Uczeń rozwiązuje kolejne zadanie samodzielnie, a prowadzący pomaga skorygować sposób myślenia.',
      },
    ],
    sectionPrefix: 'Program',
    bestFor: 'Kiedy ten format ma sens',
    format: 'Jak wygląda praca',
    outcomes: 'Na czym pracujemy',
    rhythmKicker: 'Rytm spotkania',
    rhythmTitle: 'Najpierw wyjaśnienie, potem samodzielna próba.',
    rhythmLead:
      'Lekcja ma prostą strukturę, ale nie jest sztywnym scenariuszem. Jeśli trzeba wrócić do wcześniejszego kroku, robimy to przed przejściem dalej.',
    rhythmSteps: [
      { title: 'Krótka powtórka', text: 'Sprawdzamy, co zostało z poprzedniego spotkania i co wydarzyło się na lekcjach w szkole.' },
      { title: 'Jasne wyjaśnienie', text: 'Prowadzący pokazuje zależność na przykładzie i nazywa kolejne decyzje w rozwiązaniu.' },
      { title: 'Samodzielna próba', text: 'Uczeń pracuje nad podobnym zadaniem bez kopiowania gotowego schematu.' },
      { title: 'Podsumowanie', text: 'Ustalamy, co jest już pewne, do czego trzeba wrócić i co warto przećwiczyć przed kolejnym spotkaniem.' },
    ],
    nextKicker: 'Pierwszy krok',
    nextTitle: 'Opisz aktualny temat, poziom i cel ucznia.',
    nextLead:
      'Nie musisz samodzielnie wybierać między lekcjami indywidualnymi, grupą i kursem. Na podstawie krótkiej wiadomości zaproponujemy sensowny punkt wyjścia.',
    nextPrimary: 'Zapisz ucznia',
    nextSecondary: 'Zapytaj o matematykę',
  },
  en: {
    progressLabel: 'Mathematics page sections',
    startLabel: 'Mathematics',
    approachLabel: 'Approach',
    rhythmLabel: 'A lesson',
    nextLabel: 'Contact',
    heroKicker: 'Mathematics tutoring and courses',
    heroTitle: 'Mathematics without learning by rote.',
    heroLead:
      'We help organise the material, fill knowledge gaps and prepare for exams.',
    heroPrimary: 'See how we work',
    heroSecondary: 'Enrol a student',
    scroll: 'Explore the available formats',
    heroFacts: ['one-to-one lessons and small groups', 'primary and secondary school', 'exam preparation with a clear plan'],
    approachKicker: 'Starting point',
    approachTitle: 'We do not begin with a random set of exercises.',
    approachLead:
      'First we establish whether the difficulty is in the current topic, an earlier foundation or the way the task is being read. Only then do we choose the practice.',
    approachSteps: [
      {
        title: 'Locate the difficulty',
        text: 'A short conversation and a few examples show where the reasoning stops being clear.',
      },
      {
        title: 'Explain the principle',
        text: 'We connect a formula or rule to a concrete example instead of leaving it as a sentence to memorise.',
      },
      {
        title: 'Test it in practice',
        text: 'The student solves the next problem independently while the tutor helps correct the reasoning.',
      },
    ],
    sectionPrefix: 'Programme',
    bestFor: 'When this format fits',
    format: 'How the work is organised',
    outcomes: 'What we work on',
    rhythmKicker: 'Lesson rhythm',
    rhythmTitle: 'First the explanation, then an independent attempt.',
    rhythmLead:
      'The lesson has a simple structure, but it is not a rigid script. If an earlier step needs attention, we return to it before moving on.',
    rhythmSteps: [
      { title: 'Quick review', text: 'We check what remains from the previous meeting and what has happened in school lessons.' },
      { title: 'A clear explanation', text: 'The tutor shows the relationship through an example and names the decisions in the solution.' },
      { title: 'An independent attempt', text: 'The student works on a similar problem without copying a ready-made procedure.' },
      { title: 'A summary', text: 'We establish what is secure, what needs another pass and what is worth practising before the next meeting.' },
    ],
    nextKicker: 'First step',
    nextTitle: 'Describe the student’s current topic, level and goal.',
    nextLead:
      'You do not need to choose between individual lessons, a group and a course on your own. A short message is enough for us to suggest a sensible starting point.',
    nextPrimary: 'Enrol a student',
    nextSecondary: 'Ask about mathematics',
  },
};

const sceneTones = [
  'bg-[#f7f1e6] text-[#0a1713]',
  'bg-[#dff5eb] text-[#0a1713]',
  'bg-[#e8e0ff] text-[#18122b]',
  'bg-[#efe8db] text-[#0a1713]',
];

function MathOfferScene({
  copy,
  index,
  offer,
}: {
  copy: (typeof mathCopy)[Language],
  index: number,
  offer: MathOffer,
}) {
  const Icon = offer.Icon;
  const imageFirst = index % 2 === 0;

  return (
    <StorySection
      deferRendering
      deferIntrinsicSize='885px'
      id={offer.id}
      className={sceneTones[index % sceneTones.length]}>
      <div className='story-orb -right-48 -top-48 bg-[#b9f3dc]/[0.45]'>
      </div>
      <div className='container relative z-10 grid min-w-0 gap-12 px-4 lg:grid-cols-2 lg:items-center'>
        <Reveal className={['story-photo-frame min-h-[30rem] min-w-0 lg:min-h-[43rem]', imageFirst ? '' : 'lg:order-2'].join(' ')}>
          <img
            src={offer.imageSrc}
            srcSet={getResponsiveImageSrcSet(offer.imageSrc)}
            sizes='(min-width: 1536px) 660px, (min-width: 1280px) 600px, (min-width: 1024px) 472px, (min-width: 768px) 736px, (min-width: 640px) 608px, calc(100vw - 2rem)'
            alt={offer.imageAlt}
            width='1536'
            height='1024'
            loading='lazy'
            decoding='async'
            className='story-photo absolute inset-0'
            style={{ objectPosition: offer.imagePosition }} />
          <div className='absolute inset-x-5 bottom-5 z-10 flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/20 bg-[#071712]/[0.95] p-4 text-white sm:inset-x-7 sm:bottom-7 sm:gap-4 sm:p-5'>
            <div className='min-w-0'>
              <p className='text-xs font-black uppercase tracking-[0.16em] text-[#d9cffb]'>
                {offer.eyebrow}
              </p>
              <p className='mt-2 break-words text-sm font-bold text-white/[0.72]'>
                {offer.navigationLabel}
              </p>
            </div>
            <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f5b942] text-[#0a1713]'>
              <Icon className='h-6 w-6' />
            </span>
          </div>
        </Reveal>

        <div className={imageFirst ? 'min-w-0' : 'min-w-0 lg:order-1'}>
          <Reveal>
            <p className='story-index'>
              {copy.sectionPrefix} {String(index + 1).padStart(2, '0')}
            </p>
            <h2 className='story-title mt-6'>
              {offer.title}
            </h2>
            <p className='story-lead mt-6 text-[#365a50]'>
              {offer.description}
            </p>
          </Reveal>

          <Reveal delay={120} className='mt-8 grid gap-3 sm:grid-cols-2'>
            <article className='story-paper p-5'>
              <p className='text-xs font-black uppercase tracking-[0.13em] text-[#126044]'>
                {copy.bestFor}
              </p>
              <p className='mt-3 text-sm font-semibold leading-7 text-[#29483f]'>
                {offer.bestFor}
              </p>
            </article>
            <article className='story-paper p-5'>
              <p className='text-xs font-black uppercase tracking-[0.13em] text-[#126044]'>
                {copy.format}
              </p>
              <p className='mt-3 text-sm font-semibold leading-7 text-[#29483f]'>
                {offer.format}
              </p>
            </article>
          </Reveal>

          <Reveal delay={220} className='mt-8'>
            <p className='text-xs font-black uppercase tracking-[0.13em] text-[#126044]'>
              {copy.outcomes}
            </p>
            <ul className='mt-4 grid gap-3'>
              {offer.outcomes.map((outcome) => (
                <li key={outcome} className='flex items-center gap-3 font-bold text-[#29483f]'>
                  <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#123d32] text-[#b9f3dc]'>
                    <Check className='h-4 w-4' />
                  </span>
                  {outcome}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={320} className='mt-9 min-w-0'>
            <Button
              asChild
              size='lg'
              className='h-auto min-h-14 w-full whitespace-normal rounded-full bg-[#123d32] px-5 py-3 text-center font-black text-white hover:bg-[#187b5d] sm:w-auto sm:px-7'>
              <Link to={`/kontakt?source=${encodeURIComponent(offer.id)}`}>
                {offer.actionLabel}
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </StorySection>
  );
}

export default function MathTutoringPage({ language }: { language: Language }) {
  const copy = mathCopy[language];
  const offers = mathOffersByLanguage[language];
  const navigationItems: StoryNavigationItem[] = [
    { id: 'math-start', label: copy.startLabel },
    { id: 'math-approach', label: copy.approachLabel },
    ...offers.map(({ id, navigationLabel }) => ({ id, label: navigationLabel })),
    { id: 'math-rhythm', label: copy.rhythmLabel },
    { id: 'math-next', label: copy.nextLabel },
  ];

  const scrollToSection = (id: string) => {
    navigateToStorySection(id);
  };

  return (
    <ScrollStory items={navigationItems} ariaLabel={copy.progressLabel}>
      <StorySection id='math-start' className='min-h-[calc(100svh-4rem)] bg-[#11152a] py-0 text-white'>
        <img
          src='/redesign/math-hero.webp'
          srcSet='/redesign/math-hero-640.webp 640w, /redesign/math-hero-1024.webp 1024w, /redesign/math-hero.webp 1536w'
          sizes='100vw'
          alt=''
          width='1536'
          height='1024'
          {...{ fetchpriority: 'high' }}
          decoding='async'
          className='absolute inset-0 h-full w-full object-cover object-[68%_center]' />
        <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(11,14,31,0.98)_0%,rgba(11,14,31,0.9)_43%,rgba(11,14,31,0.38)_78%,rgba(11,14,31,0.27)_100%)]'>
        </div>
        <div className='story-grid-art'>
        </div>
        <div className='story-ring-art -right-28 -top-28'>
        </div>

        <div className='container relative z-10 flex min-h-[calc(100svh-4rem)] items-center px-4 py-16 lg:py-20'>
          <div className='max-w-5xl'>
            <Reveal>
              <p className='story-kicker text-[#d9cffb]'>
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
              <Button size='lg' className='h-14 rounded-full bg-[#f5b942] px-7 font-black text-[#0a1713] hover:bg-[#ffd071]' onClick={() => scrollToSection('math-approach')}>
                {copy.heroPrimary}
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
              <Button asChild size='lg' variant='outline' className='h-14 rounded-full border-white/25 bg-white/[0.08] px-7 font-black text-white hover:bg-white hover:text-[#0a1713]'>
                <Link to='/zapisz?offer=math-tutoring-regular&source=math-hero'>{copy.heroSecondary}</Link>
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

      <StorySection id='math-approach' className='bg-[#e8e0ff] text-[#18122b]'>
        <div className='story-orb -left-36 -top-36 bg-white/[0.45]'>
        </div>
        <div className='story-orb -bottom-44 right-0 bg-[#f5b942]/[0.28] [animation-delay:-6s]'>
        </div>
        <div className='container relative z-10 grid gap-12 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
          <Reveal className='max-w-4xl'>
            <p className='story-kicker text-[#513b9a]'>
              {copy.approachKicker}
            </p>
            <h2 className='story-title mt-6'>
              {copy.approachTitle}
            </h2>
            <p className='story-lead mt-7 text-[#4b4268]'>
              {copy.approachLead}
            </p>
            <div className='mt-9 inline-flex items-center gap-3 rounded-full border border-[#5b45a8]/20 bg-white/55 px-5 py-3 text-sm font-black text-[#513b9a] shadow-[0_10px_28px_rgba(91,69,168,0.1)]'>
              <Target className='h-5 w-5' />
              <span>
                {language === 'pl' ? 'Najpierw diagnoza, potem ćwiczenia.' : 'First diagnose, then practise.'}
              </span>
            </div>
          </Reveal>

          <div className='grid gap-4'>
            {copy.approachSteps.map((step, index) => {
              const icons = [Target, Lightbulb, BookOpenCheck];
              const Icon = icons[index];

              return (
                <Reveal key={step.title} delay={120 + index * 100}>
                  <article className='story-paper grid min-h-[10rem] grid-cols-[auto_1fr] items-start gap-5 p-6 sm:p-7'>
                    <span className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5b45a8] text-white shadow-[0_12px_28px_rgba(91,69,168,0.22)]'>
                      <Icon className='h-6 w-6' />
                    </span>
                    <div>
                      <div className='flex items-center gap-3'>
                        <span className='text-xs font-black tracking-[0.14em] text-[#6d58ad]'>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className='h-px flex-1 bg-[#6d58ad]/20'>
                        </span>
                      </div>
                      <h3 className='mt-4 text-2xl font-black tracking-[-0.03em] text-[#18122b]'>
                        {step.title}
                      </h3>
                      <p className='mt-2 text-sm leading-7 text-[#4b4268]'>
                        {step.text}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </StorySection>

      {offers.map((offer, index) => (
        <MathOfferScene key={offer.id} copy={copy} index={index} offer={offer} />
      ))}

      <StorySection deferRendering deferIntrinsicSize='900px' id='math-rhythm' className='bg-[#17142b] text-white'>
        <div className='story-grid-art opacity-25'>
        </div>
        <div className='story-orb -left-36 -top-36 bg-[#5b45a8]/70'>
        </div>
        <div className='container relative z-10 grid gap-12 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-center'>
          <Reveal>
            <p className='story-kicker text-[#d9cffb]'>
              {copy.rhythmKicker}
            </p>
            <h2 className='story-title story-title-compact mt-6 text-white'>
              {copy.rhythmTitle}
            </h2>
            <p className='story-lead mt-7 text-white/[0.68]'>
              {copy.rhythmLead}
            </p>
          </Reveal>
          <div className='grid gap-4 sm:grid-cols-2'>
            {copy.rhythmSteps.map((step, index) => {
              const icons = [RotateCcw, Lightbulb, BookOpenCheck, Target];
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

      <StorySection deferRendering deferIntrinsicSize='800px' id='math-next' className='bg-[#f5b942] text-[#0a1713]'>
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
              <Link to='/zapisz?offer=math-tutoring-regular&source=math-next'>
                {copy.nextPrimary}
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
            <Button asChild size='lg' variant='outline' className='h-14 rounded-full border-[#0a1713]/25 bg-white/30 px-7 font-black text-[#0a1713] hover:bg-white/70'>
              <Link to='/kontakt?source=math-next'>
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
