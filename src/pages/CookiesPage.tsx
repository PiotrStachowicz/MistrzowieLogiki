import LegalDocumentPage, { type LegalSection } from '@/components/layout/LegalDocumentPage';
import type { Language } from '@/lib/i18n';

type CookiesPageProps = {
  email: string,
  language: Language,
};

const cookiesCopy = {
  pl: {
    eyebrow: 'Przechowywanie w przeglądarce',
    title: 'Polityka cookies',
    intro: 'Wyjaśniamy, z jakich mechanizmów przechowywania danych korzysta strona Mistrzów Logiki i jak możesz nimi zarządzać.',
    lastUpdatedLabel: 'Ostatnia aktualizacja',
    lastUpdated: '13 lipca 2026 r.',
    contactLabel: 'Masz pytanie dotyczące cookies?',
    sections: [
      {
        title: 'Czym są cookies',
        paragraphs: [
          'Cookies to niewielkie pliki tekstowe zapisywane na urządzeniu podczas korzystania ze stron internetowych. Podobną funkcję może pełnić pamięć lokalna przeglądarki (localStorage), która pozwala zapamiętać wybrane ustawienia strony.',
        ],
      },
      {
        title: 'Jakich mechanizmów używa ta strona',
        paragraphs: [
          'Strona nie zapisuje obecnie preferencji użytkownika w pamięci lokalnej. Wybrany język jest zapisany bezpośrednio w adresie strony, dzięki czemu można udostępnić właściwą wersję językową.',
          'Obecnie strona nie używa cookies reklamowych ani narzędzi analitycznych służących do śledzenia użytkowników.',
        ],
      },
      {
        title: 'Dane związane z formularzem',
        paragraphs: [
          'Po wysłaniu formularza zgłoszeniowego dane są przekazywane do usługi obsługującej wysyłkę wiadomości e-mail. Informacje te służą wyłącznie do przyjęcia zgłoszenia, wysłania potwierdzenia i dalszego kontaktu w sprawie zajęć. Szczegóły opisuje Polityka prywatności.',
        ],
      },
      {
        title: 'Jak zarządzać zapisanymi danymi',
        items: [
          'możesz usunąć cookies i dane witryny w ustawieniach swojej przeglądarki,',
          'możesz zablokować zapisywanie danych przez strony internetowe,',
          'możesz korzystać z trybu prywatnego przeglądarki.',
        ],
        paragraphs: [
          'Usunięcie danych witryny nie zablokuje korzystania ze strony. Polska i angielska wersja pozostają dostępne pod osobnymi adresami.',
        ],
      },
      {
        title: 'Zmiany polityki',
        paragraphs: [
          'Polityka może być aktualizowana, gdy zmieni się sposób działania strony lub zakres używanych technologii. Data najnowszej wersji jest podana na górze strony.',
        ],
      },
    ] satisfies LegalSection[],
  },
  en: {
    eyebrow: 'Browser storage',
    title: 'Cookie policy',
    intro: 'This page explains which storage mechanisms the Mistrzowie Logiki website uses and how you can manage them.',
    lastUpdatedLabel: 'Last updated',
    lastUpdated: '13 July 2026',
    contactLabel: 'Do you have a question about cookies?',
    sections: [
      {
        title: 'What cookies are',
        paragraphs: [
          'Cookies are small text files saved on your device when you use websites. Browser local storage (localStorage) can serve a similar purpose by remembering selected website settings.',
        ],
      },
      {
        title: 'Mechanisms used by this website',
        paragraphs: [
          'The website does not currently save user preferences in browser local storage. The selected language is encoded directly in the page address, so the correct language version can be shared.',
          'The website currently does not use advertising cookies or analytics tools that track users.',
        ],
      },
      {
        title: 'Form-related data',
        paragraphs: [
          'When you submit the enrolment form, its data is sent to the service used to deliver email messages. It is used only to receive your enrolment, send confirmation and contact you about classes. See the Privacy policy for details.',
        ],
      },
      {
        title: 'Managing stored data',
        items: [
          'delete cookies and site data in your browser settings,',
          'block websites from saving data,',
          'use your browser’s private mode.',
        ],
        paragraphs: [
          'Removing site data does not prevent you from using the website. The Polish and English versions remain available at separate addresses.',
        ],
      },
      {
        title: 'Policy changes',
        paragraphs: [
          'This policy may be updated when the website or the technologies it uses change. The date of the latest version appears at the top of the page.',
        ],
      },
    ] satisfies LegalSection[],
  },
} satisfies Record<Language, {
  contactLabel: string,
  eyebrow: string,
  intro: string,
  lastUpdated: string,
  lastUpdatedLabel: string,
  sections: LegalSection[],
  title: string,
}>;

export default function CookiesPage({ email, language }: CookiesPageProps) {
  const copy = cookiesCopy[language];

  return <LegalDocumentPage {...copy} email={email} />;
}
