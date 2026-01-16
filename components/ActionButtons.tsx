'use client';

import { useState } from 'react';
import { generateICalFile, downloadICalFile, copyToClipboard, shareLink } from '@/lib/utils/calendar';

interface DownloadICalButtonProps {
  title: string;
  location: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export function DownloadICalButton({
  title,
  location,
  startDate,
  endDate,
  description,
}: DownloadICalButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    const icalContent = generateICalFile(title, location, startDate, endDate, description);
    const filename = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    downloadICalFile(icalContent, filename);
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
      title="Ajouter au calendrier"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span>{downloading ? 'Téléchargement...' : 'Calendrier'}</span>
    </button>
  );
}

interface ShareButtonProps {
  title: string;
  url: string;
  text?: string;
}

export function ShareButton({ title, url, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);

    // Essayer d'abord avec l'API Web Share
    const shared = await shareLink(title, url, text);

    if (!shared) {
      // Fallback: copier le lien
      const success = await copyToClipboard(url);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }

    setSharing(false);
  };

  return (
    <button
      onClick={handleShare}
      disabled={sharing}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
      title="Partager"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-600">Copié !</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span>Partager</span>
        </>
      )}
    </button>
  );
}
