import type { Language } from '@/lib/i18n';

export type PageMetadata = {
  description: string,
  title: string,
};

export const pageMetadata: Record<string, Record<Language, PageMetadata>> = {
  '/': {
    pl: { title: 'Mistrzowie Logiki | Szachy i matematyka', description: 'Spokojne, regularne zajęcia z szachów i matematyki dla dzieci i młodzieży — online i stacjonarnie.' },
    en: { title: 'Mistrzowie Logiki | Chess and math', description: 'Focused, regular chess and math lessons for children and teenagers — online and in person.' },
  },
  '/szachy': {
    pl: { title: 'Zajęcia szachowe | Mistrzowie Logiki', description: 'Zajęcia szachowe dla dzieci, grup, placówek i firm — od pierwszych ruchów po świadomy trening.' },
    en: { title: 'Chess lessons | Mistrzowie Logiki', description: 'Chess lessons for children, groups, institutions and companies — from first moves to focused training.' },
  },
  '/matematyka': {
    pl: { title: 'Korepetycje z matematyki | Mistrzowie Logiki', description: 'Matematyka wyjaśniana krok po kroku: bieżący materiał, zaległości, egzamin ósmoklasisty i matura.' },
    en: { title: 'Math tutoring | Mistrzowie Logiki', description: 'Step-by-step math tutoring for current material, learning gaps, eighth-grade exams and the Matura.' },
  },
  '/cennik': {
    pl: { title: 'Cennik zajęć | Mistrzowie Logiki', description: 'Czytelny cennik zajęć z matematyki i szachów oraz informacje o dostępnych formatach spotkań.' },
    en: { title: 'Lesson pricing | Mistrzowie Logiki', description: 'Clear pricing for math and chess lessons, with details about the available formats.' },
  },
  '/kontakt': {
    pl: { title: 'Kontakt | Mistrzowie Logiki', description: 'Napisz lub zadzwoń, aby dobrać zajęcia z matematyki albo szachów do aktualnej sytuacji ucznia.' },
    en: { title: 'Contact | Mistrzowie Logiki', description: 'Write or call to find a math or chess lesson format suited to the student’s current needs.' },
  },
  '/faq': {
    pl: { title: 'Najczęstsze pytania | Mistrzowie Logiki', description: 'Odpowiedzi na pytania o zapisy, organizację, płatności oraz zajęcia z matematyki i szachów.' },
    en: { title: 'Frequently asked questions | Mistrzowie Logiki', description: 'Answers about enrolment, organisation, payments, math tutoring and chess lessons.' },
  },
  '/zapisz': {
    pl: { title: 'Zapisz ucznia | Mistrzowie Logiki', description: 'Krótki formularz zapisu na zajęcia z matematyki lub szachów.' },
    en: { title: 'Enrol a student | Mistrzowie Logiki', description: 'A short enrolment form for math or chess lessons.' },
  },
  '/politykaprywatnosci': {
    pl: { title: 'Polityka prywatności | Mistrzowie Logiki', description: 'Informacje o przetwarzaniu i ochronie danych osobowych w Mistrzach Logiki.' },
    en: { title: 'Privacy policy | Mistrzowie Logiki', description: 'Information about personal data processing and protection at Mistrzowie Logiki.' },
  },
  '/cookies': {
    pl: { title: 'Cookies | Mistrzowie Logiki', description: 'Informacje o plikach cookies wykorzystywanych przez stronę Mistrzowie Logiki.' },
    en: { title: 'Cookies | Mistrzowie Logiki', description: 'Information about cookies used by the Mistrzowie Logiki website.' },
  },
};

export const notFoundMetadata: Record<Language, PageMetadata> = {
  pl: { title: 'Nie znaleziono strony | Mistrzowie Logiki', description: 'Podany adres nie prowadzi do istniejącej strony.' },
  en: { title: 'Page not found | Mistrzowie Logiki', description: 'The requested address does not point to an existing page.' },
};
