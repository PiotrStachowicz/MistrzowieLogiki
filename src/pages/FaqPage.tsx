import { Reveal, ScrollCue, ScrollStory, StorySection, type StoryNavigationItem } from '@/components/immersive/ScrollStory';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import type { Language } from '@/lib/i18n';
import type { FaqQuestion, FaqSection } from '@/types/site-content';
import { faqSectionsByLanguage } from '@/pages/faq-data';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Brain,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Mail,
  MessageCircle,
  Search,
  type LucideIcon,
} from 'lucide-react';
import type { MouseEvent } from 'react';
import { useDeferredValue, useMemo, useState } from 'react';
import { Link } from '@/components/navigation/LocalizedLink';

type FaqPageProps = { language: Language };
type FaqTone = 'cream' | 'violet' | 'dark';
type FaqSectionViewModel = FaqSection & { id: string, Icon: LucideIcon, tone: FaqTone };
type FaqSearchResult = { id: string, question: string, questionIndex: number, sectionId: string, sectionTitle: string };

const sectionIcons = [BookOpenCheck, CalendarCheck, Brain];
const sectionTones: FaqTone[] = ['cream', 'violet', 'dark'];
const FAQ_PAGE_SIZE = 4;

const faqCopy = {
  pl: {
    progressLabel: 'Sekcje najczęstszych pytań',
    startLabel: 'Start',
    mapLabel: 'Tematy',
    contactLabel: 'Kontakt',
    heroEyebrow: 'Pytania i odpowiedzi',
    heroTitle: 'Pytania? Zacznij tutaj.',
    heroLead: 'Wybierz temat i szybko znajdź potrzebną odpowiedź.',
    heroPrimary: 'Wybierz temat',
    contact: 'Kontakt',
    scroll: 'Przejdź do tematów',
    mapEyebrow: 'Szybka mapa',
    mapTitle: 'Co chcesz wiedzieć?',
    mapLead: 'Wybierz kategorię albo skorzystaj z wyszukiwarki.',
    searchEyebrow: 'Szybkie wyszukiwanie',
    orChooseTopic: 'Albo wybierz kategorię',
    suggestedSearches: ['płatność', 'online', 'odwołanie'],
    suggestionsLabel: 'Popularne wyszukiwania',
    searchLabel: 'Szukaj w pytaniach i odpowiedziach',
    searchPlaceholder: 'Np. płatność, odwołanie zajęć, lekcje online…',
    searchHint: 'Wpisz co najmniej 2 znaki.',
    searchResults: (count: number) => `Znaleziono: ${count}`,
    previousResult: 'Poprzedni wynik',
    nextResult: 'Następny wynik',
    resultPosition: (current: number, total: number) => `${current} z ${total}`,
    noSearchResults: 'Nie znaleźliśmy takiej odpowiedzi. Napisz do nas — odpowiemy bezpośrednio.',
    sections: 'tematy',
    answers: 'odpowiedzi',
    answerLabel: 'Krótka odpowiedź',
    questionLabel: 'Pytanie',
    questions: (count: number) => `${count} pytań`,
    topicPosition: (current: number, total: number) => `Temat ${current} z ${total}`,
    questionRange: (start: number, end: number, total: number) => `Pytania ${start}–${end} z ${total}`,
    pagePosition: (current: number, total: number) => `Strona ${current} z ${total}`,
    previousQuestions: 'Poprzednie pytania',
    nextQuestions: 'Następne pytania',
    missingEyebrow: 'Nie ma tu Twojego pytania?',
    missingTitle: 'Napisz, co chcesz ustalić. Odpowiemy konkretnie.',
    missingLead: 'Krótka wiadomość wystarczy. Jeśli pytanie dotyczy doboru zajęć, dodaj wiek i obecny poziom ucznia.',
    message: 'Napisz wiadomość',
    enroll: 'Przejdź do zapisu',
    mapImageAlt: 'Prowadzący pomaga uczennicy i rodzicowi uporządkować pytania o zajęcia',
  },
  en: {
    progressLabel: 'Frequently asked question sections',
    startLabel: 'Start',
    mapLabel: 'Topics',
    contactLabel: 'Contact',
    heroEyebrow: 'Questions and answers',
    heroTitle: 'Have a question? Start with a clear answer.',
    heroLead: 'Enrolment, payments, class formats, exams and chess — the essential information is organised into three focused topics.',
    heroPrimary: 'Choose a topic',
    contact: 'Contact',
    scroll: 'Explore the topics',
    mapEyebrow: 'Quick map',
    mapTitle: 'Open only the topic you need right now.',
    mapLead: 'Questions are grouped by class type. You can expand every answer separately.',
    searchEyebrow: 'Quick search',
    orChooseTopic: 'Or choose a category',
    suggestedSearches: ['payment', 'online', 'cancellation'],
    suggestionsLabel: 'Popular searches',
    searchLabel: 'Search questions and answers',
    searchPlaceholder: 'E.g. payment, cancellation, online lessons…',
    searchHint: 'Enter at least 2 characters.',
    searchResults: (count: number) => `${count} result${count === 1 ? '' : 's'}`,
    previousResult: 'Previous result',
    nextResult: 'Next result',
    resultPosition: (current: number, total: number) => `${current} of ${total}`,
    noSearchResults: 'We could not find that answer. Send us a message and we will reply directly.',
    sections: 'topics',
    answers: 'answers',
    answerLabel: 'Short answer',
    questionLabel: 'Question',
    questions: (count: number) => `${count} questions`,
    topicPosition: (current: number, total: number) => `Topic ${current} of ${total}`,
    questionRange: (start: number, end: number, total: number) => `Questions ${start}–${end} of ${total}`,
    pagePosition: (current: number, total: number) => `Page ${current} of ${total}`,
    previousQuestions: 'Previous questions',
    nextQuestions: 'Next questions',
    missingEyebrow: 'Cannot find your question?',
    missingTitle: 'Tell us what you need to clarify. We will answer directly.',
    missingLead: 'A short message is enough. If you need help choosing a class, include the student’s age and current level.',
    message: 'Send a message',
    enroll: 'Go to enrolment',
    mapImageAlt: 'A tutor helps a student and parent organise their class questions',
  },
};

