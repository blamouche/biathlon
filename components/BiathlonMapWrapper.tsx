'use client';

import dynamic from 'next/dynamic';
import { Event } from '@/lib/types/biathlon';

// Charger la carte dynamiquement côté client uniquement
const BiathlonMap = dynamic(
  () => import('@/components/BiathlonMap').then((mod) => mod.BiathlonMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🗺️</div>
          <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Chargement de la carte...
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Préparation de la carte interactive
          </p>
        </div>
      </div>
    )
  }
);

interface BiathlonMapWrapperProps {
  events: Event[];
}

export function BiathlonMapWrapper({ events }: BiathlonMapWrapperProps) {
  return <BiathlonMap events={events} />;
}
