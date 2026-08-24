import type { Language } from '@/lib/i18n';
import type { FaqSection } from '@/types/site-content';

export const faqSectionsByLanguage: Record<Language, FaqSection[]> = {
  pl: [
    {
      title: 'Matematyka i zajęcia szachowe',
      questions: [
        {
          id: '1',
          title: 'Z jakich przedmiotów udzielane są korepetycje?',
          answer:
            'Oferujemy korepetycje z matematyki na poziomie szkoły podstawowej i średniej oraz zajęcia szachowe dla początkujących i zaawansowanych.',
        },
        {
          id: '2',
          title: 'Czy prowadzicie korepetycje online?',
          answer: 'Tak. Zajęcia online odbywają się przez Microsoft Teams lub Google Meet.',
        },
        {
          id: '3',
          title: 'Czy prowadzicie również zajęcia stacjonarne?',
          answer: 'Tak, istnieje możliwość spotkań stacjonarnych. Szczegóły ustalamy indywidualnie.',
        },
        {
          id: '4',
          title: 'Czy lekcje online są równie skuteczne jak stacjonarne?',
          answer:
            'Tak. Zajęcia online oszczędzają czas na dojazdy, łatwiej utrzymać regularność, a narzędzia online pomagają jasno pokazywać rozwiązania.',
        },
        {
          id: '5',
          title: 'Jak zapisać się na korepetycje?',
          answer: 'Wypełnij formularz w zakładce „Zapisz ucznia na zajęcia”. Odezwiemy się i ustalimy termin.',
        },
        {
          id: '6',
          title: 'Czy są dostępne zajęcia indywidualne i grupowe?',
          answer: 'Tak. Prowadzimy zajęcia 1:1 oraz zajęcia w małych grupach. Format dobieramy do potrzeb i celu ucznia.',
        },
        {
          id: '7',
          title: 'Jak długo trwa jedna lekcja?',
          answer: 'Czas zależy od formatu: zajęcia indywidualne trwają zwykle 60 minut, przedszkolne 30 minut, a szkolne 45 minut.',
        },
        {
          id: '8',
          title: 'Jaki jest koszt zajęć i jak wygląda płatność?',
          answer:
            'Ceny znajdują się w zakładce „Cennik”. Rozliczenie odbywa się miesięcznie, po podsumowaniu zrealizowanych zajęć.',
        },
        {
          id: '9',
          title: 'Czy można odwoływać zajęcia?',
          answer:
            'Tak. Zajęcia można odwołać do godziny 20:00 dnia poprzedzającego. Późniejsze odwołanie oznacza konieczność opłacenia lekcji.',
        },
        {
          id: '10',
          title: 'Z jakimi uczniami współpracujecie?',
          answer: 'Pracujemy z uczniami szkoły podstawowej, szkoły średniej, maturzystami i osobami dorosłymi.',
        },
        {
          id: '11',
          title: 'Czy przygotowujecie do egzaminów?',
          answer:
            'Tak. Przygotowujemy do egzaminu ósmoklasisty, matury, sprawdzianów, konkursów matematycznych i turniejów szachowych.',
        },
      ],
    },
    {
      title: 'Kursy przygotowawcze do egzaminu ósmoklasisty i matury',
      questions: [
        {
          id: '1',
          title: 'Jak zapisać się na kurs online?',
          answer: 'Wypełnij formularz zapisu. Po zgłoszeniu skontaktujemy się, żeby ustalić termin i grupę.',
        },
        {
          id: '2',
          title: 'Czy kursy odbywają się online?',
          answer: 'Tak. Kursy prowadzimy online przez Microsoft Teams lub Google Meet.',
        },
        {
          id: '3',
          title: 'Czy kursy są prowadzone stacjonarnie?',
          answer: 'Na ten moment kursy egzaminacyjne prowadzimy online.',
        },
        {
          id: '4',
          title: 'Czy kursy są grupowe?',
          answer: 'Tak. Zajęcia odbywają się w małych grupach do 6 osób.',
        },
        {
          id: '5',
          title: 'Co obejmuje program kursu?',
          answer:
            'Typowe zadania egzaminacyjne, skuteczne metody rozwiązywania, arkusze z poprzednich lat, logiczne myślenie i omówienie wyników.',
        },
        {
          id: '6',
          title: 'Jak często odbywają się zajęcia?',
          answer: 'Kursy grupowe odbywają się standardowo raz w tygodniu. Termin i częstotliwość konkretnej grupy potwierdzamy przed zapisem.',
        },
        {
          id: '7',
          title: 'Czy można dołączyć w trakcie trwania kursu?',
          answer: 'Tak, jeśli w grupie są wolne miejsca.',
        },
        {
          id: '8',
          title: 'Czy są zadawane prace domowe?',
          answer: 'Tak, zadajemy krótkie prace domowe, żeby utrwalić materiał i ćwiczyć samodzielne myślenie.',
        },
        {
          id: '9',
          title: 'Jak wygląda płatność za kurs?',
          answer: 'Kursy rozliczamy miesięcznie. Aktualna cena znajduje się w cenniku, a szczegóły potwierdzamy przed rozpoczęciem zajęć.',
        },
      ],
    },
    {
      title: 'Zajęcia szachowe w szkołach i przedszkolach',
      questions: [
        {
          id: '1',
          title: 'Dla jakiego wieku są przeznaczone zajęcia szachowe?',
          answer: 'Zajęcia przedszkolne są przeznaczone dla dzieci w wieku 3–6 lat, a zajęcia w szkołach podstawowych dla uczniów w wieku 6–14 lat. Grupy dobieramy także do poziomu.',
        },
        {
          id: '2',
          title: 'Czy moje dziecko musi już znać zasady gry w szachy?',
          answer: 'Nie. Uczymy od podstaw, a bardziej zaawansowanym dzieciom pomagamy rozwijać grę.',
        },
        {
          id: '3',
          title: 'Co daje dziecku nauka gry w szachy?',
          answer: 'Szachy rozwijają logiczne myślenie, koncentrację, cierpliwość, planowanie i decyzyjność.',
        },
        {
          id: '4',
          title: 'Jak długo trwa jedna lekcja?',
          answer: 'W przedszkolu lekcja trwa 30 minut. W szkole podstawowej standardowo 45 minut.',
        },
        {
          id: '5',
          title: 'Ile kosztują zajęcia?',
          answer: 'Przedszkole: 80 zł / miesiąc. Szkoła podstawowa: 120 zł / miesiąc.',
        },
        {
          id: '6',
          title: 'Jak często odbywają się zajęcia?',
          answer: 'Zwykle raz w tygodniu. Częstsze spotkania ustalamy indywidualnie.',
        },
        {
          id: '7',
          title: 'Jakie materiały są potrzebne na zajęcia?',
          answer: 'Wszystko zapewniamy my. Dzieci nie muszą przynosić własnych szachów.',
        },
        {
          id: '8',
          title: 'Jak zapisać dziecko na zajęcia?',
          answer: 'Przejdź do zakładki „Zapisz ucznia na zajęcia” i wypełnij krótki formularz.',
        },
      ],
    },
  ],
  en: [
    {
      title: 'Math tutoring and chess classes',
      questions: [
        {
          id: '1',
          title: 'Which subjects do you teach?',
          answer:
            'We offer math tutoring for primary and secondary school students, plus chess classes for beginners and advanced students.',
        },
        {
          id: '2',
          title: 'Do you offer online tutoring?',
          answer: 'Yes. Online classes take place via Microsoft Teams or Google Meet.',
        },
        {
          id: '3',
          title: 'Do you also offer in-person classes?',
          answer: 'Yes. In-person meetings are possible and arranged individually.',
        },
        {
          id: '4',
          title: 'Are online lessons as effective as in-person lessons?',
          answer:
            'Yes. Online lessons save travel time, make regular attendance easier, and allow us to show solutions clearly with digital tools.',
        },
        {
          id: '5',
          title: 'How do I sign up for tutoring?',
          answer: 'Fill out the form in the “Enrol a student” section. We will contact you to arrange a suitable time.',
        },
        {
          id: '6',
          title: 'Do you offer both individual and group classes?',
          answer: 'Yes. We offer one-to-one lessons and small-group classes. We match the format to the student’s needs and goal.',
        },
        {
          id: '7',
          title: 'How long is one lesson?',
          answer: 'Lesson length depends on the format: one-to-one lessons usually last 60 minutes, preschool classes 30 minutes and school classes 45 minutes.',
        },
        {
          id: '8',
          title: 'How much do classes cost and how does payment work?',
          answer:
            'Prices are listed on the Pricing page. Payment is settled monthly after we summarise the completed lessons.',
        },
        {
          id: '9',
          title: 'Can lessons be cancelled?',
          answer:
            'Yes. Lessons can be cancelled by 8:00 PM on the previous day. Later cancellations are charged as completed lessons.',
        },
        {
          id: '10',
          title: 'Which students do you work with?',
          answer: 'We work with primary school students, secondary school students, Matura students and adults.',
        },
        {
          id: '11',
          title: 'Do you prepare students for exams?',
          answer:
            'Yes. We prepare students for the eighth-grade exam, Matura, school tests, math competitions and chess tournaments.',
        },
      ],
    },
    {
      title: 'Eighth-grade exam and Matura preparation courses',
      questions: [
        {
          id: '1',
          title: 'How do I sign up for an online course?',
          answer: 'Fill out the enrolment form. After that, we will contact you to arrange the schedule and group.',
        },
        {
          id: '2',
          title: 'Are the courses online?',
          answer: 'Yes. Courses are held online via Microsoft Teams or Google Meet.',
        },
        {
          id: '3',
          title: 'Are the courses available in person?',
          answer: 'At the moment, exam preparation courses are online only.',
        },
        {
          id: '4',
          title: 'Are the courses group-based?',
          answer: 'Yes. Classes are held in small groups of up to 6 students.',
        },
        {
          id: '5',
          title: 'What does the course programme include?',
          answer:
            'Typical exam tasks, effective solution methods, past papers, logical thinking practice and review of results.',
        },
        {
          id: '6',
          title: 'How often do classes take place?',
          answer: 'Group courses usually meet once a week. We confirm the schedule and frequency before enrolment.',
        },
        {
          id: '7',
          title: 'Can a student join after the course has started?',
          answer: 'Yes, if there are free places in the group.',
        },
        {
          id: '8',
          title: 'Is homework assigned?',
          answer: 'Yes. We assign short homework tasks to reinforce the material and build independent thinking.',
        },
        {
          id: '9',
          title: 'How does payment for a course work?',
          answer: 'Courses are billed monthly. Current prices are listed on the Pricing page, and we confirm the details before classes begin.',
        },
      ],
    },
    {
      title: 'Chess classes in schools and preschools',
      questions: [
        {
          id: '1',
          title: 'What age are chess classes for?',
          answer: 'Preschool chess classes are for children aged 3–6, and primary-school classes are for students aged 6–14. Groups are also matched by level.',
        },
        {
          id: '2',
          title: 'Does my child need to know chess rules already?',
          answer: 'No. We teach from scratch and help more advanced children develop their game.',
        },
        {
          id: '3',
          title: 'What does chess teach children?',
          answer: 'Chess develops logical thinking, concentration, patience, planning and decision-making.',
        },
        {
          id: '4',
          title: 'How long is one lesson?',
          answer: 'Preschool lessons last 30 minutes. Primary school lessons usually last 45 minutes.',
        },
        {
          id: '5',
          title: 'How much do classes cost?',
          answer: 'Preschool: PLN 80 / month. Primary school: PLN 120 / month.',
        },
        {
          id: '6',
          title: 'How often do classes take place?',
          answer: 'Usually once a week. More frequent meetings can be arranged individually.',
        },
        {
          id: '7',
          title: 'What materials are needed?',
          answer: 'We provide everything. Children do not need to bring their own chess set.',
        },
        {
          id: '8',
          title: 'How do I enrol a child?',
          answer: 'Go to the “Enrol a student” section and fill out the short form.',
        },
      ],
    },
  ],
};

