import { Reveal, ScrollCue, ScrollStory, StorySection, type StoryNavigationItem } from '@/components/immersive/ScrollStory';
import { Button } from '@/components/ui/button';
import type { Language } from '@/lib/i18n';
import { localizeOfferPlans } from '@/lib/offer-localization';
import type { OfferPlan } from '@/types/site-content';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Crown,
  MessageCircle,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from '@/components/navigation/LocalizedLink';

type OfferPageProps = { language: Language, offerPlans: OfferPlan[] };
type SubjectGroup = 'chess' | 'math' | 'exams' | 'cooperation';
type ActiveGroup = SubjectGroup | 'all';
type PriceRow = { label: string, amount: string, note?: string };
type DetailItem = { label: string, value: string };
type PricingCardData = {
  plan: OfferPlan,
  group: SubjectGroup,
  title: string,
  priceRows: PriceRow[],
  details: DetailItem[],
  isCustomOffer: boolean,
  isFeatured: boolean,
  Icon: LucideIcon,
};

const groupOrder: ActiveGroup[] = ['all', 'chess', 'math', 'exams', 'cooperation'];
const groupIcons: Record<SubjectGroup, LucideIcon> = {
  chess: Crown,
  math: Calculator,
  exams: CalendarCheck,
  cooperation: Building2,
};

const pricingCopy = {
  pl: {
    progressLabel: 'Sekcje cennika',
    sections: [
      { id: 'offer-start', label: 'Cennik' },
      { id: 'offer-prices', label: 'Warianty' },
      { id: 'offer-next', label: 'Dobór zajęć' },
    ] satisfies StoryNavigationItem[],
    heroKicker: 'Cennik zajęć',
    fixedPriceLabel: 'cen dostępnych od razu',
    title: 'Sprawdź, ile kosztują zajęcia.',
    lead: 'Ceny lekcji indywidualnych, grup i kursów znajdziesz poniżej. Dla szkół i firm przygotujemy wycenę po krótkiej rozmowie.',
    monthlyNote: 'Jasne rozliczenie miesięczne',
    customNote: 'Wycena szkół i firm przed startem',
    scroll: 'Zobacz ceny i warianty',
    filterLabel: 'Filtr cennika',
    filterTitle: 'Kategoria',
    groupLabels: { all: 'Wszystkie', chess: 'Szachy', math: 'Matematyka', exams: 'Egzaminy', cooperation: 'Współpraca' },
    pricingKicker: 'Cennik zajęć',
    pricingTitle: 'Porównaj dostępne zajęcia.',
    pricingLead: 'Wybierz kategorię. Szczegóły i cena są na każdej karcie.',
    visiblePlans: (visible: number, total: number) => `Wyświetlamy ${visible} z ${total} wariantów`,
    browseHint: 'Oferta',
    previous: 'Poprzednia',
    next: 'Następna',
    optionPosition: (current: number, total: number) => `${current} z ${total}`,
    detailsLabel: 'Najważniejsze informacje',
    featured: 'najczęściej wybierane',
    price: 'Cena',
    priceVariants: 'Warianty ceny',
    offer: 'Oferta',
    customQuote: 'Wycena indywidualna',
    chooseClasses: 'Zapisz ucznia',
    askOffer: 'Zapytaj o ofertę',
    helpEyebrow: 'Nie wiesz, co wybrać?',
    helpTitle: 'Wystarczy krótko opisać ucznia i cel zajęć.',
    helpLead: 'Podaj wiek, obecny poziom i to, nad czym uczeń chce pracować. Jeśli pasuje kilka wariantów, krótko wyjaśnimy różnice.',
    helpImageAlt: 'Uczennica z rodzicem rozmawia z prowadzącym o wyborze zajęć',
    ask: 'Porozmawiajmy',
    dependsOnPrefix: 'Zależy od',
  },
  en: {
    progressLabel: 'Pricing sections',
    sections: [
      { id: 'offer-start', label: 'Pricing' },
      { id: 'offer-prices', label: 'Options' },
      { id: 'offer-next', label: 'Choose a class' },
    ] satisfies StoryNavigationItem[],
    heroKicker: 'Class pricing',
    fixedPriceLabel: 'prices listed upfront',
    title: 'See what the classes cost.',
    lead: 'Prices for individual lessons, groups and courses are listed below. We prepare a quote for schools and companies after a short conversation.',
    monthlyNote: 'Clear monthly billing',
    customNote: 'Quote for schools and companies before starting',
    scroll: 'See prices and options',
    filterLabel: 'Pricing filter',
    filterTitle: 'Category',
    groupLabels: { all: 'All', chess: 'Chess', math: 'Math', exams: 'Exams', cooperation: 'Cooperation' },
    pricingKicker: 'Class pricing',
    pricingTitle: 'Compare the available classes.',
    pricingLead: 'Choose a category. Each card shows the details and price.',
    visiblePlans: (visible: number, total: number) => `Showing ${visible} of ${total} options`,
    browseHint: 'Offer',
    previous: 'Previous',
    next: 'Next',
    optionPosition: (current: number, total: number) => `${current} of ${total}`,
    detailsLabel: 'Key information',
    featured: 'most popular',
    price: 'Price',
    priceVariants: 'Price variants',
    offer: 'Offer',
    customQuote: 'Custom quote',
    chooseClasses: 'Enrol a student',
    askOffer: 'Ask for a quote',
    helpEyebrow: 'Not sure what to choose?',
    helpTitle: 'A short description of the student and their goal is enough.',
    helpLead: 'Tell us their age, current level and what they want to work on. If several options fit, we will briefly explain the differences.',
    helpImageAlt: 'A student and parent discuss class options with a tutor',
    ask: 'Talk to us',
    dependsOnPrefix: 'Depends on',
  },
};

