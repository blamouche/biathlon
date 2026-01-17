'use client';

import { useEffect, useState } from 'react';
import { ShareButton } from './ActionButtons';

export function SharePageButton() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
    setTitle(document.title || 'Biathlon Live Monitor');
  }, []);

  if (!url) return null;

  return <ShareButton title={title} url={url} />;
}
