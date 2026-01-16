/**
 * Formats a date string with proper timezone handling
 * @param dateString - ISO date string from the API
 * @param locale - Locale for formatting (e.g., 'fr-FR', 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  };
  return date.toLocaleDateString(locale, defaultOptions);
}

/**
 * Formats a datetime string with proper timezone handling
 * The API returns times in the local timezone of the event.
 * We need to display them in the user's local timezone.
 *
 * @param dateString - ISO date string from the API
 * @param locale - Locale for formatting (e.g., 'fr-FR', 'en-US')
 * @param utcOffset - UTC offset in hours from the event (optional, from Event.UTCOffset)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted datetime string
 */
export function formatDateTime(
  dateString: string,
  locale: string,
  utcOffset?: number,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateString);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    ...options,
  };

  return date.toLocaleString(locale, defaultOptions);
}

/**
 * Formats just the time portion of a datetime string
 * @param dateString - ISO date string from the API
 * @param locale - Locale for formatting
 * @returns Formatted time string
 */
export function formatTime(
  dateString: string,
  locale: string
): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Gets a human-readable timezone string based on UTC offset
 * @param utcOffset - UTC offset in hours
 * @returns Timezone string (e.g., "UTC+1", "UTC-5")
 */
export function getTimezoneString(utcOffset: number): string {
  if (utcOffset === 0) return 'UTC';
  const sign = utcOffset > 0 ? '+' : '';
  return `UTC${sign}${utcOffset}`;
}
