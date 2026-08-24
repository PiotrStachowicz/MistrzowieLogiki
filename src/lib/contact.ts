export function getPhoneHref(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, '');

  if (!digits) {
    return 'tel:';
  }

  return digits.length === 9 ? `tel:+48${digits}` : `tel:+${digits}`;
}
