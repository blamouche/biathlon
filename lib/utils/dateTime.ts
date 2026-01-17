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
 * We convert them to the user's local timezone for display.
 *
 * @param dateString - ISO date string from the API (in event's local timezone)
 * @param locale - Locale for formatting (e.g., 'fr-FR', 'en-US')
 * @param utcOffset - UTC offset in hours from the event (from Event.UTCOffset, e.g., 1 for UTC+1)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted datetime string in user's local timezone
 */
export function formatDateTime(
  dateString: string,
  locale: string,
  utcOffset: number = 0,
  options?: Intl.DateTimeFormatOptions
): string {
  // Remove any existing timezone info from the date string
  const cleanDateString = dateString.replace(/Z$/, '').replace(/[+-]\d{2}:\d{2}$/, '');

  // Add the event's timezone offset to create a proper ISO string
  // e.g., if utcOffset = 1, we append "+01:00"
  const offsetHours = Math.floor(Math.abs(utcOffset));
  const offsetMinutes = Math.abs((utcOffset % 1) * 60);
  const offsetSign = utcOffset >= 0 ? '+' : '-';
  const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

  // Parse the date with the correct timezone
  const date = new Date(cleanDateString + offsetString);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  // toLocaleString will automatically display in the user's local timezone
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
