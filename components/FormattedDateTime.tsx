'use client';

import { formatDateTime } from '@/lib/utils/dateTime';

interface FormattedDateTimeProps {
  dateString: string;
  locale: string;
}

/**
 * Client component for formatting dates/times
 * This ensures dates are always formatted in the user's browser timezone,
 * not the server's timezone
 */
export function FormattedDateTime({ dateString, locale }: FormattedDateTimeProps) {
  const localeCode = locale === 'fr' ? 'fr-FR' : 'en-US';
  return <>{formatDateTime(dateString, localeCode)}</>;
}
