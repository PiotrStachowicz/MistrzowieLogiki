import type { IncomingMessage, ServerResponse } from 'node:http';

type RegistrationPayload = {
  location?: unknown,
  classType?: unknown,
  participantFirstName?: unknown,
  participantLastName?: unknown,
  birthDate?: unknown,
  guardianFirstName?: unknown,
  guardianLastName?: unknown,
  email?: unknown,
  phone?: unknown,
  notes?: unknown,
  acceptedTerms?: unknown,
  acceptedPayments?: unknown,
  acceptedPersonalDataProcessing?: unknown,
  acceptedMinorProtectionStandards?: unknown,
  acceptedHealthStatement?: unknown,
  acceptedMarketingUse?: unknown,
};

type RegistrationRequest = {
  payload?: RegistrationPayload,
  language?: unknown,
  sourcePath?: unknown,
  selectedOfferId?: unknown,
  company?: unknown,
};

type ApiRequest = IncomingMessage & { body?: unknown };
type RateLimitEntry = { count: number, resetAt: number };

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';
const MAX_BODY_BYTES = 16_384;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const CONSENT_VERSION = '2026-08-22';
const rateLimits = new Map<string, RateLimitEntry>();

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
}

function getClientAddress(request: IncomingMessage): string {
  const forwarded = request.headers['x-forwarded-for'];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  return firstForwarded?.trim() || request.socket.remoteAddress || 'unknown';
}

function isRateLimited(address: string): boolean {
  const now = Date.now();
  const current = rateLimits.get(address);

  if (!current || current.resetAt <= now) {
    rateLimits.set(address, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

async function readBody(request: ApiRequest): Promise<RegistrationRequest> {
  if (request.body && typeof request.body === 'object') {
    return request.body as RegistrationRequest;
  }

  let body = '';
  for await (const chunk of request) {
    body += String(chunk);
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
      throw new Error('BODY_TOO_LARGE');
    }
  }

  return JSON.parse(body || '{}') as RegistrationRequest;
}

function text(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function validate(payload: RegistrationPayload): string | null {
  const requiredTextFields: Array<keyof RegistrationPayload> = [
    'location', 'classType', 'participantFirstName', 'participantLastName', 'birthDate', 'email', 'phone',
  ];

  if (requiredTextFields.some((field) => !text(payload[field], 200))) {
    return 'Uzupełnij wszystkie wymagane pola.';
  }

  const email = text(payload.email, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Podaj poprawny adres e-mail.';
  }

  const phone = text(payload.phone, 40);
  if (!/^[+\d][\d\s().-]{6,39}$/.test(phone)) {
    return 'Podaj poprawny numer telefonu.';
  }

  const birthDate = text(payload.birthDate, 10);
  const parsedBirthDate = new Date(`${birthDate}T00:00:00Z`);
  const normalizedBirthDate = Number.isNaN(parsedBirthDate.valueOf())
    ? ''
    : parsedBirthDate.toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || normalizedBirthDate !== birthDate || parsedBirthDate > new Date()) {
    return 'Podaj poprawną datę urodzenia.';
  }

  if (payload.acceptedPersonalDataProcessing !== true || payload.acceptedHealthStatement !== true) {
    return 'Zaznacz wymagane zgody.';
  }

  return null;
}

function toTemplateParams(request: RegistrationRequest) {
  const payload = request.payload ?? {};
  const bool = (value: unknown) => value === true ? 'tak' : 'nie';

  return {
    name: `${text(payload.participantFirstName, 100)} ${text(payload.participantLastName, 100)}`.trim(),
    class_type: text(payload.classType, 200),
    location: text(payload.location, 100),
    birth_date: text(payload.birthDate, 10),
    parentFirstName: text(payload.guardianFirstName, 100) || '-',
    parentLastName: text(payload.guardianLastName, 100) || '-',
    phone: text(payload.phone, 40),
    email: text(payload.email, 254),
    notes: text(payload.notes, 2_000) || '-',
    accepted_terms: bool(payload.acceptedTerms),
    accepted_payments: bool(payload.acceptedPayments),
    accepted_personal_data_processing: bool(payload.acceptedPersonalDataProcessing),
    accepted_minor_protection_standards: bool(payload.acceptedMinorProtectionStandards),
    accepted_health_statement: bool(payload.acceptedHealthStatement),
    accepted_marketing_use: bool(payload.acceptedMarketingUse),
    consent_version: CONSENT_VERSION,
    language: request.language === 'en' ? 'en' : 'pl',
    source_path: text(request.sourcePath, 300) || '/',
    offer_id: text(request.selectedOfferId, 100) || '-',
    submitted_at: new Date().toISOString(),
  };
}

async function sendEmail(templateId: string, templateParams: ReturnType<typeof toTemplateParams>): Promise<void> {
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_PUBLIC_EMAILJS;
  const serviceId = process.env.EMAILJS_SERVICE_ID || 'service_am4aeab';

  if (!publicKey) {
    throw new Error('Email service is not configured.');
  }

  const result = await fetch(EMAILJS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lib_version: 'server',
      user_id: publicKey,
      service_id: serviceId,
      template_id: templateId,
      template_params: templateParams,
    }),
  });

  if (!result.ok) {
    throw new Error(`Email provider returned ${result.status}.`);
  }
}

export default async function handler(request: ApiRequest, response: ServerResponse): Promise<void> {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const body = await readBody(request);

    if (text(body.company, 200)) {
      sendJson(response, 200, { confirmationDelivered: true });
      return;
    }

    if (isRateLimited(getClientAddress(request))) {
      sendJson(response, 429, { error: 'Zbyt wiele prób. Spróbuj ponownie za 15 minut.' });
      return;
    }

    const payload = body.payload ?? {};
    const validationError = validate(payload);
    if (validationError) {
      sendJson(response, 400, { error: validationError });
      return;
    }

    const templateParams = toTemplateParams(body);
    const ownerTemplateId = process.env.EMAILJS_OWNER_TEMPLATE_ID || 'template_yoy2y3c';
    const customerTemplateId = body.language === 'en'
      ? process.env.EMAILJS_CUSTOMER_TEMPLATE_ID_EN || process.env.EMAILJS_CUSTOMER_TEMPLATE_ID || 'template_h83zmn5'
      : process.env.EMAILJS_CUSTOMER_TEMPLATE_ID || 'template_h83zmn5';

    await sendEmail(ownerTemplateId, templateParams);

    try {
      await sendEmail(customerTemplateId, templateParams);
      sendJson(response, 200, { confirmationDelivered: true });
    } catch (confirmationError) {
      console.error('Registration confirmation failed.', confirmationError);
      sendJson(response, 200, {
        confirmationDelivered: false,
        confirmationError: 'Owner notification delivered; confirmation could not be sent.',
      });
    }
  } catch (error) {
    console.error('Registration request failed.', error);
    const status = error instanceof Error && error.message === 'BODY_TOO_LARGE' ? 413 : 500;
    sendJson(response, status, {
      error: status === 413 ? 'Zgłoszenie jest zbyt duże.' : 'Nie udało się wysłać zgłoszenia. Spróbuj ponownie.',
    });
  }
}