const featuredPlanIds = new Set(['primary-school', 'individual-chess', 'math-tutoring-regular', 'egzamin-osmoklasisty']);

function cleanFeatureText(feature: string) {
  return feature
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\p{Emoji_Presentation}/gu, '')
    .replace(/\u200D/g, '')
    .replace(/\uFE0F/g, '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/\s*\|\s*/g, ' · ')
    .replace(/\s+/g, ' ')
    .trim();
}

const detailLabels = {
  pl: {
    age: 'Wiek',
    audience: 'Dla kogo',
    character: 'Charakter zajęć',
    duration: 'Czas zajęć',
    format: 'Format',
    frequency: 'Częstotliwość',
    goal: 'Cel',
    groupSize: 'Wielkość grupy',
    organisation: 'Organizacja',
    participants: 'Liczba uczestników',
    programme: 'Program',
    schedule: 'Harmonogram',
    scope: 'Zakres',
  },
  en: {
    age: 'Age',
    audience: 'For whom',
    character: 'Class style',
    duration: 'Class duration',
    format: 'Format',
    frequency: 'Frequency',
    goal: 'Goal',
    groupSize: 'Group size',
    organisation: 'Organisation',
    participants: 'Participants',
    programme: 'Programme',
    schedule: 'Schedule',
    scope: 'Scope',
  },
} as const;

function capitaliseDetailValue(value: string) {
  const cleanedValue = value.replace(/^[\s·,:;-]+|[\s.]+$/g, '').trim();
  return cleanedValue
    ? cleanedValue.charAt(0).toLocaleUpperCase()+cleanedValue.slice(1)
    : cleanedValue;
}

function splitDetailFeature(feature: string) {
  const normalizedFeature = cleanFeatureText(feature);
  const initialParts = normalizedFeature.split(/\s*·\s*/).filter(Boolean);

  return initialParts.flatMap((part) => {
    const groupDescription = part.match(/^(Grupy?\s+[^,]+|Groups?\s+(?:of\s+)?[^,]+),\s*(.+)$/i);
    if (groupDescription) {
      return [groupDescription[1], groupDescription[2]];
    }

    if (/(?:tygodniu|week)/i.test(part) && /\d+\s*min/i.test(part)) {
      return part.split(/\s*[,/]\s*/).filter(Boolean);
    }

    if (/^\d+\s*min\s*\/\s*/i.test(part)) {
      return part.split(/\s*\/\s*/).filter(Boolean);
    }

    return [part];
  });
}

