'use client';

import { useState } from 'react';
import { IntermediatesData, RangeAnalysisData, CourseAnalysisData, PreTimesData, RaceResult } from '@/lib/types/biathlon';
import { RangeAnalysisSection } from './RangeAnalysisSection';
import { CourseAnalysisSection } from './CourseAnalysisSection';
import Link from 'next/link';

type TabId = 'results' | 'range' | 'course';

interface Tab {
  id: TabId;
  label: string;
  shortLabel: string;
}

interface RaceTabsProps {
  locale: string;
  results: RaceResult[];
  intermediates: IntermediatesData | null;
  rangeAnalysis: RangeAnalysisData | null;
  courseAnalysis: CourseAnalysisData | null;
  preTimes: PreTimesData | null;
  status: 'upcoming' | 'live' | 'finished';
  statusConfig: any;
}

type SortColumn = 'rank' | 'bib' | 'athlete' | 'shooting' | 'time' | 'behind' | null;
type SortDirection = 'asc' | 'desc';

export function RaceTabs({
  locale,
  results,
  intermediates,
  rangeAnalysis,
  courseAnalysis,
  preTimes,
  status,
  statusConfig,
}: RaceTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('results');
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const tabs: Tab[] = [
    { id: 'results', label: 'RESULTS', shortLabel: 'RESULTS' },
    { id: 'range', label: 'RANGE ANALYSIS', shortLabel: 'RANGE' },
    { id: 'course', label: 'COURSE ANALYSIS', shortLabel: 'COURSE' },
  ];

  const config = statusConfig[status];

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const timeToSeconds = (timeStr: string | null | undefined): number => {
    if (!timeStr) return Infinity;
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const [mins, secs] = parts;
      return parseInt(mins) * 60 + parseFloat(secs);
    }
    return Infinity;
  };

  const getSortedResults = () => {
    if (!sortColumn) return results;

    return [...results].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortColumn) {
        case 'rank':
          aVal = typeof a.Rank === 'number' ? a.Rank : Infinity;
          bVal = typeof b.Rank === 'number' ? b.Rank : Infinity;
          break;
        case 'bib':
          aVal = a.Bib || 0;
          bVal = b.Bib || 0;
          break;
        case 'athlete':
          aVal = a.FamilyName?.toLowerCase() || '';
          bVal = b.FamilyName?.toLowerCase() || '';
          break;
        case 'shooting':
          aVal = parseInt(a.ShootingTotal || '99');
          bVal = parseInt(b.ShootingTotal || '99');
          break;
        case 'time':
          aVal = timeToSeconds(a.TotalTime);
          bVal = timeToSeconds(b.TotalTime);
          break;
        case 'behind':
          aVal = timeToSeconds(a.Behind);
          bVal = timeToSeconds(b.Behind);
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const SortableHeader = ({ column, children, className = '' }: { column: SortColumn; children: React.ReactNode; className?: string }) => (
    <div
      onClick={() => handleSort(column)}
      className={`cursor-pointer hover:text-cyan-400 transition-colors select-none ${className}`}
    >
      {children}
      {sortColumn === column && (
        <span className="ml-1 text-cyan-400">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </div>
  );

  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 3) return '🏳️';
    const codePoints = countryCode
      .toUpperCase()
      .slice(0, 2)
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="border border-cyan-500/30 bg-black/40 mb-6 overflow-x-auto">
        <div className="flex items-center min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-6 py-4 font-bold tracking-wider text-sm transition-all
                border-b-2 whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400'
                    : 'border-transparent bg-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/20'
                }
              `}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="inline sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="border border-gray-700/50 bg-black/20 overflow-hidden">
        {activeTab === 'results' && (
          <>
            {/* Results Header */}
            <div className="bg-gray-900/50 px-6 py-3 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-bold tracking-wider ${config.color}`}>
                  [{config.title}]
                </h2>
                <div className="text-gray-500 text-sm">
                  {results.length} ATHLETES
                </div>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-xl text-gray-400 mb-2">NO DATA AVAILABLE</p>
                <p className="text-gray-600 text-sm">
                  Results will be displayed when available
                </p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="bg-gray-900/50 px-6 py-3 border-b border-gray-700/50">
                  <div className="grid grid-cols-12 gap-4 text-gray-500 font-bold text-xs uppercase tracking-wider">
                    <SortableHeader column="rank" className="col-span-1 text-center">
                      RANK
                    </SortableHeader>
                    <SortableHeader column="bib" className="col-span-1 text-center">
                      BIB
                    </SortableHeader>
                    <SortableHeader column="athlete" className="col-span-4">
                      ATHLETE
                    </SortableHeader>
                    <SortableHeader column="shooting" className="col-span-2 text-center">
                      SHOOTING
                    </SortableHeader>
                    <SortableHeader column="time" className="col-span-2 text-center">
                      TIME
                    </SortableHeader>
                    <SortableHeader column="behind" className="col-span-2 text-center">
                      BEHIND
                    </SortableHeader>
                  </div>
                </div>

                {/* Results List */}
                <div className="divide-y divide-gray-800/50">
                  {getSortedResults().map((result, index) => {
                    const isTopThree =
                      typeof result.Rank === 'number' && result.Rank <= 3;

                    let rankDisplay = result.Rank || '-';
                    let rankColor = 'text-gray-400';
                    let rowBg = 'hover:bg-gray-800/30';

                    if (isTopThree && typeof result.Rank === 'number') {
                      rowBg = 'bg-gradient-to-r';
                      if (result.Rank === 1) {
                        rankDisplay = `🥇 ${result.Rank}`;
                        rankColor = 'text-yellow-400 font-bold';
                        rowBg +=
                          ' from-yellow-500/10 to-transparent hover:from-yellow-500/20';
                      } else if (result.Rank === 2) {
                        rankDisplay = `🥈 ${result.Rank}`;
                        rankColor = 'text-gray-300 font-bold';
                        rowBg +=
                          ' from-gray-500/10 to-transparent hover:from-gray-500/20';
                      } else if (result.Rank === 3) {
                        rankDisplay = `🥉 ${result.Rank}`;
                        rankColor = 'text-orange-400 font-bold';
                        rowBg +=
                          ' from-orange-500/10 to-transparent hover:from-orange-500/20';
                      }
                    }

                    return (
                      <div
                        key={result.IBUId || index}
                        className={`grid grid-cols-12 gap-4 px-6 py-4 transition-colors ${rowBg}`}
                      >
                        <div
                          className={`col-span-1 text-center font-bold ${rankColor}`}
                        >
                          {rankDisplay}
                        </div>
                        <div className="col-span-1 text-center text-gray-500">
                          #{result.Bib}
                        </div>
                        <div className="col-span-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {getFlagEmoji(result.Nat)}
                            </span>
                            <div>
                              <Link
                                href={`/${locale}/athlete/${result.IBUId}`}
                                className="hover:text-cyan-400 transition-colors"
                              >
                                <div className="font-semibold text-white hover:underline">
                                  {result.FamilyName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {result.GivenName}
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-800/50 text-cyan-400 font-mono text-sm border border-gray-700/50">
                            {result.ShootingTotal || '-'}
                          </span>
                        </div>
                        <div className="col-span-2 text-center font-mono text-white font-bold">
                          {result.TotalTime || '-'}
                        </div>
                        <div className="col-span-2 text-center text-gray-400 font-mono text-sm">
                          {result.Behind ? `+${result.Behind}` : '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'range' && <RangeAnalysisSection data={rangeAnalysis} />}
        {activeTab === 'course' && <CourseAnalysisSection data={courseAnalysis} />}
      </div>
    </div>
  );
}
