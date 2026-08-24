import type { Language } from '@/lib/i18n';
import type { OfferPlan, RegistrationOptions, RegistrationSelectOption } from '@/types/site-content';

const directEnrolmentPlanIds = new Set([
  'preschool',
  'primary-school',
  'individual-chess',
  'group-chess',
  'math-tutoring-regular',
  'math-tutoring-irregular',
  'math-group',
  'egzamin-osmoklasisty',
  'matura',
]);

const locationsByLanguage: Record<Language, RegistrationSelectOption[]> = {
  pl: [
    { id: 'warsaw', label: 'Warszawa' },
    { id: 'krakow', label: 'Kraków' },
    { id: 'poznan', label: 'Poznań' },
    { id: 'wroclaw', label: 'Wrocław' },
    { id: 'gdansk', label: 'Gdańsk' },
    { id: 'lodz', label: 'Łódź' },
    { id: 'online', label: 'Online' },
  ],
  en: [
    { id: 'warsaw', label: 'Warsaw' },
    { id: 'krakow', label: 'Krakow' },
    { id: 'poznan', label: 'Poznan' },
    { id: 'wroclaw', label: 'Wroclaw' },
    { id: 'gdansk', label: 'Gdansk' },
    { id: 'lodz', label: 'Lodz' },
    { id: 'online', label: 'Online' },
  ],
};