function slugify(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanQuestionTitle(title: string) {
  return title.replace(/^[^\p{L}\p{N}]+/u, '').trim();
}

function getFaqSections(sections: FaqSection[]): FaqSectionViewModel[] {
  return sections.map((section, index) => ({
    ...section,
    id: `faq-${slugify(section.title || 'section')}-${index+1}`,
    Icon: sectionIcons[index%sectionIcons.length],
    tone: sectionTones[index%sectionTones.length],
  }));
}

const toneStyles: Record<FaqTone, {
  section: string,
  kicker: string,
  title: string,
  lead: string,
  counter: string,
  item: string,
  number: string,
  trigger: string,
  label: string,
  content: string,
  answerBorder: string,
  answerLabel: string,
}> = {
  cream: {
    section: 'bg-[#f7f1e6] text-[#0a1713]',
    kicker: 'text-[#126044]',
    title: 'text-[#0a1713]',
    lead: 'text-[#56736b]',
    counter: 'border-[#123d32]/10 bg-white/60 text-[#365a50]',
    item: 'border-[#123d32]/[0.12] bg-white/[0.78] shadow-[0_18px_50px_rgba(18,61,50,0.08)]',
    number: 'bg-[#dff5eb] text-[#123d32] group-hover:bg-[#123d32] group-hover:text-white group-data-[state=open]:bg-[#123d32] group-data-[state=open]:text-white',
    trigger: 'text-[#0a1713] hover:bg-[#dff5eb]/50 hover:text-[#123d32] data-[state=open]:bg-[#dff5eb]/[0.65] data-[state=open]:text-[#123d32]',
    label: 'text-[#126044]',
    content: 'border-[#123d32]/10 bg-white/[0.55] text-[#365a50]',
    answerBorder: 'border-[#187b5d]',
    answerLabel: 'text-[#126044]',
  },
  violet: {
    section: 'bg-[#e8e0ff] text-[#18122b]',
    kicker: 'text-[#5e429f]',
    title: 'text-[#18122b]',
    lead: 'text-[#4b4168]',
    counter: 'border-[#6f55b8]/[0.15] bg-white/[0.45] text-[#4b4168]',
    item: 'border-[#6f55b8]/[0.15] bg-white/[0.68] shadow-[0_18px_50px_rgba(75,65,104,0.1)]',
    number: 'bg-[#ded2ff] text-[#5c419f] group-hover:bg-[#5c419f] group-hover:text-white group-data-[state=open]:bg-[#5c419f] group-data-[state=open]:text-white',
    trigger: 'text-[#18122b] hover:bg-[#ded2ff]/[0.65] hover:text-[#4d358a] data-[state=open]:bg-[#ded2ff]/80 data-[state=open]:text-[#4d358a]',
    label: 'text-[#5e429f]',
    content: 'border-[#6f55b8]/[0.12] bg-white/[0.42] text-[#4b4168]',
    answerBorder: 'border-[#6f55b8]',
    answerLabel: 'text-[#5e429f]',
  },
  dark: {
    section: 'bg-[#103a30] text-white',
    kicker: 'text-[#b9f3dc]',
    title: 'text-white',
    lead: 'text-white/[0.64]',
    counter: 'border-white/[0.15] bg-white/[0.07] text-white/[0.65]',
    item: 'border-white/[0.15] bg-white/[0.12] shadow-[0_18px_50px_rgba(4,30,23,0.16)]',
    number: 'bg-white/10 text-[#b9f3dc] group-hover:bg-[#f5b942] group-hover:text-[#0a1713] group-data-[state=open]:bg-[#f5b942] group-data-[state=open]:text-[#0a1713]',
    trigger: 'text-white hover:bg-white/[0.07] hover:text-[#b9f3dc] data-[state=open]:bg-white/[0.09] data-[state=open]:text-[#b9f3dc]',
    label: 'text-[#b9f3dc]',
    content: 'border-white/10 bg-[#071712]/[0.38] text-white/70',
    answerBorder: 'border-[#f5b942]',
    answerLabel: 'text-[#f5b942]',
  },
};

function FaqQuestionItem({ answerLabel, index, question, questionLabel, sectionId, tone }: {
  answerLabel: string,
  index: number,
  question: FaqQuestion,
  questionLabel: string,
  sectionId: string,
  tone: FaqTone,
}) {
  const styles = toneStyles[tone];

  return (
    <AccordionItem
      id={`${sectionId}-${question.id}`}
      value={`${sectionId}-${question.id}`}
      className={`scroll-mt-24 overflow-hidden rounded-[1.4rem] border ${styles.item}`}>
      <AccordionTrigger className={`group min-h-[7.25rem] gap-5 px-5 py-6 text-left text-lg font-black leading-7 transition-colors hover:no-underline sm:px-7 sm:py-7 sm:text-xl sm:leading-8 ${styles.trigger}`}>
        <span className='flex min-w-0 items-start gap-5 pr-3'>
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] text-sm font-black transition-colors ${styles.number}`}>
            {String(index+1).padStart(2, '0')}
          </span>
          <span>
            <span className={`mb-1.5 block text-[11px] font-black uppercase tracking-[0.15em] ${styles.label}`}>{questionLabel}</span>
            <span className='block'>{cleanQuestionTitle(question.title)}</span>
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className={`border-t px-5 pb-7 pt-6 text-lg leading-8 sm:px-7 sm:pb-8 sm:text-[1.15rem] sm:leading-9 ${styles.content}`}>
        <div className={`border-l-[3px] pl-5 sm:pl-6 ${styles.answerBorder}`}>
          <p className={`text-[11px] font-black uppercase tracking-[0.15em] ${styles.answerLabel}`}>{answerLabel}</p>
          <p className='mt-3 max-w-3xl whitespace-pre-line'>{question.answer}</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function FaqPage({ language }: FaqPageProps) {
  const copy = faqCopy[language];
  const faqSections = useMemo(() => getFaqSections(faqSectionsByLanguage[language]), [language]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultIndex, setSearchResultIndex] = useState(0);
  const [openQuestion, setOpenQuestion] = useState('');
  const [topicPages, setTopicPages] = useState<Record<string, number>>({});
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedSearchQuery = deferredSearchQuery.trim().toLocaleLowerCase(language);
  const searchResults = useMemo<FaqSearchResult[]>(() => {
    if (normalizedSearchQuery.length < 2) {
      return [];
    }

    return faqSections.flatMap((section) => section.questions.flatMap((question, questionIndex) => {
      const matches = `${question.title} ${question.answer}`.toLocaleLowerCase(language).includes(normalizedSearchQuery);
      return matches ? [{
        id: `${section.id}-${question.id}`,
        question: cleanQuestionTitle(question.title),
        questionIndex,
        sectionId: section.id,
        sectionTitle: section.title,
      }] : [];
    }));
  }, [faqSections, language, normalizedSearchQuery]);
  const activeSearchResult = searchResults[searchResultIndex];
  const questionCount = faqSections.reduce((total, section) => total+section.questions.length, 0);
  const navigationItems: StoryNavigationItem[] = [
    { id: 'faq-start', label: copy.startLabel },
    { id: 'faq-list', label: copy.mapLabel },
    ...faqSections.map((section) => ({ id: section.id, label: section.title })),
    { id: 'faq-contact', label: copy.contactLabel },
  ];

  const handleSectionLinkClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const section = document.getElementById(sectionId);
    window.history.pushState(window.history.state, '', `#${encodeURIComponent(sectionId)}`);
    section?.scrollIntoView({ behavior, block: 'start' });
    const heading = section?.querySelector<HTMLElement>('h2, h3');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  };

  const openSearchResult = (result: FaqSearchResult) => {
    setTopicPages((pages) => ({ ...pages, [result.sectionId]: Math.floor(result.questionIndex / FAQ_PAGE_SIZE) }));
    setOpenQuestion(result.id);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const item = document.getElementById(result.id);
        window.history.pushState(window.history.state, '', `#${encodeURIComponent(result.id)}`);
        item?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'center',
        });
        item?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
      });
    });
  };

  return (
    <ScrollStory items={navigationItems} ariaLabel={copy.progressLabel}>
      <StorySection id='faq-start' className='min-h-[calc(100svh-4rem)] bg-[#071712] py-0 text-white'>
        <img
          src='/redesign/faq-hero.webp'
          srcSet='/redesign/faq-hero-640.webp 640w, /redesign/faq-hero-1024.webp 1024w, /redesign/faq-hero.webp 1536w'
          sizes='100vw'
          alt=''
          width='1536'
          height='1024'
          {...{ fetchpriority: 'high' }}
          decoding='async'
          className='absolute inset-0 h-full w-full object-cover object-[64%_center]' />
        <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,16,0.98)_0%,rgba(5,20,16,0.88)_48%,rgba(5,20,16,0.32)_86%)]'>
        </div>
        <div className='story-grid-art'>
        </div>
        <div className='story-ring-art -right-36 -top-32'>
        </div>

        <div className='container relative z-10 flex min-h-[calc(100svh-4rem)] items-center px-4 py-16 lg:py-20'>
          <div className='w-full max-w-5xl'>
            <Reveal>
              <p className='story-kicker text-[#b9f3dc]'>
                <HelpCircle className='h-4 w-4' />
                {copy.heroEyebrow}
              </p>
              <h1 className='story-display mt-7 max-w-5xl text-white'>{copy.heroTitle}</h1>
            </Reveal>
            <Reveal delay={120} className='mt-7'>
              <p className='story-lead text-white/[0.72]'>{copy.heroLead}</p>
            </Reveal>
            <Reveal delay={220} className='mt-9 flex flex-col gap-3 sm:flex-row'>
              <Button asChild size='lg' className='h-14 rounded-full bg-[#f5b942] px-7 font-black text-[#0a1713] shadow-[0_14px_40px_rgba(245,185,66,0.22)] hover:bg-[#ffd071]'>
                <a href='#faq-list' onClick={(event) => handleSectionLinkClick(event, 'faq-list')}>
                  {copy.heroPrimary}<ChevronRight className='ml-2 h-5 w-5' />
                </a>
              </Button>
              <Button asChild size='lg' variant='outline' className='h-14 rounded-full border-white/25 bg-white/[0.12] px-7 font-black text-white hover:bg-white hover:text-[#0a1713]'>
                <Link to='/kontakt'>{copy.contact}</Link>
              </Button>
            </Reveal>
            <Reveal delay={320} className='mt-10 flex flex-wrap gap-3'>
              <span className='story-chip border-white/[0.15] bg-white/[0.08] text-white/[0.72]'>
                <BookOpenCheck className='h-4 w-4 text-[#b9f3dc]' />{faqSections.length} {copy.sections}
              </span>
              <span className='story-chip border-white/[0.15] bg-white/[0.08] text-white/[0.72]'>
                <CheckCircle2 className='h-4 w-4 text-[#f5b942]' />{questionCount} {copy.answers}
              </span>
            </Reveal>
            <Reveal delay={400} className='mt-9 text-white/60'>
              <ScrollCue label={copy.scroll} />
            </Reveal>
          </div>
        </div>
      </StorySection>

      <StorySection id='faq-list' className='story-section-scrollable bg-[#f7f1e6] text-[#0a1713]'>
        <div className='story-orb -left-44 -top-40 bg-[#b9f3dc]/[0.55]'>
        </div>
        <div className='story-orb -bottom-52 right-0 bg-[#f5b942]/30 [animation-delay:-5s]'>
        </div>
        <div className='container relative z-10 grid gap-10 px-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-start xl:gap-14'>
          <div className='flex flex-col'>
            <Reveal>
              <p className='story-kicker w-fit rounded-full border border-[#126044]/15 bg-white/60 px-4 py-2 text-[#126044] shadow-sm backdrop-blur-sm'>
                <Search className='h-4 w-4' />{copy.mapEyebrow}
              </p>
              <h2 className='mt-7 max-w-[11ch] text-[clamp(3.25rem,5.1vw,6rem)] font-black leading-[0.92] tracking-[-0.055em]'>{copy.mapTitle}</h2>
              <p className='story-lead mt-7 max-w-2xl text-[#365a50]'>{copy.mapLead}</p>
            </Reveal>

            <div className='order-3 mt-6 grid gap-3.5'>
              <p className='mb-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#126044]/75'>{copy.orChooseTopic}</p>
              {faqSections.map((section, index) => {
                const { Icon } = section;
                return (
                  <Reveal key={section.id} delay={100 + index * 80}>
                    <a href={`#${section.id}`} className='group relative flex items-center gap-4 overflow-hidden rounded-[1.4rem] border border-[#123d32]/10 bg-white/90 p-4 shadow-[0_12px_34px_rgba(18,61,50,0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#187b5d]/35 hover:shadow-[0_18px_42px_rgba(18,61,50,0.12)] sm:p-5' onClick={(event) => handleSectionLinkClick(event, section.id)}>
                      <span className='absolute inset-y-0 left-0 w-1 bg-[#b9f3dc] opacity-0 transition-opacity duration-300 group-hover:opacity-100' aria-hidden='true'></span>
                      <span className='flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-[1rem] bg-[#123d32] text-[#b9f3dc] shadow-[0_8px_20px_rgba(18,61,50,0.18)]'>
                        <Icon className='h-[1.35rem] w-[1.35rem]' />
                      </span>
                      <span className='min-w-0 flex-1'>
                        <span className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#126044]'>
                          <span className='text-[#0a1713]/40'>0{index + 1}</span>
                          <span className='h-px w-5 bg-[#126044]/25' aria-hidden='true'></span>
                          {copy.questions(section.questions.length)}
                        </span>
                        <span className='mt-1.5 block text-[1.02rem] font-black leading-6 text-[#0a1713]'>{section.title}</span>
                      </span>
                      <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#126044]/15 bg-[#eff8f4] text-[#126044] transition-all duration-300 group-hover:bg-[#123d32] group-hover:text-white'>
                        <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5' />
                      </span>
                    </a>
                  </Reveal>
                );
              })}
            </div>

            <div className='relative order-2 mt-9 flex min-h-[25rem] flex-col overflow-hidden rounded-[1.85rem] border border-[#f5b942]/35 bg-[linear-gradient(145deg,#123d32_0%,#0a241d_72%)] p-5 text-white shadow-[0_24px_65px_rgba(13,44,36,0.24)] sm:h-[25rem] sm:p-7'>
              <div className='pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#b9f3dc]/10 blur-2xl' aria-hidden='true'></div>
              <div className='relative flex items-start justify-between gap-5'>
                <div>
                  <p className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#f5b942]'>
                    <span className='h-px w-7 bg-[#f5b942]' aria-hidden='true'></span>{copy.searchEyebrow}
                  </p>
                  <label htmlFor='faq-search' className='mt-2 block text-xl font-black leading-tight text-white sm:text-2xl'>
                    {copy.searchLabel}
                  </label>
                </div>
                <span className='hidden shrink-0 rounded-full border border-white/10 bg-white/[0.08] px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#b9f3dc] sm:inline-flex'>
                  {questionCount} {copy.answers}
                </span>
              </div>
              <div className='relative mt-5'>
                <span className='pointer-events-none absolute left-2.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-[#f5b942] text-[#0d2c24] shadow-[0_8px_20px_rgba(245,185,66,0.25)]' aria-hidden='true'>
                  <Search className='h-5 w-5' />
                </span>
                <input
                  id='faq-search'
                  type='search'
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setSearchResultIndex(0);
                  }}
                  placeholder={copy.searchPlaceholder}
                  aria-describedby='faq-search-hint'
                  className='h-16 w-full rounded-2xl border-2 border-white/90 bg-white py-3 pl-16 pr-4 text-base font-bold text-[#0a1713] shadow-[0_10px_28px_rgba(0,0,0,0.14)] outline-none placeholder:font-semibold placeholder:text-[#657a71] focus:border-[#f5b942] focus:ring-4 focus:ring-[#f5b942]/25' />
              </div>

              <p id='faq-search-hint' className='mt-2.5 text-xs font-semibold text-white/55'>
                {copy.searchHint}
              </p>

              {normalizedSearchQuery.length < 2 && (
                <div className='relative mt-auto border-t border-white/10 pt-5'>
                  <p className='text-[10px] font-black uppercase tracking-[0.14em] text-white/55'>{copy.suggestionsLabel}</p>
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {copy.suggestedSearches.map((suggestion) => (
                      <button
                        key={suggestion}
                        type='button'
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setSearchResultIndex(0);
                        }}
                        className='rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-black text-white transition-colors hover:border-[#f5b942]/60 hover:bg-[#f5b942] hover:text-[#0d2c24]'>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {normalizedSearchQuery.length >= 2 && (
                <div className='relative mt-4 flex min-h-0 flex-1 flex-col' aria-live='polite'>
                  <p className='text-[11px] font-black uppercase tracking-[0.12em] text-[#b9f3dc]'>
                    {copy.searchResults(searchResults.length)}
                  </p>
                  {searchResults.length > 0 ? (
                    <div className='mt-3 flex min-h-0 flex-1 flex-col'>
                      <div className='grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-stretch gap-2.5'>
                        <button
                          type='button'
                          aria-label={copy.previousResult}
                          disabled={searchResultIndex === 0}
                          onClick={() => setSearchResultIndex((index) => Math.max(0, index - 1))}
                          className='flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-[#b9f3dc] transition-colors hover:border-[#b9f3dc]/35 hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-25'>
                          <ArrowLeft className='h-4 w-4' />
                        </button>

                        {activeSearchResult && (
                          <button
                            key={activeSearchResult.id}
                            type='button'
                            onClick={() => openSearchResult(activeSearchResult)}
                            className='group flex h-[7.5rem] w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.09] px-5 py-4 text-left shadow-inner transition-all hover:border-[#b9f3dc]/35 hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9f3dc]'>
                            <span className='min-w-0 flex-1'>
                              <span className='block truncate text-[11px] font-black uppercase tracking-[0.12em] text-[#b9f3dc]'>{activeSearchResult.sectionTitle}</span>
                              <span className='mt-2 line-clamp-3 block text-base font-black leading-6 text-white'>{activeSearchResult.question}</span>
                            </span>
                            <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b9f3dc] text-[#0d2c24]'>
                              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' aria-hidden='true' />
                            </span>
                          </button>
                        )}

                        <button
                          type='button'
                          aria-label={copy.nextResult}
                          disabled={searchResultIndex >= searchResults.length - 1}
                          onClick={() => setSearchResultIndex((index) => Math.min(searchResults.length - 1, index + 1))}
                          className='flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-[#b9f3dc] transition-colors hover:border-[#b9f3dc]/35 hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-25'>
                          <ArrowRight className='h-4 w-4' />
                        </button>
                      </div>

                      <div className='mt-3 flex items-center gap-3'>
                        <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-white/10'>
                          <div
                            className='h-full rounded-full bg-[#b9f3dc] transition-[width] duration-300'
                            style={{ width: `${((searchResultIndex + 1) / searchResults.length) * 100}%` }}>
                          </div>
                        </div>
                        <span className='min-w-12 text-right text-[10px] font-black uppercase tracking-[0.12em] text-white/55'>
                          {copy.resultPosition(searchResultIndex + 1, searchResults.length)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className='mt-3 text-sm leading-6 text-white/70'>{copy.noSearchResults}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <Reveal delay={160} className='story-photo-frame min-h-[28rem] shadow-[0_24px_70px_rgba(18,61,50,0.13)] lg:sticky lg:top-8 lg:min-h-[40rem]'>
            <img
              src='/redesign/faq-guidance.webp'
              srcSet='/redesign/faq-guidance-640.webp 640w, /redesign/faq-guidance-1024.webp 1024w, /redesign/faq-guidance.webp 1536w'
              sizes='(min-width: 1536px) 739px, (min-width: 1280px) 672px, (min-width: 1024px) 529px, (min-width: 768px) 736px, (min-width: 640px) 608px, calc(100vw - 2rem)'
              alt={copy.mapImageAlt}
              width='1536'
              height='1024'
              loading='lazy'
              decoding='async'
              className='story-photo absolute inset-0 object-[50%_center]' />
            <div className='absolute inset-x-5 bottom-5 z-10 grid grid-cols-2 gap-px overflow-hidden rounded-[1.4rem] border border-white/[0.15] bg-[#071712]/[0.92] text-white shadow-[0_18px_50px_rgba(7,23,18,0.28)] sm:inset-x-8 sm:bottom-8'>
              <div className='bg-[#071712]/[0.78] p-5 text-center'>
                <p className='text-3xl font-black'>{faqSections.length}</p>
                <p className='mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/70'>{copy.sections}</p>
              </div>
              <div className='bg-[#071712]/[0.78] p-5 text-center'>
                <p className='text-3xl font-black text-[#f5b942]'>{questionCount}</p>
                <p className='mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/70'>{copy.answers}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </StorySection>

      {faqSections.map((section, sectionIndex) => {
        const styles = toneStyles[section.tone];
        const { Icon } = section;
        const pageCount = Math.max(1, Math.ceil(section.questions.length / FAQ_PAGE_SIZE));
        const activePage = Math.min(topicPages[section.id] ?? 0, pageCount - 1);
        const pageStart = activePage * FAQ_PAGE_SIZE;
        const visibleQuestions = section.questions.slice(pageStart, pageStart + FAQ_PAGE_SIZE);
        const changePage = (nextPage: number) => {
          setOpenQuestion('');
          setTopicPages((pages) => ({ ...pages, [section.id]: nextPage }));
        };

        return (
          <StorySection
            key={section.id}
            id={section.id}
            deferRendering
            deferIntrinsicSize='1200px'
            className={`faq-topic-section story-section-scrollable items-start ${styles.section}`}>
            {section.tone === 'dark' ? <div className='story-grid-art opacity-25'></div> : <div className='story-orb -right-52 -top-48 bg-white/40'></div>}
            <div className='container relative z-10 px-4'>
              <Reveal className='grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end'>
                <div className='max-w-5xl'>
                  <p className={`story-kicker ${styles.kicker}`}>
                    <Icon className='h-4 w-4' />{copy.topicPosition(sectionIndex+1, faqSections.length)}
                  </p>
                  <h2 className={`story-title mt-6 ${styles.title}`}>{section.title}</h2>
                </div>
                <p className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-black ${styles.counter}`}>{copy.questions(section.questions.length)}</p>
              </Reveal>

              <Reveal delay={120} className='mt-12'>
                <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
                  <p className={`text-[11px] font-black uppercase tracking-[0.15em] ${styles.kicker}`}>
                    {copy.questionRange(pageStart + 1, Math.min(pageStart + FAQ_PAGE_SIZE, section.questions.length), section.questions.length)}
                  </p>
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      aria-label={copy.previousQuestions}
                      disabled={activePage === 0}
                      onClick={() => changePage(Math.max(0, activePage - 1))}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${styles.counter}`}>
                      <ArrowLeft className='h-4 w-4' />
                    </button>
                    <span className={`rounded-full border px-4 py-2.5 text-xs font-black ${styles.counter}`}>
                      {copy.pagePosition(activePage + 1, pageCount)}
                    </span>
                    <button
                      type='button'
                      aria-label={copy.nextQuestions}
                      disabled={activePage >= pageCount - 1}
                      onClick={() => changePage(Math.min(pageCount - 1, activePage + 1))}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${styles.counter}`}>
                      <ArrowRight className='h-4 w-4' />
                    </button>
                  </div>
                </div>
                <Accordion
                  type='single'
                  collapsible
                  value={openQuestion}
                  onValueChange={setOpenQuestion}
                  className='grid gap-4 lg:grid-cols-2 lg:items-start'>
                  {visibleQuestions.map((question, questionIndex) => (
                    <FaqQuestionItem
                      key={`${section.id}-${question.id}`}
                      answerLabel={copy.answerLabel}
                      index={pageStart + questionIndex}
                      question={question}
                      questionLabel={copy.questionLabel}
                      sectionId={section.id}
                      tone={section.tone} />
                  ))}
                </Accordion>
              </Reveal>
            </div>
          </StorySection>
        );
      })}

      <StorySection deferRendering deferIntrinsicSize='800px' id='faq-contact' className='bg-[#f5b942] text-[#0a1713]'>
        <div className='story-grid-art !opacity-20 [background-image:linear-gradient(rgba(10,23,19,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(10,23,19,0.1)_1px,transparent_1px)]'>
        </div>
        <div className='story-ring-art -right-28 top-1/2 !border-[#0a1713]/[0.15] !shadow-[0_0_0_3rem_rgba(10,23,19,0.025),0_0_0_7rem_rgba(10,23,19,0.02),0_0_0_12rem_rgba(10,23,19,0.015)]'>
        </div>
        <div className='container relative z-10 px-4'>
          <Reveal className='max-w-6xl'>
            <p className='story-kicker text-[#123d32]'>
              <MessageCircle className='h-4 w-4' />{copy.missingEyebrow}
            </p>
            <h2 className='story-title mt-7 max-w-6xl'>{copy.missingTitle}</h2>
            <p className='story-lead mt-7 text-[#29483f]'>{copy.missingLead}</p>
          </Reveal>
          <Reveal delay={160} className='mt-10 flex flex-col gap-3 sm:flex-row'>
            <Button asChild size='lg' className='h-14 rounded-full bg-[#0a1713] px-7 font-black text-white hover:bg-[#123d32]'>
              <Link to='/kontakt'>
                {copy.message}<Mail className='ml-2 h-5 w-5' />
              </Link>
            </Button>
            <Button asChild size='lg' variant='outline' className='h-14 rounded-full border-[#0a1713]/25 bg-white/30 px-7 font-black text-[#0a1713] hover:bg-white/70'>
              <Link to='/zapisz'>
                {copy.enroll}<ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
          </Reveal>
        </div>
      </StorySection>
    </ScrollStory>
  );
}
