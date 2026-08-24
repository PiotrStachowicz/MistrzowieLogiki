import type { Language } from '@/lib/i18n';

export type RegistrationEmailPayload = {
  location: string,
  classType: string,
  participantFirstName: string,
  participantLastName: string,
  birthDate: string,
  guardianFirstName: string,
  guardianLastName: string,
  email: string,
  phone: string,
  notes: string,
  acceptedTerms: boolean,
  acceptedPayments: boolean,
  acceptedPersonalDataProcessing: boolean,
  acceptedMinorProtectionStandards: boolean,
  acceptedHealthStatement: boolean,
  acceptedMarketingUse: boolean,
};

export type RegistrationRequest = {
  payload: RegistrationEmailPayload,
  language: Language,
  sourcePath: string,
  selectedOfferId?: string,
  company?: string,
};

export type RegistrationEmailResult = {
  confirmationDelivered: boolean,
  confirmationError?: string,
};

export async function sendRegistrationEmails(request: RegistrationRequest): Promise<RegistrationEmailResult> {
  const response = await fetch('/api/send-registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const result = await response.json().catch(() => null) as (RegistrationEmailResult & { error?: string }) | null;

  if (!response.ok) {
    throw new Error(result?.error || `Registration request failed (${response.status}).`);
  }

  return {
    confirmationDelivered: result?.confirmationDelivered ?? false,
    confirmationError: result?.confirmationError,
  };
}

export function describeRegistrationEmailError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown registration email error.';
}