function getDetailItem(detail: string, language: Language): DetailItem {
  const labels = detailLabels[language];
  const text = detail.trim();

  if (/^(?:Dla dzieci w wieku|For children aged)\b/i.test(text)) {
    return {
      label: labels.age,
      value: capitaliseDetailValue(text.replace(/^(?:Dla dzieci w wieku|For children aged)\s*/i, '')),
    };
  }
  if (/^(?:Dla uczniów|For (?:primary|secondary|students))/i.test(text)) {
    return {
      label: labels.audience,
      value: capitaliseDetailValue(text.replace(/^(?:Dla|For)\s+/i, '')),
    };
  }
  if (/^(?:1x w tygodniu|raz w tygodniu|once a week)$/i.test(text)) {
    return { label: labels.frequency, value: capitaliseDetailValue(text.replace(/^1x/i, '1×')) };
  }
  if (/^\d+\s*min\b/i.test(text)) {
    return { label: labels.duration, value: capitaliseDetailValue(text) };
  }
  if (/^(?:Grupy?|Groups?)\b/i.test(text)) {
    return {
      label: labels.groupSize,
      value: capitaliseDetailValue(text.replace(/^(?:Grupy?|Groups?)\s*(?:of\s+)?/i, '')),
    };
  }
  if (/^\d+\s*(?:osob(?:a|y)?|students?|participants?)$/i.test(text)) {
    return { label: labels.participants, value: capitaliseDetailValue(text) };
  }
  if (/^(?:Program dopasowany|Programme matched)/i.test(text)) {
    return {
      label: labels.programme,
      value: capitaliseDetailValue(text.replace(/^(?:Program|Programme)\s*/i, '')),
    };
  }
  if (/^(?:Harmonogram|Schedule)\b/i.test(text)) {
    return {
      label: labels.schedule,
      value: capitaliseDetailValue(text.replace(/^(?:Harmonogram|Schedule)\s*/i, '')),
    };
  }
  if (/(?:elastyczny termin|flexible schedul|czas trwania i zakres|duration and scope)/i.test(text)) {
    return { label: labels.organisation, value: capitaliseDetailValue(text) };
  }
  if (/(?:kameraln|przyjazn|small classes|friendly learning)/i.test(text)) {
    return { label: labels.character, value: capitaliseDetailValue(text) };
  }
  if (/(?:przygotowanie do egzaminu|exam preparation)/i.test(text)) {
    return { label: labels.goal, value: capitaliseDetailValue(text) };
  }
  if (/(?:zajęcia lub warsztaty|warsztaty, turnieje|classes or workshops|workshops, tournaments)/i.test(text)) {
    return { label: labels.format, value: capitaliseDetailValue(text) };
  }

  return { label: labels.scope, value: capitaliseDetailValue(text) };
}

function isPriceFeature(feature: string) {
  const text = feature.toLocaleLowerCase();
  return ['zł', 'pln', 'cena', 'price', 'oferta', 'offer', 'wyceniana', 'quote'].some((term) => text.includes(term));
}

function getPriceNote(priceFeature: string, language: Language) {
  const note = priceFeature.match(/\(([^)]+)\)/)?.[1]?.trim();
  if (!note) return undefined;

  const normalizedNote = note.toLocaleLowerCase();
  const polishPrefix = 'w zależności od ';
  const englishPrefix = 'depending on ';
  if (normalizedNote.startsWith(polishPrefix)) {
    return `${pricingCopy[language].dependsOnPrefix} ${note.slice(polishPrefix.length)}`;
  }
  if (normalizedNote.startsWith(englishPrefix)) {
    return `${pricingCopy[language].dependsOnPrefix} ${note.slice(englishPrefix.length)}`;
  }
  return note.charAt(0).toLocaleUpperCase()+note.slice(1);
}

