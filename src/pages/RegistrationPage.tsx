import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/immersive/ScrollStory';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Language } from '@/lib/i18n';
import {
  describeRegistrationEmailError,
  type RegistrationEmailPayload,
  sendRegistrationEmails,
} from '@/lib/registration-email';
import {
  ArrowRight,
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { ChangeEvent, FormEvent, MouseEvent, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from '@/components/navigation/LocalizedLink';
import { useSearchParams } from 'react-router-dom';
import { getRegistrationOptions } from '@/lib/offer-localization';
import type { OfferPlan } from '@/types/site-content';

type RegistrationPageProps = {
  language: Language,
  offerPlans: OfferPlan[],
};

type RegistrationFormState = RegistrationEmailPayload;

type TextFieldName = Extract<
  keyof RegistrationFormState,
  | 'participantFirstName'
  | 'participantLastName'
  | 'birthDate'
  | 'guardianFirstName'
  | 'guardianLastName'
  | 'email'
  | 'phone'
  | 'notes'
>;

type SelectFieldName = Extract<keyof RegistrationFormState, 'location' | 'classType'>;
type CheckboxFieldName = Extract<keyof RegistrationFormState, `accepted${string}`>;

type ConsentOption = {
  field: CheckboxFieldName,
  validationLabel: string,
  label: ReactNode,
  required?: boolean,
};

type ValidationIssue = {
  fieldId: string,
  message: string,
};

const initialRegistrationFormState: RegistrationFormState = {
  location: '',
  classType: '',
  participantFirstName: '',
  participantLastName: '',
  birthDate: '',
  guardianFirstName: '',
  guardianLastName: '',
  email: '',
  phone: '',
  notes: '',
  acceptedTerms: false,
  acceptedPayments: false,
  acceptedPersonalDataProcessing: false,
  acceptedMinorProtectionStandards: false,
  acceptedHealthStatement: false,
  acceptedMarketingUse: false,
};

const registrationCopy = {
  pl: {
    heroEyebrow: 'Zapis na zajęcia',
    heroTitle: 'Krótki formularz, potem potwierdzenie szczegółów',
    heroLead: 'Wybierz zajęcia, podaj dane uczestnika i zostaw kontakt. Sprawdzimy dostępność i zaproponujemy termin.',
    heroPrimary: 'Przejdź do formularza',
    contact: 'Kontakt',
    formEyebrow: 'Formularz',
    formTitle: 'Zacznijmy od podstawowych informacji',
    requiredFields: '* pola wymagane',
    sections: {
      classes: {
        title: 'Zajęcia',
        description: 'Wybierz miejsce oraz typ kursu.',
      },
      participant: {
        title: 'Dane uczestnika',
        description: 'Dane osoby, która będzie brała udział w zajęciach.',
      },
      guardian: {
        title: 'Rodzic lub opiekun',
        description: 'Wymagane przy zapisie osoby niepełnoletniej.',
      },
      contact: {
        title: 'Kontakt',
        description: 'Dane do potwierdzenia zgłoszenia.',
      },
      consents: {
        title: 'Zgody i regulaminy',
        titleWithoutDocuments: 'Zgody i oświadczenia',
        description: 'Zgody wymagane do obsługi zgłoszenia i udziału w zajęciach.',
      },
    },
    fields: {
      location: 'Lokalizacja *',
      classType: 'Rodzaj zajęć *',
      participantFirstName: 'Imię uczestnika *',
      participantLastName: 'Nazwisko uczestnika *',
      birthDate: 'Data urodzenia *',
      guardianFirstName: 'Imię rodzica/opiekuna *',
      guardianLastName: 'Nazwisko rodzica/opiekuna *',
      email: 'Email *',
      phone: 'Numer telefonu *',
      notes: 'Cel lub dodatkowe informacje (opcjonalnie)',
      guardianRequired: 'Dane opiekuna wymagane',
    },
    placeholders: {
      location: 'Wybierz lokalizację',
      classType: 'Wybierz zajęcia',
      notes: 'Np. przygotowanie do egzaminu, bieżący dział albo wcześniejsze doświadczenie z szachami',
    },
    locationAvailability: 'Zajęcia online są dostępne niezależnie od miasta. Dostępność zajęć stacjonarnych potwierdzimy po zgłoszeniu.',
    phoneTitle: 'Podaj 7–15 cyfr; możesz użyć prefiksu kraju, spacji i myślników',
    adminInfoTitle: 'Informacja od Administratora danych',
    adminInfo: [
      'Administratorem danych osobowych jest Wojciech Szmidt z siedzibą w Pawłowicach (43-250), ul. Zapłocie 23. Dane przetwarzane są na podstawie art. 6 ust. 1 lit. b RODO w celu obsługi i realizacji usług świadczonych przez Organizatora.',
      'Dane mogą być powierzane dostawcom hostingu, poczty elektronicznej i narzędzia do wysyłania formularzy wyłącznie w zakresie potrzebnym do obsługi zgłoszenia. Nie przekazujemy danych do państw trzecich ani organizacji międzynarodowych. Dane będą przechowywane przez czas niezbędny do realizacji celu, maksymalnie przez 5 lat.',
      'Osobie, której dane dotyczą, przysługuje prawo do: dostępu do danych, ich poprawiania, sprostowania, usunięcia, ograniczenia przetwarzania, przeniesienia oraz wniesienia skargi do organu nadzorczego. Dane nie będą podlegać zautomatyzowanemu przetwarzaniu ani profilowaniu.',
      'Podanie danych jest dobrowolne, ale niezbędne do realizacji wskazanego celu.',
    ],
    submitNote: 'Po wysłaniu sprawdzimy dane i skontaktujemy się w sprawie dostępnego terminu.',
    submit: 'Wyślij zgłoszenie',
    submitting: 'Wysyłanie...',
    successTitle: 'Zgłoszenie jest już u nas',
    successLead: 'Skontaktujemy się mailowo lub telefonicznie, żeby potwierdzić dostępność i szczegóły zajęć.',
    confirmationWarning: 'Zgłoszenie zostało wysłane, ale wiadomość potwierdzająca może nie dotrzeć. Nie wysyłaj formularza ponownie — skontaktujemy się z Tobą.',
    fillAgain: 'Wypełnij ponownie',
    unsureTitle: 'Nie wiesz, co wybrać?',
    unsureLead: 'Wybierz najbliższą opcję w formularzu albo napisz do nas przed wysłaniem.',
    afterTitle: 'Po zgłoszeniu',
    afterItems: [
      'potwierdzamy termin i formę zajęć',
      'doprecyzowujemy poziom ucznia',
      'wysyłamy dalsze informacje organizacyjne',
    ],
    validation: {
      required: (label: string) => `Proszę wypełnić pole: ${label}.`,
      phone: 'Podaj prawidłowy numer zawierający od 7 do 15 cyfr.',
      email: 'Podaj prawidłowy adres e-mail.',
      birthDate: 'Podaj prawidłową datę urodzenia, nie późniejszą niż dzisiaj.',
      consent: (label: string) => `Proszę zaakceptować ${label}.`,
      sendError: 'Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie za chwilę lub skontaktuj się z nami mailowo.',
      consoleError: 'Błąd podczas wysyłania e-maila:',
    },
    validationLabels: {
      location: 'lokalizacja',
      classType: 'rodzaj zajęć',
      participantFirstName: 'imię uczestnika',
      participantLastName: 'nazwisko uczestnika',
      birthDate: 'data urodzenia',
      guardianFirstName: 'imię rodzica/opiekuna',
      guardianLastName: 'nazwisko rodzica/opiekuna',
      email: 'email',
      phone: 'numer telefonu',
    },
    consents: {
      terms: 'regulamin',
      termsBefore: 'Zapoznałem/am się i akceptuję',
      termsLink: 'regulamin zajęć',
      termsAfter: '(regulamin dostępny w zakładce dokumenty) *',
      payments: 'Zapoznałem/am się i akceptuję treść regulaminu opłaty składek (regulamin dostępny w zakładce dokumenty) *',
      paymentsWithoutDocuments: 'Zapoznałem/am się i akceptuję treść regulaminu opłaty składek *',
      paymentsValidation: 'regulamin opłat',
      personalDataBefore: 'Zapoznałem/am się z',
      personalDataLink: 'polityką prywatności',
      personalDataAfter: 'i informacją o przetwarzaniu danych osobowych. *',
      personalDataValidation: 'potwierdzenie zapoznania się z informacją o przetwarzaniu danych',
      minorProtection: 'Zapoznałem/am się i akceptuję Standardy Ochrony Małoletnich *',
      minorProtectionValidation: 'zgodę na udział dziecka w zajęciach',
      health: 'Oświadczam, że nie są mi znane przeciwwskazania zdrowotne do udziału uczestnika w zajęciach. *',
      healthValidation: 'oświadczenie o stanie zdrowia',
      marketing: 'Wyrażam zgodę na wykorzystywanie wizerunku uczestnika w komunikacji marketingowej / na stronie klubowej (opcjonalnie).',
      marketingValidation: 'zgodę marketingową',
      regulationsReviewNote: 'Regulamin zajęć, zasady płatności oraz Standardy Ochrony Małoletnich przekażemy do zapoznania się przed potwierdzeniem zapisu. Ich akceptacja nie jest wymagana na tym etapie.',
    },
    imageAlt: 'Rodzic i uczennica przygotowują dane do zapisu na zajęcia',
  },
  en: {
    heroEyebrow: 'Class enrolment',
    heroTitle: 'A short form, then we confirm the details',
    heroLead: 'Choose a class, enter the participant’s details and leave your contact information. We will check availability and suggest a date and time.',
    heroPrimary: 'Go to the form',
    contact: 'Contact',
    formEyebrow: 'Form',
    formTitle: 'Let’s start with the essential details',
    requiredFields: '* required fields',
    sections: {
      classes: {
        title: 'Classes',
        description: 'Choose the location and class type.',
      },
      participant: {
        title: 'Participant details',
        description: 'Details of the person who will attend the classes.',
      },
      guardian: {
        title: 'Parent or guardian',
        description: 'Required when enrolling a minor.',
      },
      contact: {
        title: 'Contact',
        description: 'Details used to confirm the enrolment.',
      },
      consents: {
        title: 'Consents and rules',
        titleWithoutDocuments: 'Consents and declarations',
        description: 'Consents required to process the enrolment and participation.',
      },
    },
    fields: {
      location: 'Location *',
      classType: 'Class type *',
      participantFirstName: 'Participant first name *',
      participantLastName: 'Participant last name *',
      birthDate: 'Date of birth *',
      guardianFirstName: 'Parent/guardian first name *',
      guardianLastName: 'Parent/guardian last name *',
      email: 'Email *',
      phone: 'Phone number *',
      notes: 'Goal or additional information (optional)',
      guardianRequired: 'Guardian details required',
    },
    placeholders: {
      location: 'Choose location',
      classType: 'Choose classes',
      notes: 'E.g. exam preparation, a current topic or previous chess experience',
    },
    locationAvailability: 'Online lessons are available regardless of city. We will confirm local in-person availability after you submit the form.',
    phoneTitle: 'Enter 7–15 digits; country prefix, spaces and dashes are accepted',
    adminInfoTitle: 'Data controller information',
    adminInfo: [
      'The personal data controller is Wojciech Szmidt, based in Pawłowice (43-250), ul. Zapłocie 23. Data is processed under Article 6(1)(b) GDPR to handle and deliver services provided by the Organiser.',
      'Data may be entrusted to hosting, email and form delivery providers only to the extent needed to handle the enrolment. We do not transfer data to third countries or international organisations. Data will be stored for the time necessary to achieve the purpose, up to 5 years.',
      'The data subject has the right to access, correct, rectify, delete, restrict processing, transfer data and lodge a complaint with the supervisory authority. Data will not be subject to automated processing or profiling.',
      'Providing data is voluntary but necessary for the stated purpose.',
    ],
    submitNote: 'After submission, we will review the details and contact you about an available time.',
    submit: 'Send enrolment',
    submitting: 'Sending...',
    successTitle: 'We have received your enrolment',
    successLead: 'We will contact you by email or phone to confirm availability and the class details.',
    confirmationWarning: 'Your enrolment was sent, but the confirmation email may not arrive. Please do not submit the form again — we will contact you.',
    fillAgain: 'Fill again',
    unsureTitle: 'Not sure what to choose?',
    unsureLead: 'Choose the closest option in the form or contact us before sending it.',
    afterTitle: 'After submission',
    afterItems: [
      'we confirm the date and class format',
      'we clarify the student’s level',
      'we send further organisational details',
    ],
    validation: {
      required: (label: string) => `Please fill in: ${label}.`,
      phone: 'Enter a valid phone number containing 7 to 15 digits.',
      email: 'Enter a valid email address.',
      birthDate: 'Enter a valid date of birth that is not later than today.',
      consent: (label: string) => `Please accept ${label}.`,
      sendError: 'There was an error sending the form. Try again in a moment or contact us by email.',
      consoleError: 'Error while sending email:',
    },
    validationLabels: {
      location: 'location',
      classType: 'class type',
      participantFirstName: 'participant first name',
      participantLastName: 'participant last name',
      birthDate: 'date of birth',
      guardianFirstName: 'parent/guardian first name',
      guardianLastName: 'parent/guardian last name',
      email: 'email',
      phone: 'phone number',
    },
    consents: {
      terms: 'class rules',
      termsBefore: 'I have read and accept the',
      termsLink: 'class rules',
      termsAfter: '(available in the Documents section) *',
      payments: 'I have read and accept the payment rules (available in the Documents section) *',
      paymentsWithoutDocuments: 'I have read and accept the payment rules *',
      paymentsValidation: 'payment rules',
      personalDataBefore: 'I have read the',
      personalDataLink: 'Privacy Policy',
      personalDataAfter: 'and the information about how my personal data is processed. *',
      personalDataValidation: 'confirmation that you have read the data processing information',
      minorProtection: 'I have read and accept the Minor Protection Standards *',
      minorProtectionValidation: 'minor participation consent',
      health: 'I am not aware of any health condition that would prevent the participant from taking part in classes. *',
      healthValidation: 'health statement',
      marketing: 'I consent to the use of the participant’s image in marketing communication / on the club website (optional).',
      marketingValidation: 'marketing consent',
      regulationsReviewNote: 'We will provide the class rules, payment rules and Minor Protection Standards for review before confirming the enrolment. You do not need to accept them at this stage.',
    },
    imageAlt: 'A parent and student prepare the details needed for enrolment',
  },
};

const inputClassName =
  'h-12 w-full rounded-xl !border-[#123d32]/20 !bg-[#fff] !text-[#0a1713] shadow-sm [color-scheme:light] transition-[border-color,box-shadow] focus:!border-[#187b5d] focus:ring-2 focus:ring-[#187b5d]/25';
const formSectionClassName = 'rounded-[1.5rem] border border-[#123d32]/10 bg-white/80 p-5 shadow-[0_14px_35px_rgba(18,61,50,0.055)] sm:p-6';
const fieldClassName = 'space-y-2';

type RegistrationCopy = (typeof registrationCopy)[Language];

function getConsentOptions(copy: RegistrationCopy): ConsentOption[] {
  return [
    {
      field: 'acceptedPersonalDataProcessing',
      validationLabel: copy.consents.personalDataValidation,
      label: (
        <>
          {copy.consents.personalDataBefore}{' '}
          <NavLink
            to='/politykaprywatnosci'
            className='font-bold text-[#126044] underline underline-offset-2'
            target='_blank'
            rel='noopener noreferrer'>
            {copy.consents.personalDataLink}
          </NavLink>{' '}
          {copy.consents.personalDataAfter}
        </>
      ),
    },
    {
      field: 'acceptedHealthStatement',
      validationLabel: copy.consents.healthValidation,
      label: copy.consents.health,
    },
    {
      field: 'acceptedMarketingUse',
      validationLabel: copy.consents.marketingValidation,
      label: copy.consents.marketing,
      required: false,
    },
  ];
}

function validateRegistrationForm(
  formState: RegistrationFormState,
  guardianInfoRequired: boolean,
  consentOptions: ConsentOption[],
  copy: RegistrationCopy,
): ValidationIssue | null {
  const requiredTextFields: Array<{ field: TextFieldName | SelectFieldName, label: string }> = [
    { field: 'location', label: copy.validationLabels.location },
    { field: 'classType', label: copy.validationLabels.classType },
    { field: 'participantFirstName', label: copy.validationLabels.participantFirstName },
    { field: 'participantLastName', label: copy.validationLabels.participantLastName },
    { field: 'birthDate', label: copy.validationLabels.birthDate },
    { field: 'email', label: copy.validationLabels.email },
    { field: 'phone', label: copy.validationLabels.phone },
  ];

  if (guardianInfoRequired) {
    requiredTextFields.push(
      { field: 'guardianFirstName', label: copy.validationLabels.guardianFirstName },
      { field: 'guardianLastName', label: copy.validationLabels.guardianLastName },
    );
  }

  for(const { field, label } of requiredTextFields) {
    if (!formState[field].trim()) {
      return {
        fieldId: field,
        message: copy.validation.required(label),
      };
    }
  }

  if (!/^\S+@\S+\.\S+$/.test(formState.email.trim())) {
    return {
      fieldId: 'email',
      message: copy.validation.email,
    };
  }

  const birthDate = new Date(`${formState.birthDate}T00:00:00`);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
    return {
      fieldId: 'birthDate',
      message: copy.validation.birthDate,
    };
  }

  const phone = formState.phone.trim();
  const phoneDigitCount = phone.replace(/\D/g, '').length;
  if (!/^[+\d][\d\s().-]*$/.test(phone) || phoneDigitCount < 7 || phoneDigitCount > 15) {
    return {
      fieldId: 'phone',
      message: copy.validation.phone,
    };
  }

  const missingConsent = consentOptions.find((consent) => consent.required !== false && !formState[consent.field]);

  if (missingConsent) {
    return {
      fieldId: missingConsent.field,
      message: copy.validation.consent(missingConsent.validationLabel),
    };
  }

  return null;
}

function normalizePhoneNumber(phone: string): string {
  const trimmedPhone = phone.trim();
  const digits = trimmedPhone.replace(/\D/g, '');

  return trimmedPhone.startsWith('+') ? `+${digits}` : digits;
}

function isParticipantUnder18(birthDate: string, referenceDate = new Date()) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);

  if (!match) {
    return false;
  }

  const birthYear = Number(match[1]);
  const birthMonth = Number(match[2]);
  const birthDay = Number(match[3]);
  const parsedBirthDate = new Date(birthYear, birthMonth - 1, birthDay);

  if (
    parsedBirthDate.getFullYear() !== birthYear
    || parsedBirthDate.getMonth() !== birthMonth - 1
    || parsedBirthDate.getDate() !== birthDay
  ) {
    return false;
  }

  let age = referenceDate.getFullYear() - birthYear;
  const birthdayHasNotOccurred =
    referenceDate.getMonth() + 1 < birthMonth
    || (referenceDate.getMonth() + 1 === birthMonth && referenceDate.getDate() < birthDay);

  if (birthdayHasNotOccurred) {
    age -= 1;
  }

  return age < 18;
}

function formatDateForInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function scrollToForm(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const form = document.getElementById('registration-form');

  if (!form) {
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const headerOffset = 96;
  const targetTop = window.scrollY + form.getBoundingClientRect().top - headerOffset;
  window.history.pushState(window.history.state, '', '#registration-form');
  window.scrollTo({ top: targetTop, behavior: reducedMotion ? 'auto' : 'smooth' });
  form.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
}

function FormSectionHeader({
  description,
  Icon,
  number,
  title,
}: {
  description: string,
  Icon: LucideIcon,
  number: string,
  title: string,
}) {
  return (
    <div className='mb-6 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-start'>
      <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-[#123d32] text-[#b9f3dc] shadow-[0_12px_26px_rgba(18,61,50,0.15)]'>
        <Icon className='h-5 w-5' />
      </div>
      <div>
        <p className='text-xs font-black uppercase tracking-[0.15em] text-[#126044]'>
          {number}
        </p>
        <h3 className='mt-1 text-xl font-black tracking-[-0.025em] text-[#0a1713]'>
          {title}
        </h3>
        <p className='mt-1 text-sm leading-6 text-[#52655e]'>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function RegistrationPage({ language, offerPlans }: RegistrationPageProps) {
  const copy = registrationCopy[language];
  const { classTypes, locations } = useMemo(
    () => getRegistrationOptions(offerPlans, language),
    [language, offerPlans],
  );
  const [searchParams] = useSearchParams();
  const requestedClassType = searchParams.get('classType')?.trim() ?? '';
  const selectedOfferId = searchParams.get('offer')?.trim() ?? '';
  const requestedClassTypeId = classTypes.find((option) => (
    option.id === selectedOfferId
    || option.id === requestedClassType
    || option.label === requestedClassType
  ))?.id ?? '';
  const consentOptions = getConsentOptions(copy);
  const consentSectionTitle = copy.sections.consents.titleWithoutDocuments;
  const [guardianInfoRequired, setGuardianInfoRequired] = useState(true);
  const [formState, setFormState] = useState<RegistrationFormState>(() => ({
    ...initialRegistrationFormState,
    classType: requestedClassTypeId,
  }));
  const [company, setCompany] = useState('');
  const [formIssue, setFormIssue] = useState<ValidationIssue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [confirmationWarning, setConfirmationWarning] = useState(false);
  const formErrorRef = useRef<HTMLDivElement>(null);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusFormAfterResetRef = useRef(false);

  const today = new Date();
  const todayDate = formatDateForInput(today);
  const participantIsMinor = isParticipantUnder18(formState.birthDate, today);
  const guardianDetailsRequired = guardianInfoRequired || participantIsMinor;

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (submitSuccess) {
        successHeadingRef.current?.focus();
        return;
      }

      if (shouldFocusFormAfterResetRef.current) {
        shouldFocusFormAfterResetRef.current = false;
        formHeadingRef.current?.focus();
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [submitSuccess]);

  const updateField = <FieldName extends keyof RegistrationFormState>(
    field: FieldName,
    value: RegistrationFormState[FieldName],
  ) => {
    setFormIssue(null);
    setFormState((previousState) => ({
      ...previousState,
      [field]: value,
    }));
  };

  const handleTextInputChange = (field: TextFieldName) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(field, event.target.value);
  };

  const handleBirthDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const birthDate = event.target.value;
    const nextParticipantIsMinor = isParticipantUnder18(birthDate);

    setFormIssue(null);
    setFormState((previousState) => ({
      ...previousState,
      birthDate,
      ...(!guardianInfoRequired && !nextParticipantIsMinor
        ? { guardianFirstName: '', guardianLastName: '' }
        : {}),
    }));
  };

  const handleGuardianInfoRequiredChange = (checked: boolean) => {
    const nextGuardianInfoRequired = checked;

    if (participantIsMinor && !nextGuardianInfoRequired) {
      return;
    }

    setFormIssue(null);
    setGuardianInfoRequired(nextGuardianInfoRequired);

    if (!nextGuardianInfoRequired) {
      setFormState((previousState) => ({
        ...previousState,
        guardianFirstName: '',
        guardianLastName: '',
      }));
    }
  };

  const handleSelectChange = (field: SelectFieldName, value: string) => {
    updateField(field, value);
  };

  const handleCheckboxChange = (field: CheckboxFieldName, checked: boolean) => {
    updateField(field, checked);
  };

  const focusFormIssue = (fieldId?: string) => {
    window.requestAnimationFrame(() => {
      const field = fieldId ? document.getElementById(fieldId) : null;

      if (field instanceof HTMLElement) {
        field.focus();
        return;
      }

      formErrorRef.current?.focus();
    });
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    const validationIssue = validateRegistrationForm(formState, guardianDetailsRequired, consentOptions, copy);

    if (validationIssue) {
      setFormIssue(validationIssue);
      focusFormIssue(validationIssue.fieldId);
      return;
    }

    setFormIssue(null);
    setIsSubmitting(true);
    const selectedLocation = locations.find((option) => option.id === formState.location);
    const selectedClassType = classTypes.find((option) => option.id === formState.classType);

    sendRegistrationEmails({
      payload: {
        ...formState,
        location: selectedLocation?.label ?? formState.location,
        classType: selectedClassType?.label ?? formState.classType,
        phone: normalizePhoneNumber(formState.phone),
      },
      language,
      sourcePath: `${window.location.pathname}${window.location.search}`,
      selectedOfferId: selectedOfferId || formState.classType,
      company,
    })
      .then((result) => {
        if (!result.confirmationDelivered) {
          console.warn(
            copy.validation.consoleError,
            describeRegistrationEmailError(result.confirmationError),
            result.confirmationError,
          );
        }

        setFormIssue(null);
        setConfirmationWarning(!result.confirmationDelivered);
        setSubmitSuccess(true);
        setGuardianInfoRequired(true);
        setFormState(initialRegistrationFormState);
        setCompany('');
      })
      .catch((error) => {
        console.error(copy.validation.consoleError, describeRegistrationEmailError(error), error);
        setFormIssue({ fieldId: '', message: copy.validation.sendError });
        focusFormIssue();
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (submitSuccess) {
    return (
      <div className='story-shell relative flex min-h-[calc(100svh-4rem)] items-center bg-[#071712] px-4 py-16 text-white lg:py-24'>
        <div className='story-grid-art'>
        </div>
        <div className='story-orb -left-40 -top-40 bg-[#187b5d]/45'>
        </div>
        <div className='story-ring-art -bottom-40 -right-32'>
        </div>

        <Reveal className='relative z-10 mx-auto w-full max-w-2xl'>
          <article
            role='status'
            aria-live='polite'
            className='story-glass flex flex-col items-center p-8 text-center sm:p-12'>
            <div className='mb-7 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-[#f5b942] text-[#0a1713] shadow-[0_18px_45px_rgba(245,185,66,0.25)]'>
              <CheckCircle2 className='h-10 w-10' />
            </div>
            <h1
              ref={successHeadingRef}
              tabIndex={-1}
              className='rounded-lg text-4xl font-black leading-[1.02] tracking-[-0.05em] text-white outline-none focus-visible:ring-2 focus-visible:ring-[#b9f3dc] sm:text-5xl'>
              {copy.successTitle}
            </h1>
            <p className='mt-5 max-w-xl text-base leading-8 text-white/75'>
              {copy.successLead}
            </p>
            {confirmationWarning && (
              <p className='mt-5 max-w-xl rounded-2xl border border-[#f5b942]/30 bg-[#f5b942]/15 px-4 py-3 text-sm font-bold leading-6 text-[#ffe7a1]'>
                {copy.confirmationWarning}
              </p>
            )}
            <Button
              onClick={() => {
                shouldFocusFormAfterResetRef.current = true;
                setConfirmationWarning(false);
                setSubmitSuccess(false);
              }}
              className='mt-9 h-14 rounded-full bg-[#f5b942] px-8 font-black text-[#0a1713] hover:bg-[#ffd071]'>
              {copy.fillAgain}
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </article>
        </Reveal>
      </div>
    );
  }

  return (
    <div className='story-shell bg-[#f7f1e6] text-[#0a1713]'>
      <section className='relative isolate flex min-h-[min(48rem,calc(100svh-4rem))] items-center overflow-hidden bg-[#071712] py-16 text-white lg:py-20'>
        <img
          src='/redesign/registration-hero.webp'
          srcSet='/redesign/registration-hero-640.webp 640w, /redesign/registration-hero-1024.webp 1024w, /redesign/registration-hero.webp 1536w'
          sizes='100vw'
          alt=''
          width='1536'
          height='1024'
          {...{ fetchpriority: 'high' }}
          decoding='async'
          className='absolute inset-0 h-full w-full object-cover object-[68%_center]' />
        <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,16,0.99)_0%,rgba(5,20,16,0.91)_51%,rgba(5,20,16,0.45)_82%,rgba(5,20,16,0.38)_100%)]'>
        </div>
        <div className='story-grid-art'>
        </div>
        <div className='story-ring-art -right-32 -top-28'>
        </div>

        <div className='container relative z-10 grid gap-12 px-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center'>
          <div className='max-w-4xl'>
            <Reveal>
              <p className='story-kicker text-[#b9f3dc]'>
                {copy.heroEyebrow}
              </p>
              <h1 className='mt-7 text-[clamp(3rem,6.6vw,6.4rem)] font-black leading-[0.92] tracking-[-0.06em] text-white'>
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
                <a href='#registration-form' onClick={scrollToForm}>
                  {copy.heroPrimary}
                  <ArrowRight className='ml-2 h-5 w-5' />
                </a>
              </Button>
              <Button
                asChild
                size='lg'
                variant='outline'
                className='h-14 rounded-full border-white/25 bg-white/[0.12] px-7 font-black text-white hover:bg-white hover:text-[#0a1713]'>
                <NavLink to='/kontakt'>
                  {copy.contact}
                </NavLink>
              </Button>
            </Reveal>
          </div>

          <Reveal delay={280} className='hidden lg:block'>
            <aside className='story-glass p-6' aria-label={copy.formTitle}>
              {[
                copy.sections.classes.title,
                copy.sections.participant.title,
                copy.sections.guardian.title,
                copy.sections.contact.title,
                consentSectionTitle,
              ].map((step, index) => (
                <div
                  key={step}
                  className='flex items-center gap-4 border-b border-white/[0.15] py-4 first:pt-0 last:border-b-0 last:pb-0'>
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-xs font-black text-[#f5b942]'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className='font-bold text-white/[0.88]'>
                    {step}
                  </span>
                </div>
              ))}
            </aside>
          </Reveal>
        </div>
      </section>

      <section className='relative bg-[#f7f1e6]'>
        <div className='story-orb -left-52 top-40 bg-[#d9cffb]/45'>
        </div>
        <div className='story-orb -right-64 bottom-40 bg-[#b9f3dc]/45 [animation-delay:-5s]'>
        </div>

        <div className='container relative z-10 px-4 py-14 lg:py-20'>
          <div className='grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start'>
            <form
              id='registration-form'
              noValidate
              aria-busy={isSubmitting}
              aria-describedby={formIssue ? 'registration-form-error' : undefined}
              className='story-paper min-w-0 scroll-mt-24 p-5 sm:p-8 lg:p-10'
              onSubmit={handleFormSubmit}>
              <div className='mb-9 grid gap-5 border-b border-[#123d32]/10 pb-8 sm:grid-cols-[1fr_auto] sm:items-end'>
                <div className='min-w-0'>
                  <p className='story-kicker text-[#126044]'>
                    {copy.formEyebrow}
                  </p>
                  <h2
                    ref={formHeadingRef}
                    tabIndex={-1}
                    className='mt-5 max-w-2xl rounded-lg text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#0a1713] outline-none focus-visible:ring-2 focus-visible:ring-[#187b5d] sm:text-5xl'>
                    {copy.formTitle}
                  </h2>
                </div>
                <p className='rounded-full bg-[#f5b942]/[0.22] px-4 py-2 text-sm font-black text-[#694800] sm:justify-self-end'>
                  {copy.requiredFields}
                </p>
              </div>

              {formIssue && (
                <div
                  ref={formErrorRef}
                  id='registration-form-error'
                  role='alert'
                  aria-atomic='true'
                  tabIndex={-1}
                  className='mb-6 flex items-start gap-3 rounded-2xl border border-red-700/20 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-900 outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2'>
                  <AlertCircle className='mt-0.5 h-5 w-5 shrink-0' aria-hidden='true' />
                  <span>{formIssue.message}</span>
                </div>
              )}

              <div className='space-y-5'>
                <section className={formSectionClassName}>
                  <FormSectionHeader
                    number='01'
                    title={copy.sections.classes.title}
                    description={copy.sections.classes.description}
                    Icon={BookOpen} />

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className={fieldClassName}>
                      <Label htmlFor='location' className='flex items-center gap-2 font-bold text-[#223b33]'>
                        <MapPin className='h-4 w-4 text-[#126044]' />
                        {copy.fields.location}
                      </Label>
                      <select
                        id='location'
                        name='location'
                        value={formState.location}
                        onChange={(event) => handleSelectChange('location', event.target.value)}
                        aria-describedby={formIssue?.fieldId === 'location' ? 'registration-form-error' : undefined}
                        aria-invalid={formIssue?.fieldId === 'location' || undefined}
                        className={inputClassName}
                        required>
                        <option value='' disabled>{copy.placeholders.location}</option>
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>{location.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className={fieldClassName}>
                      <Label htmlFor='classType' className='flex items-center gap-2 font-bold text-[#223b33]'>
                        <BookOpen className='h-4 w-4 text-[#126044]' />
                        {copy.fields.classType}
                      </Label>
                      <select
                        id='classType'
                        name='classType'
                        value={formState.classType}
                        onChange={(event) => handleSelectChange('classType', event.target.value)}
                        aria-describedby={formIssue?.fieldId === 'classType' ? 'registration-form-error' : undefined}
                        aria-invalid={formIssue?.fieldId === 'classType' || undefined}
                        className={inputClassName}
                        required>
                        <option value='' disabled>{copy.placeholders.classType}</option>
                        {classTypes.map((classType) => (
                          <option key={classType.id} value={classType.id}>{classType.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p className='mt-4 text-sm leading-6 text-[#52655e]'>{copy.locationAvailability}</p>

                  <div className='mt-5 space-y-2'>
                    <Label htmlFor='notes' className='font-bold text-[#223b33]'>
                      {copy.fields.notes}
                    </Label>
                    <textarea
                      id='notes'
                      name='notes'
                      value={formState.notes}
                      onChange={handleTextInputChange('notes')}
                      placeholder={copy.placeholders.notes}
                      maxLength={800}
                      rows={4}
                      className='w-full resize-y rounded-xl !border !border-[#123d32]/20 !bg-[#fff] px-3 py-3 text-sm leading-6 !text-[#0a1713] shadow-sm outline-none [color-scheme:light] transition-[border-color,box-shadow] placeholder:!text-[#70847b] focus:!border-[#187b5d] focus:ring-2 focus:ring-[#187b5d]/25' />
                  </div>
                </section>

                <section className={formSectionClassName}>
                  <FormSectionHeader
                    number='02'
                    title={copy.sections.participant.title}
                    description={copy.sections.participant.description}
                    Icon={User} />

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className={fieldClassName}>
                      <Label htmlFor='participantFirstName' className='font-bold text-[#223b33]'>
                        {copy.fields.participantFirstName}
                      </Label>
                      <Input
                        id='participantFirstName'
                        name='participantFirstName'
                        autoComplete='section-participant given-name'
                        aria-describedby={formIssue?.fieldId === 'participantFirstName' ? 'registration-form-error' : undefined}
                        aria-invalid={formIssue?.fieldId === 'participantFirstName' || undefined}
                        className={inputClassName}
                        required
                        value={formState.participantFirstName}
                        onChange={handleTextInputChange('participantFirstName')} />
                    </div>
                    <div className={fieldClassName}>
                      <Label htmlFor='participantLastName' className='font-bold text-[#223b33]'>
                        {copy.fields.participantLastName}
                      </Label>
                      <Input
                        id='participantLastName'
                        name='participantLastName'
                        autoComplete='section-participant family-name'
                        aria-describedby={formIssue?.fieldId === 'participantLastName' ? 'registration-form-error' : undefined}
                        aria-invalid={formIssue?.fieldId === 'participantLastName' || undefined}
                        className={inputClassName}
                        required
                        value={formState.participantLastName}
                        onChange={handleTextInputChange('participantLastName')} />
                    </div>
                  </div>

                  <div className='mt-4 max-w-md space-y-2'>
                    <Label htmlFor='birthDate' className='flex items-center gap-2 font-bold text-[#223b33]'>
                      <CalendarDays className='h-4 w-4 text-[#126044]' />
                      {copy.fields.birthDate}
                    </Label>
                    <Input
                      id='birthDate'
                      name='birthDate'
                      type='date'
                      autoComplete='section-participant bday'
                      aria-describedby={formIssue?.fieldId === 'birthDate' ? 'registration-form-error' : undefined}
                      aria-invalid={formIssue?.fieldId === 'birthDate' || undefined}
                      className={inputClassName}
                      required
                      value={formState.birthDate}
                      onChange={handleBirthDateChange}
                      max={todayDate} />
                  </div>
                </section>

                <section className={formSectionClassName}>
                  <div className='mb-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start'>
                    <FormSectionHeader
                      number='03'
                      title={copy.sections.guardian.title}
                      description={copy.sections.guardian.description}
                      Icon={Users} />

                    <div className='flex items-center gap-3 rounded-xl border border-[#123d32]/[0.12] bg-[#f7f1e6]/70 px-4 py-3 sm:justify-self-end'>
                      <input
                        type='checkbox'
                        id='guardianInfoRequired'
                        name='guardianInfoRequired'
                        checked={guardianDetailsRequired}
                        disabled={participantIsMinor}
                        onChange={(event) => handleGuardianInfoRequiredChange(event.target.checked)}
                        className='h-6 w-6 shrink-0 cursor-pointer rounded border-[#123d32]/30 accent-[#187b5d] disabled:cursor-not-allowed' />
                      <Label htmlFor='guardianInfoRequired' className='cursor-pointer text-sm font-bold text-[#223b33]'>
                        {copy.fields.guardianRequired}
                      </Label>
                    </div>
                  </div>

                  {guardianDetailsRequired && (
                    <div className='grid grid-cols-1 gap-4 rounded-2xl border border-[#187b5d]/15 bg-[#b9f3dc]/20 p-4 md:grid-cols-2'>
                      <div className={fieldClassName}>
                        <Label htmlFor='guardianFirstName' className='font-bold text-[#223b33]'>
                          {copy.fields.guardianFirstName}
                        </Label>
                        <Input
                          id='guardianFirstName'
                          name='guardianFirstName'
                          autoComplete='section-guardian given-name'
                          aria-describedby={formIssue?.fieldId === 'guardianFirstName' ? 'registration-form-error' : undefined}
                          aria-invalid={formIssue?.fieldId === 'guardianFirstName' || undefined}
                          className={inputClassName}
                          required={guardianDetailsRequired}
                          value={formState.guardianFirstName}
                          onChange={handleTextInputChange('guardianFirstName')} />
                      </div>
                      <div className={fieldClassName}>
                        <Label htmlFor='guardianLastName' className='font-bold text-[#223b33]'>
                          {copy.fields.guardianLastName}
                        </Label>
                        <Input
                          id='guardianLastName'
                          name='guardianLastName'
                          autoComplete='section-guardian family-name'
                          aria-describedby={formIssue?.fieldId === 'guardianLastName' ? 'registration-form-error' : undefined}
                          aria-invalid={formIssue?.fieldId === 'guardianLastName' || undefined}
                          className={inputClassName}
                          required={guardianDetailsRequired}
                          value={formState.guardianLastName}
                          onChange={handleTextInputChange('guardianLastName')} />
                      </div>
                    </div>
                  )}
                </section>

                <section className={formSectionClassName}>
                  <FormSectionHeader
                    number='04'
                    title={copy.sections.contact.title}
                    description={copy.sections.contact.description}
                    Icon={Mail} />

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className={fieldClassName}>
                      <Label htmlFor='email' className='font-bold text-[#223b33]'>
                        {copy.fields.email}
                      </Label>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        autoComplete='email'
                        aria-describedby={formIssue?.fieldId === 'email' ? 'registration-form-error' : undefined}
                        aria-invalid={formIssue?.fieldId === 'email' || undefined}
                        className={inputClassName}
                        required
                        value={formState.email}
                        onChange={handleTextInputChange('email')} />
                    </div>
                    <div className={fieldClassName}>
                      <Label htmlFor='phone' className='font-bold text-[#223b33]'>
                        {copy.fields.phone}
                      </Label>
                      <Input
                        id='phone'
                        name='phone'
                        type='tel'
                        autoComplete='tel'
                        inputMode='tel'
                        aria-describedby={formIssue?.fieldId === 'phone' ? 'registration-form-error' : undefined}
                        aria-invalid={formIssue?.fieldId === 'phone' || undefined}
                        className={inputClassName}
                        required
                        value={formState.phone}
                        onChange={handleTextInputChange('phone')}
                        maxLength={40}
                        title={copy.phoneTitle} />
                    </div>
                  </div>
                </section>

                <section className={formSectionClassName}>
                  <FormSectionHeader
                    number='05'
                    title={consentSectionTitle}
                    description={copy.sections.consents.description}
                    Icon={ShieldCheck} />

                  <p className='mb-4 rounded-2xl border border-[#b47a00]/20 bg-[#f5b942]/15 px-4 py-3 text-sm font-semibold leading-6 text-[#5f470f]'>
                    {copy.consents.regulationsReviewNote}
                  </p>

                  <div className='rounded-2xl border border-[#123d32]/10 bg-[#f7f1e6]/65 p-3 sm:p-4'>
                    <div className='divide-y divide-[#123d32]/10 rounded-xl bg-[#fffdfa] px-4'>
                      {consentOptions.map((consent) => {
                        const consentLabelId = `${consent.field}-label`;
                        const hasInteractiveLabel = consent.field === 'acceptedPersonalDataProcessing';

                        return (
                        <div key={consent.field} className='grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-3 py-4'>
                          <input
                            type='checkbox'
                            id={consent.field}
                            name={consent.field}
                            checked={formState[consent.field]}
                            aria-labelledby={consentLabelId}
                            aria-required={consent.required !== false}
                            aria-invalid={formIssue?.fieldId === consent.field || undefined}
                            aria-describedby={formIssue?.fieldId === consent.field ? 'registration-form-error' : undefined}
                            onChange={(event) => handleCheckboxChange(consent.field, event.target.checked)}
                            className='mt-0.5 h-6 w-6 shrink-0 cursor-pointer rounded border-[#123d32]/30 accent-[#187b5d]' />
                          {hasInteractiveLabel
                            ? (
                              <div id={consentLabelId} className='min-w-0 text-sm leading-6 text-[#385047]'>
                                {consent.label}
                              </div>
                            )
                            : (
                              <Label
                                id={consentLabelId}
                                htmlFor={consent.field}
                                className='min-w-0 cursor-pointer text-sm leading-6 text-[#385047]'>
                                {consent.label}
                              </Label>
                            )}
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </div>

              <details className='mt-8 rounded-2xl border border-[#123d32]/10 bg-[#f7f1e6]/70 p-5 text-sm text-[#52655e]'>
                <summary className='cursor-pointer rounded-lg font-black text-[#0a1713] outline-none focus-visible:ring-2 focus-visible:ring-[#187b5d] focus-visible:ring-offset-4'>
                  {copy.adminInfoTitle}
                </summary>
                <div className='mt-4 space-y-3 text-xs leading-6'>
                  {copy.adminInfo.map((paragraph) => (
                    <p key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </details>

              <div className='pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden' aria-hidden='true'>
                <input
                  id='company'
                  name='company'
                  tabIndex={-1}
                  aria-hidden='true'
                  autoComplete='off'
                  value={company}
                  onChange={(event) => setCompany(event.target.value)} />
              </div>

              <div className='mt-8 grid gap-5 rounded-[1.5rem] border border-[#187b5d]/[0.16] bg-[#b9f3dc]/[0.24] p-5 sm:grid-cols-[1fr_auto] sm:items-center'>
                <p className='text-sm font-semibold leading-6 text-[#123d32]'>
                  {copy.submitNote}
                </p>
                <Button
                  type='submit'
                  className='h-14 w-full rounded-full bg-[#187b5d] px-8 font-black text-white shadow-[0_14px_32px_rgba(24,123,93,0.2)] hover:bg-[#123d32] sm:w-auto'
                  disabled={isSubmitting}>
                  {isSubmitting ? copy.submitting : copy.submit}
                  {!isSubmitting && <ArrowRight className='ml-2 h-5 w-5' />}
                </Button>
              </div>
            </form>

            <Reveal delay={120} className='lg:sticky lg:top-24 lg:self-start'>
            <aside className='space-y-5'>
              <article className='story-card bg-[#123d32] p-6 text-white'>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5b942] text-[#0a1713]'>
                  <Phone className='h-5 w-5' />
                </div>
                <h2 className='mt-5 text-2xl font-black tracking-[-0.035em] text-white'>
                  {copy.unsureTitle}
                </h2>
                <p className='mt-3 text-sm leading-7 text-white/[0.72]'>
                  {copy.unsureLead}
                </p>
                <Button
                  asChild
                  variant='outline'
                  className='mt-6 h-12 w-full rounded-full border-white/20 bg-white/10 font-black text-white hover:bg-white hover:text-[#0a1713]'>
                  <NavLink to='/kontakt'>
                    {copy.contact}
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </NavLink>
                </Button>
              </article>

              <article className='story-paper p-6'>
                <h2 className='text-xl font-black tracking-[-0.025em] text-[#0a1713]'>
                  {copy.afterTitle}
                </h2>
                <ul className='mt-5 space-y-4 text-sm font-semibold leading-6 text-[#385047]'>
                  {copy.afterItems.map((item) => (
                    <li key={item} className='flex gap-3'>
                      <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0 text-[#126044]' />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </aside>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