const offerPlanTranslations: Record<Language, Record<string, Pick<OfferPlan, 'features' | 'title'>>> = {
  pl: {
    preschool: {
      title: 'Zajęcia szachowe – Przedszkola',
      features: [
        'Dla dzieci w wieku 3–6 lat',
        '1x w tygodniu, 30 min | Grupa 8–12 osób',
        '80 zł / miesiąc',
      ],
    },
    'primary-school': {
      title: 'Zajęcia szachowe – Szkoły podstawowe',
      features: [
        'Dla dzieci w wieku 6–14 lat',
        '1x w tygodniu, 45 min | Grupa 8–12 osób',
        '120 zł / miesiąc',
      ],
    },
    'individual-chess': {
      title: 'Szachy – Zajęcia indywidualne',
      features: [
        'Program dopasowany do ucznia',
        '60 min | 1 osoba',
        'od 70 zł / zajęcia (w zależności od poziomu i częstotliwości)',
      ],
    },
    'group-chess': {
      title: 'Szachy – Zajęcia grupowe',
      features: [
        'Kameralne zajęcia w przyjaznej atmosferze',
        '1x w tygodniu, 60 min | Grupa 2–4 osoby',
        'od 100 zł / miesiąc',
      ],
    },
    institutions: {
      title: 'Szachy – Współpraca z placówkami',
      features: [
        'Zajęcia lub warsztaty w szkołach, przedszkolach, domach kultury',
        'Harmonogram ustalany indywidualnie',
        'Cena ustalana w ramach współpracy',
      ],
    },
    companies: {
      title: 'Szachy – Zajęcia dla firm',
      features: [
        'Warsztaty, turnieje, integracje z elementem strategii',
        'Czas trwania i zakres dopasowany do firmy',
        'Oferta wyceniana indywidualnie',
      ],
    },
    'math-tutoring-regular': {
      title: 'Matematyka – Korepetycje indywidualne (cykliczne)',
      features: [
        'Dla uczniów szkół podstawowych i średnich',
        '60 min | 1 osoba',
        'Szkoła podstawowa (do 6 klasy) – 70 zł / 60 min',
        'Szkoła podstawowa (7 i 8 klasa) – 80 zł / 60 min',
        'Szkoła średnia – poziom podstawowy – 100 zł / 60 min',
        'Szkoła średnia – poziom rozszerzony – 120 zł / 60 min',
      ],
    },
    'math-tutoring-irregular': {
      title: 'Matematyka – Korepetycje indywidualne (nieregularne)',
      features: [
        'Dla uczniów szkół podstawowych i średnich',
        '60 min | 1 osoba',
        'Elastyczny termin, szybka pomoc przed sprawdzianem',
        'Szkoła podstawowa – 100 zł / 60 min',
        'Szkoła średnia – poziom podstawowy – 120 zł / 60 min',
        'Szkoła średnia – poziom rozszerzony – 140 zł / 60 min',
      ],
    },
    'math-group': {
      title: 'Matematyka – Zajęcia w małych grupach',
      features: [
        'Grupy 2–4 osoby, przyjazna nauka bez stresu',
        '60 min | Grupa 2–4 osoby',
        'od 100 zł / miesiąc',
      ],
    },
    'egzamin-osmoklasisty': {
      title: 'Egzamin ósmoklasisty – Kurs grupowy',
      features: [
        'Przygotowanie do egzaminu w kameralnych grupach',
        '60 min / 1x w tygodniu | Grupa do 6 osób',
        '160 zł / miesiąc',
      ],
    },
    matura: {
      title: 'Matura – poziom podstawowy – kurs grupowy',
      features: [
        'Powtórki, arkusze, strategie, spokojne tempo',
        '60 min / 1x w tygodniu | Grupa do 6 osób',
        '200 zł / miesiąc',
      ],
    },
  },
  en: {
    preschool: {
      title: 'Chess classes – Preschools',
      features: [
        'For children aged 3–6',
        'Once a week, 30 min | Group of 8–12 children',
        'PLN 80 / month',
      ],
    },
    'primary-school': {
      title: 'Chess classes – Primary schools',
      features: [
        'For children aged 6–14',
        'Once a week, 45 min | Group of 8–12 children',
        'PLN 120 / month',
      ],
    },
    'individual-chess': {
      title: 'Chess – Individual classes',
      features: [
        'Programme matched to the student',
        '60 min | 1 student',
        'from PLN 70 / lesson (depending on level and frequency)',
      ],
    },
    'group-chess': {
      title: 'Chess – Group classes',
      features: [
        'Small classes in a friendly atmosphere',
        'Once a week, 60 min | Group of 2–4 students',
        'from PLN 100 / month',
      ],
    },
    institutions: {
      title: 'Chess – Cooperation with institutions',
      features: [
        'Classes or workshops in schools, preschools and community centres',
        'Schedule agreed individually',
        'Custom quote',
      ],
    },
    companies: {
      title: 'Chess – Classes for companies',
      features: [
        'Workshops, tournaments and strategy-based team events',
        'Duration and scope matched to the company',
        'Custom quote',
      ],
    },
    'math-tutoring-regular': {
      title: 'Math – Individual tutoring (regular)',
      features: [
        'For primary and secondary school students',
        '60 min | 1 student',
        'Primary school (up to grade 6) – PLN 70 / 60 min',
        'Primary school (grades 7–8) – PLN 80 / 60 min',
        'Secondary school – standard level – PLN 100 / 60 min',
        'Secondary school – advanced level – PLN 120 / 60 min',
      ],
    },
    'math-tutoring-irregular': {
      title: 'Math – Individual tutoring (occasional)',
      features: [
        'For primary and secondary school students',
        '60 min | 1 student',
        'Flexible scheduling, quick help before a test',
        'Primary school – PLN 100 / 60 min',
        'Secondary school – standard level – PLN 120 / 60 min',
        'Secondary school – advanced level – PLN 140 / 60 min',
      ],
    },
    'math-group': {
      title: 'Math – Small group classes',
      features: [
        'Groups of 2–4 students, friendly learning without stress',
        '60 min | Group of 2–4 students',
        'from PLN 100 / month',
      ],
    },
    'egzamin-osmoklasisty': {
      title: 'Eighth-grade exam – Group course',
      features: [
        'Exam preparation in small groups',
        '60 min / once a week | Group of up to 6 students',
        'PLN 160 / month',
      ],
    },
    matura: {
      title: 'Standard-level Matura – group course',
      features: [
        'Reviews, exam papers, strategies and a calm pace',
        '60 min / once a week | Group of up to 6 students',
        'PLN 200 / month',
      ],
    },
  },
};

export function localizeOfferPlans(offerPlans: OfferPlan[], language: Language): OfferPlan[] {
  return offerPlans.map((plan) => ({
    ...plan,
    ...(offerPlanTranslations[language][plan.id] ?? {}),
  }));
}

export function getFallbackOfferPlans(): OfferPlan[] {
  return Object.entries(offerPlanTranslations.pl).map(([id, translation]) => ({
    id,
    icon: 'Brain',
    ...translation,
  }));
}

export function getRegistrationOptions(offerPlans: OfferPlan[], language: Language): RegistrationOptions {
  const localizedOfferPlans = localizeOfferPlans(offerPlans, language);

  return {
    locations: locationsByLanguage[language],
    classTypes: localizedOfferPlans
      .filter((plan) => directEnrolmentPlanIds.has(plan.id))
      .map((plan) => ({ id: plan.id, label: plan.title }))
      .filter((option) => Boolean(option.label)),
  };
}