function getPriceRow(priceFeature: string, language: Language): PriceRow {
  const copy = pricingCopy[language];
  const note = getPriceNote(priceFeature, language);
  const price = cleanFeatureText(priceFeature)
    .replace(/^Cena\s+/i, '')
    .replace(/^Oferta\s+/i, '')
    .replace(/^Price\s+/i, '')
    .replace(/^Offer\s+/i, '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim();
  const normalizedPrice = price.toLocaleLowerCase();
  if (
    normalizedPrice.includes('ustalana')
    || normalizedPrice.includes('wyceniana')
    || normalizedPrice.includes('indywidualnie')
    || normalizedPrice.includes('custom quote')
    || normalizedPrice.includes('quote')
  ) {
    return { label: copy.offer, amount: copy.customQuote, note };
  }

  const priceParts = price.split(/\s+[–-]\s+/);
  if (priceParts.length > 1) {
    const amount = priceParts.pop();
    return { label: priceParts.join(' · '), amount: amount ?? price, note };
  }
  return { label: copy.price, amount: price, note };
}

function getSubjectGroup(planId: string): SubjectGroup {
  if (planId === 'institutions' || planId === 'companies') return 'cooperation';
  if (planId === 'egzamin-osmoklasisty' || planId === 'matura') return 'exams';
  if (planId.startsWith('math')) return 'math';
  return 'chess';
}

function getShortTitle(title: string) {
  const [, ...nameParts] = title.split(/\s+[–-]\s+/);
  const shortTitle = nameParts.length > 0 ? nameParts.join(' · ') : title;
  return shortTitle.charAt(0).toLocaleUpperCase()+shortTitle.slice(1);
}

function getPricingCardData(plan: OfferPlan, language: Language): PricingCardData {
  const priceRows = plan.features.filter(isPriceFeature).map((feature) => getPriceRow(feature, language));
  const details = plan.features
    .filter((feature) => !isPriceFeature(feature))
    .flatMap(splitDetailFeature)
    .map((detail) => getDetailItem(detail, language))
    .filter((detail, index, allDetails) => allDetails.findIndex((candidate) => (
      candidate.label === detail.label && candidate.value === detail.value
    )) === index)
    .slice(0, 4);
  const isCustomOffer = priceRows.some((row) => {
    const amount = row.amount.toLocaleLowerCase();
    return amount.includes('indywidual') || amount.includes('wycen') || amount.includes('custom') || amount.includes('quote');
  });
  const group = getSubjectGroup(plan.id);
  return {
    plan,
    group,
    title: getShortTitle(plan.title),
    priceRows: priceRows.length > 0 ? priceRows : [{ label: pricingCopy[language].offer, amount: pricingCopy[language].customQuote }],
    details,
    isCustomOffer,
    isFeatured: plan.popular === true || featuredPlanIds.has(plan.id),
    Icon: groupIcons[group],
  };
}

function PricingCard({ card, groupLabel, language }: {
  card: PricingCardData,
  groupLabel: string,
  language: Language,
}) {
  const { Icon } = card;
  const copy = pricingCopy[language];
  const hasManyPrices = card.priceRows.length > 1;
  return (
    <article className='grid h-full overflow-hidden bg-[#fffdf8] lg:grid-cols-[1.14fr_0.86fr]'>
      <div className='p-6 sm:p-8 lg:border-r lg:border-[#123d32]/10 lg:p-9'>
        <div className='flex flex-wrap items-center gap-3.5'>
          <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#dfece5] text-[#123d32] shadow-[inset_0_0_0_1px_rgba(18,61,50,0.06)]'>
            <Icon className='h-6 w-6' />
          </span>
          <span className='text-xs font-black uppercase tracking-[0.14em] text-[#126044]'>{groupLabel}</span>
          {card.isFeatured && (
            <span className='ml-auto inline-flex min-h-9 items-center gap-2 rounded-full border border-[#e4bd5e]/25 bg-[#f5b942]/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.09em] text-[#6b4a00]'>
              <Sparkles className='h-4 w-4' />
              {copy.featured}
            </span>
          )}
        </div>

        <h3 className='mt-5 text-3xl font-black leading-[1.04] tracking-[-0.04em] text-[#0a1713] sm:text-[2.5rem]'>{card.title}</h3>

        {card.details.length > 0 && (
          <div className='mt-7'>
            <div className='flex items-center gap-3'>
              <p className='shrink-0 text-[10px] font-black uppercase tracking-[0.15em] text-[#126044]'>{copy.detailsLabel}</p>
              <span className='h-px flex-1 bg-[#123d32]/10'>
              </span>
            </div>
            <ul className='mt-3 grid gap-2.5 text-[#173c32] sm:grid-cols-2'>
              {card.details.map((detail, index) => (
                <li
                  key={`${card.plan.id}-${detail.label}-${detail.value}`}
                  className={`grid min-h-24 grid-cols-[auto_1fr] items-center gap-3.5 rounded-2xl border border-[#d9e4de] bg-white px-4 py-4 shadow-[0_6px_18px_rgba(18,61,50,0.035)] ${card.details.length % 2 === 1 && index === card.details.length - 1 ? 'sm:col-span-2' : ''}`}>
                  <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#123d32] text-[#b9f3dc]'>
                    <Check className='h-4 w-4' />
                  </span>
                  <span className='min-w-0'>
                    <span className='block text-[9px] font-black uppercase leading-4 tracking-[0.14em] text-[#668078]'>
                      {detail.label}
                    </span>
                    <span className='mt-1 block text-[0.95rem] font-black leading-6 text-[#173c32] sm:text-base'>
                      {detail.value}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className='relative flex min-h-full flex-col overflow-hidden bg-[linear-gradient(155deg,#173e34_0%,#0d2b23_100%)] p-6 text-white sm:p-8 lg:p-9'>
        <div className='pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full border border-white/10 shadow-[0_0_0_2.5rem_rgba(255,255,255,0.025),0_0_0_6rem_rgba(255,255,255,0.018)]'>
        </div>
        <div className='relative flex flex-1 flex-col'>
          <p className='text-[10px] font-black uppercase tracking-[0.15em] text-[#b9d8cb]'>
            {hasManyPrices ? copy.priceVariants : card.priceRows[0].label}
          </p>
          <div className={`mt-4 grid gap-3 ${hasManyPrices ? 'sm:grid-cols-2' : ''}`}>
            {card.priceRows.map((row) => (
              <div key={`${card.plan.id}-${row.label}-${row.amount}`} className={`${hasManyPrices ? 'rounded-2xl border border-white/10 bg-white/[0.07] p-4' : 'border-y border-white/10 py-5'}`}>
                {hasManyPrices && <p className='text-xs font-bold leading-5 text-white/60'>{row.label}</p>}
                <p className={`mt-1 break-words font-black leading-tight tracking-[-0.04em] text-white ${hasManyPrices ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}>{row.amount}</p>
                {row.note && <p className='mt-2 text-xs font-semibold leading-5 text-white/60'>{row.note}</p>}
              </div>
            ))}
          </div>

          <Button asChild className='mt-7 h-12 w-full rounded-full bg-[#f5b942] font-black text-[#0a1713] shadow-[0_12px_28px_rgba(245,185,66,0.14)] hover:bg-[#ffd071] lg:mt-auto'>
            <Link to={card.isCustomOffer
              ? '/kontakt'
              : `/zapisz?offer=${encodeURIComponent(card.plan.id)}`}>
              {card.isCustomOffer ? copy.askOffer : copy.chooseClasses}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function OfferPage({ language, offerPlans }: OfferPageProps) {
  const [activeGroup, setActiveGroup] = useState<ActiveGroup>('all');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const copy = pricingCopy[language];
  const localizedOfferPlans = useMemo(() => localizeOfferPlans(offerPlans, language), [language, offerPlans]);
  const cards = useMemo(
    () => localizedOfferPlans.map((plan) => getPricingCardData(plan, language)),
    [language, localizedOfferPlans],
  );
  const visibleCards = activeGroup === 'all' ? cards : cards.filter((card) => card.group === activeGroup);
  const safeCardIndex = Math.min(activeCardIndex, Math.max(visibleCards.length - 1, 0));
  const activeCard = visibleCards[safeCardIndex];
  const fixedPriceCount = cards.filter((card) => !card.isCustomOffer).length;

  return (
    <ScrollStory items={copy.sections} ariaLabel={copy.progressLabel}>
      <StorySection id='offer-start' className='min-h-[calc(100svh-4rem)] bg-[#071712] py-0 text-white'>
        <img
          src='/redesign/pricing-hero.webp'
          srcSet='/redesign/pricing-hero-640.webp 640w, /redesign/pricing-hero-1024.webp 1024w, /redesign/pricing-hero.webp 1536w'
          sizes='100vw'
          alt=''
          width='1536'
          height='1024'
          {...{ fetchpriority: 'high' }}
          decoding='async'
          className='absolute inset-0 h-full w-full object-cover object-[65%_center]' />
        <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,16,0.98)_0%,rgba(5,20,16,0.9)_46%,rgba(5,20,16,0.34)_82%)]'>
        </div>
        <div className='story-grid-art'>
        </div>
        <div className='story-ring-art -right-40 -top-36'>
        </div>

        <div className='container relative z-10 flex min-h-[calc(100svh-4rem)] items-center px-4 py-12 lg:py-16'>
          <Reveal className='relative w-full max-w-[61rem] overflow-hidden rounded-[2.35rem] border border-white/[0.14] bg-[linear-gradient(135deg,rgba(7,23,18,0.94),rgba(7,23,18,0.76))] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.34)] backdrop-blur-[5px] sm:p-9 lg:p-11'>
            <div className='pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full border border-[#b9f3dc]/15 shadow-[0_0_0_3rem_rgba(185,243,220,0.025),0_0_0_7rem_rgba(185,243,220,0.018)]'>
            </div>
            <p className='story-kicker text-[#b9f3dc]'>
              <CircleDollarSign className='h-4 w-4' />
              {copy.heroKicker}
            </p>
            <h1 className='story-title story-title-compact relative mt-6 max-w-4xl text-white'>{copy.title}</h1>
            <p className='relative mt-5 max-w-3xl text-base font-medium leading-7 text-white/70 sm:text-lg sm:leading-8'>
              {copy.lead}
            </p>

            <div className='relative mt-8 grid gap-3 sm:grid-cols-[0.9fr_1fr_1.15fr]'>
              <div className='flex min-h-24 items-center gap-4 rounded-2xl bg-[#f5b942] px-5 py-4 text-[#0a1713] shadow-[0_14px_34px_rgba(245,185,66,0.16)]'>
                <span className='text-5xl font-black tracking-[-0.07em]'>{fixedPriceCount}</span>
                <span className='max-w-32 text-xs font-black uppercase leading-5 tracking-[0.09em]'>
                  {copy.fixedPriceLabel}
                </span>
              </div>
              <div className='flex min-h-24 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4'>
                <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#b9f3dc]/10 text-[#b9f3dc]'>
                  <BadgeCheck className='h-6 w-6' />
                </span>
                <span className='text-sm font-black leading-6 text-white/85'>{copy.monthlyNote}</span>
              </div>
              <div className='flex min-h-24 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4'>
                <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#b9f3dc]/10 text-[#b9f3dc]'>
                  <CheckCircle2 className='h-6 w-6' />
                </span>
                <span className='text-sm font-black leading-6 text-white/85'>{copy.customNote}</span>
              </div>
            </div>

            <div className='relative mt-7 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 text-white/80 transition-colors hover:bg-white/[0.09] hover:text-white'>
              <ScrollCue label={copy.scroll} />
            </div>
          </Reveal>
        </div>
      </StorySection>

      <StorySection id='offer-prices' className='offer-prices-section bg-[#f7f1e6] text-[#0a1713]'>
        <div className='story-orb -left-40 -top-40 bg-[#b9f3dc]/[0.55]'>
        </div>
        <div className='story-orb -bottom-56 right-0 bg-[#e4dcff]/70 [animation-delay:-7s]'>
        </div>
        <div className='container relative z-10 px-4'>
          <Reveal className='flex items-end justify-between gap-8'>
            <div>
              <p className='story-kicker text-[#126044]'>{copy.pricingKicker}</p>
              <h2 className='story-title story-title-compact mt-5 max-w-4xl'>{copy.pricingTitle}</h2>
              <p className='mt-3 text-sm font-semibold leading-6 text-[#466158]'>{copy.pricingLead}</p>
            </div>
          </Reveal>

          <Reveal delay={100} className='mt-5 overflow-hidden rounded-[1.65rem] border border-[#123d32]/15 bg-white shadow-[0_22px_60px_rgba(18,61,50,0.12)]'>
            <div className='bg-[#e5ede8] px-4 py-3 sm:px-5'>
              <div className='flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                  <p className='shrink-0 text-[10px] font-black uppercase tracking-[0.16em] text-[#557068]'>{copy.filterTitle}</p>
                  <div role='group' aria-label={copy.filterLabel} className='flex flex-wrap gap-1.5'>
                    {groupOrder.map((group) => {
                      const isActive = activeGroup === group;
                      return (
                        <button
                          key={group}
                          type='button'
                          aria-pressed={isActive}
                          className={`h-9 shrink-0 rounded-full border px-4 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#126044]/40 focus-visible:ring-offset-2 ${isActive ? 'border-[#123d32] bg-[#123d32] text-white shadow-[0_5px_14px_rgba(18,61,50,0.14)]' : 'border-transparent bg-white/65 text-[#466158] hover:bg-white hover:text-[#123d32]'}`}
                          onClick={() => {
                            setActiveGroup(group);
                            setActiveCardIndex(0);
                          }}>
                          {copy.groupLabels[group]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className='flex items-center justify-between gap-3 xl:justify-end'>
                  <div className='min-w-0 border-l border-[#123d32]/15 pl-3 xl:text-right'>
                    <p className='text-[9px] font-black uppercase tracking-[0.14em] text-[#657c74]'>{copy.browseHint}</p>
                    <p aria-live='polite' className='mt-0.5 text-xs font-black text-[#123d32]'>{copy.optionPosition(safeCardIndex + 1, visibleCards.length)}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      disabled={safeCardIndex === 0}
                      aria-label={language === 'pl' ? 'Poprzedni wariant' : 'Previous option'}
                      className='flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#b8c9c0] bg-white/70 px-3 text-xs font-bold text-[#315448] transition-colors hover:bg-white hover:text-[#123d32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#126044]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35'
                      onClick={() => setActiveCardIndex((index) => Math.max(index - 1, 0))}>
                      <ChevronLeft className='h-4 w-4' />
                      <span className='hidden sm:inline'>{copy.previous}</span>
                    </button>
                    <button
                      type='button'
                      disabled={safeCardIndex >= visibleCards.length - 1}
                      aria-label={language === 'pl' ? 'Następny wariant' : 'Next option'}
                      className='flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#123d32] px-3 text-xs font-bold text-white transition-colors hover:bg-[#1d4c3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#126044]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35'
                      onClick={() => setActiveCardIndex((index) => Math.min(index + 1, visibleCards.length - 1))}>
                      <span className='hidden sm:inline'>{copy.next}</span>
                      <ChevronRight className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='h-[3px] bg-[#d4ded8]' aria-hidden='true'>
              <span
                className='block h-full bg-[#b18d50] transition-[width] duration-300'
                style={{ width: `${((safeCardIndex + 1) / Math.max(visibleCards.length, 1)) * 100}%` }} />
            </div>

            <div id='offer-card-grid' className='min-w-0 lg:h-[32rem]' aria-live='polite' aria-atomic='true'>
              {activeCard && (
                <Reveal key={activeCard.plan.id} delay={80} className='h-full'>
                  <PricingCard card={activeCard} groupLabel={copy.groupLabels[activeCard.group]} language={language} />
                </Reveal>
              )}
            </div>
          </Reveal>
        </div>
      </StorySection>

      <StorySection deferRendering deferIntrinsicSize='800px' id='offer-next' className='bg-[#f5b942] text-[#0a1713]'>
        <div className='story-grid-art !opacity-20 [background-image:linear-gradient(rgba(10,23,19,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(10,23,19,0.1)_1px,transparent_1px)]'>
        </div>
        <div className='story-ring-art -bottom-28 -left-36 !border-[#0a1713]/[0.15] !shadow-[0_0_0_3rem_rgba(10,23,19,0.025),0_0_0_7rem_rgba(10,23,19,0.02),0_0_0_12rem_rgba(10,23,19,0.015)]'>
        </div>
        <div className='container relative z-10 grid gap-12 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center'>
          <Reveal className='order-2 lg:order-1'>
            <p className='story-kicker text-[#123d32]'>{copy.helpEyebrow}</p>
            <h2 className='story-title mt-7'>{copy.helpTitle}</h2>
            <p className='story-lead mt-7 text-[#29483f]'>{copy.helpLead}</p>
            <div className='mt-10 flex flex-col gap-3 sm:flex-row'>
              <Button asChild size='lg' className='h-14 rounded-full bg-[#0a1713] px-7 font-black text-white hover:bg-[#123d32]'>
                <Link to='/zapisz'>
                  {copy.chooseClasses}<ArrowRight className='ml-2 h-5 w-5' />
                </Link>
              </Button>
              <Button asChild size='lg' variant='outline' className='h-14 rounded-full border-[#0a1713]/25 bg-white/30 px-7 font-black text-[#0a1713] hover:bg-white/70'>
                <Link to='/kontakt'>
                  {copy.ask}<MessageCircle className='ml-2 h-5 w-5' />
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={140} className='story-photo-frame order-1 min-h-[25rem] lg:order-2 lg:min-h-[38rem]'>
            <img
              src='/redesign/pricing-guidance.webp'
              srcSet='/redesign/pricing-guidance-640.webp 640w, /redesign/pricing-guidance-1024.webp 1024w, /redesign/pricing-guidance.webp 1536w'
              sizes='(min-width: 1536px) 693px, (min-width: 1280px) 630px, (min-width: 1024px) 496px, (min-width: 768px) 736px, (min-width: 640px) 608px, calc(100vw - 2rem)'
              alt={copy.helpImageAlt}
              width='1536'
              height='1024'
              loading='lazy'
              decoding='async'
              className='story-photo absolute inset-0 object-[50%_center]' />
          </Reveal>
        </div>
      </StorySection>
    </ScrollStory>
  );
}
