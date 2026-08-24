import { CalendarDays, Mail, ShieldCheck } from 'lucide-react';

export type LegalSection = {
  title: string,
  paragraphs?: string[],
  items?: string[],
};

type LegalDocumentPageProps = {
  contactLabel: string,
  email: string,
  eyebrow: string,
  intro: string,
  lastUpdated: string,
  lastUpdatedLabel: string,
  sections: LegalSection[],
  title: string,
};

export default function LegalDocumentPage({
  contactLabel,
  email,
  eyebrow,
  intro,
  lastUpdated,
  lastUpdatedLabel,
  sections,
  title,
}: LegalDocumentPageProps) {
  return (
    <div className='bg-slate-50 text-slate-950'>
      <section className='bg-slate-950 text-white'>
        <div className='container px-4 py-16 sm:py-20 lg:py-24'>
          <div className='max-w-4xl'>
            <div className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-emerald-200'>
              <ShieldCheck className='h-4 w-4 text-amber-300' />
              {eyebrow}
            </div>
            <h1 className='mt-6 text-4xl font-black leading-tight sm:text-6xl'>
              {title}
            </h1>
            <p className='mt-6 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl'>
              {intro}
            </p>
            <p className='mt-6 inline-flex items-center gap-2 text-sm text-slate-400'>
              <CalendarDays className='h-4 w-4' />
              {lastUpdatedLabel}: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      <div className='container px-4 py-12 sm:py-16 lg:py-20'>
        <div className='mx-auto max-w-4xl rounded-md border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:p-12'>
          <div className='space-y-10'>
            {sections.map((section, index) => (
              <section key={section.title} aria-labelledby={`legal-section-${index}`}>
                <h2
                  id={`legal-section-${index}`}
                  className='text-2xl font-black leading-tight text-slate-950 sm:text-3xl'>
                  {index + 1}. {section.title}
                </h2>

                {section.paragraphs && (
                  <div className='mt-4 space-y-4 text-base leading-8 text-slate-600'>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {section.items && (
                  <ul className='mt-4 list-disc space-y-3 pl-6 text-base leading-7 text-slate-600 marker:text-emerald-700'>
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className='mt-12 rounded-md border border-emerald-100 bg-emerald-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6'>
            <div>
              <p className='font-black text-emerald-950 dark:text-emerald-100'>{contactLabel}</p>
              <p className='mt-1 text-sm text-emerald-900 dark:text-emerald-200'>{email}</p>
            </div>
            <a
              href={`mailto:${email}`}
              className='mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 text-sm font-bold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:bg-emerald-800 dark:hover:bg-emerald-700 sm:mt-0'>
              <Mail className='h-4 w-4' />
              {email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
