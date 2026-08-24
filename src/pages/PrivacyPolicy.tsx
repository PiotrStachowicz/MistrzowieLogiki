import LegalDocumentPage, { type LegalSection } from '@/components/layout/LegalDocumentPage';
import type { Language } from '@/lib/i18n';

type PrivacyPolicyProps = {
  email: string,
  language: Language,
};

const privacyCopy = {
  pl: {
    eyebrow: 'Ochrona danych',
    title: 'Polityka prywatności',
    intro: 'Dowiedz się, jakie dane osobowe przetwarzamy, w jakim celu i jakie prawa przysługują Ci w związku z ich przetwarzaniem.',
    lastUpdatedLabel: 'Ostatnia aktualizacja',
    lastUpdated: '13 lipca 2026 r.',
    contactLabel: 'Masz pytanie dotyczące swoich danych?',
    sections: [
      {
        title: 'Administrator danych',
        paragraphs: [
          'Administratorem danych osobowych jest Wojciech Szmidt, prowadzący Mistrzów Logiki, z siedzibą przy ul. Zapłocie 23, 43-250 Pawłowice. W sprawach związanych z ochroną danych możesz skontaktować się z nami pod adresem e-mail wskazanym poniżej.',
        ],
      },
      {
        title: 'Jakie dane zbieramy',
        items: [
          'dane uczestnika zajęć: imię, nazwisko i data urodzenia,',
          'dane rodzica lub opiekuna, gdy uczestnik jest niepełnoletni,',
          'dane kontaktowe: adres e-mail i numer telefonu,',
          'informacje o wybranych zajęciach i lokalizacji,',
          'treść korespondencji oraz informacje przekazane podczas kontaktu z nami.',
        ],
      },
      {
        title: 'Cele i podstawy przetwarzania',
        items: [
          'obsługa zgłoszenia i realizacja zajęć — art. 6 ust. 1 lit. b RODO,',
          'realizacja obowiązków prawnych, w tym księgowych — art. 6 ust. 1 lit. c RODO,',
          'kontakt, bezpieczeństwo oraz ustalenie lub obrona roszczeń — art. 6 ust. 1 lit. f RODO,',
          'działania objęte dobrowolną zgodą, jeśli zostanie udzielona — art. 6 ust. 1 lit. a RODO.',
        ],
      },
      {
        title: 'Odbiorcy danych',
        paragraphs: [
          'Dane mogą być powierzane dostawcom usług niezbędnych do działania strony i obsługi zgłoszeń, w szczególności dostawcom hostingu, poczty elektronicznej i narzędzia do wysyłania formularzy. Podmioty te przetwarzają dane wyłącznie w zakresie potrzebnym do świadczenia usług na naszą rzecz.',
        ],
      },
      {
        title: 'Okres przechowywania',
        paragraphs: [
          'Dane przechowujemy przez czas potrzebny do obsługi zgłoszenia i realizacji zajęć, a następnie przez okres wynikający z przepisów prawa lub potrzebny do ustalenia, dochodzenia bądź obrony roszczeń. Dane przetwarzane na podstawie zgody przechowujemy do jej wycofania lub ustania celu przetwarzania, nie dłużej jednak niż 5 lat, o ile przepisy nie wymagają dłuższego okresu.',
        ],
      },
      {
        title: 'Twoje prawa',
        items: [
          'dostęp do danych i otrzymanie ich kopii,',
          'sprostowanie, usunięcie lub ograniczenie przetwarzania,',
          'przeniesienie danych, jeśli ma zastosowanie,',
          'sprzeciw wobec przetwarzania opartego na prawnie uzasadnionym interesie,',
          'wycofanie zgody w dowolnym momencie, bez wpływu na wcześniejsze przetwarzanie,',
          'wniesienie skargi do Prezesa Urzędu Ochrony Danych Osobowych.',
        ],
      },
      {
        title: 'Dobrowolność podania danych',
        paragraphs: [
          'Podanie danych jest dobrowolne, ale dane oznaczone jako wymagane są niezbędne do obsługi zgłoszenia i organizacji zajęć. Dane nie są wykorzystywane do podejmowania zautomatyzowanych decyzji ani profilowania.',
        ],
      },
    ] satisfies LegalSection[],
  },
  en: {
    eyebrow: 'Data protection',
    title: 'Privacy policy',
    intro: 'Learn what personal data we process, why we process it and what rights you have in connection with that processing.',
    lastUpdatedLabel: 'Last updated',
    lastUpdated: '13 July 2026',
    contactLabel: 'Do you have a question about your data?',
    sections: [
      {
        title: 'Data controller',
        paragraphs: [
          'The personal data controller is Wojciech Szmidt, operating Mistrzowie Logiki, based at ul. Zapłocie 23, 43-250 Pawłowice, Poland. For data protection matters, contact us using the email address below.',
        ],
      },
      {
        title: 'Data we collect',
        items: [
          'class participant’s first name, surname and date of birth,',
          'parent or guardian details when the participant is a minor,',
          'contact details: email address and telephone number,',
          'selected class and location information,',
          'correspondence and information provided when contacting us.',
        ],
      },
      {
        title: 'Purposes and legal grounds',
        items: [
          'handling enrolment and delivering classes — Article 6(1)(b) GDPR,',
          'meeting legal obligations, including accounting duties — Article 6(1)(c) GDPR,',
          'contact, security and establishing or defending claims — Article 6(1)(f) GDPR,',
          'activities covered by voluntary consent, where given — Article 6(1)(a) GDPR.',
        ],
      },
      {
        title: 'Recipients of data',
        paragraphs: [
          'Data may be entrusted to service providers necessary to operate the website and handle enrolments, particularly hosting, email and form delivery providers. They process data only to the extent needed to provide services to us.',
        ],
      },
      {
        title: 'Retention period',
        paragraphs: [
          'We retain data while handling an enrolment and delivering classes, and then for periods required by law or necessary to establish, pursue or defend claims. Consent-based data is retained until consent is withdrawn or the purpose ends, for no longer than five years unless the law requires a longer period.',
        ],
      },
      {
        title: 'Your rights',
        items: [
          'access your data and receive a copy,',
          'rectify, erase or restrict processing,',
          'transfer data where applicable,',
          'object to processing based on legitimate interests,',
          'withdraw consent at any time without affecting earlier processing,',
          'lodge a complaint with the Polish Personal Data Protection Office.',
        ],
      },
      {
        title: 'Providing data',
        paragraphs: [
          'Providing data is voluntary, but required fields are necessary to handle enrolment and organise classes. Data is not used for automated decision-making or profiling.',
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

export default function PrivacyPolicy({ email, language }: PrivacyPolicyProps) {
  const copy = privacyCopy[language];

  return <LegalDocumentPage {...copy} email={email} />;
}
