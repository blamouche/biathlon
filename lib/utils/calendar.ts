/**
 * Génère un fichier iCal pour une course de biathlon
 */
export function generateICalFile(
  title: string,
  location: string,
  startDate: string,
  endDate?: string,
  description?: string
): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2h par défaut

  // Format iCal date : YYYYMMDDTHHMMSSZ
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Biathlon World Cup Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    description ? `DESCRIPTION:${description}` : '',
    `UID:${Date.now()}@biathlonworldcup.com`,
    `DTSTAMP:${formatDate(new Date())}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  return icalContent;
}

/**
 * Télécharge un fichier iCal
 */
export function downloadICalFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Copie un lien dans le presse-papiers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erreur lors de la copie:', err);
    return false;
  }
}

/**
 * Partage via l'API Web Share si disponible
 */
export async function shareLink(
  title: string,
  url: string,
  text?: string
): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: text || title,
        url,
      });
      return true;
    } catch (err) {
      console.error('Erreur lors du partage:', err);
      return false;
    }
  }
  return false;
}
