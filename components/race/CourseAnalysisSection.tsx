'use client';

import { useState } from 'react';
import { CourseAnalysisData } from '@/lib/types/biathlon';

interface CourseAnalysisSectionProps {
  data: CourseAnalysisData | null;
}

type SortDirection = 'asc' | 'desc';
type SortColumn = 'bib' | 'athlete' | 'nat' | 'lap1' | 'lap2' | 'lap3' | 'lap4' | 'lap5' | 'total' | null;

export function CourseAnalysisSection({ data }: CourseAnalysisSectionProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  if (!data || !data.Athletes || data.Athletes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No course analysis available for this race.</p>
      </div>
    );
  }

  const timeToSeconds = (timeStr: string | null | undefined): number => {
    if (!timeStr) return Infinity;
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const [mins, secs] = parts;
      return parseInt(mins) * 60 + parseFloat(secs);
    }
    // Handle times that are already in seconds (e.g., "41.9")
    const numValue = parseFloat(timeStr);
    return isNaN(numValue) ? Infinity : numValue;
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortedData = () => {
    if (!sortColumn) return data.Athletes;

    return [...data.Athletes].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortColumn) {
        case 'bib':
          aVal = Number(a.Bib) || 0;
          bVal = Number(b.Bib) || 0;
          break;
        case 'athlete':
          aVal = a.FamilyName?.toLowerCase() || '';
          bVal = b.FamilyName?.toLowerCase() || '';
          break;
        case 'nat':
          aVal = a.Nat?.toLowerCase() || '';
          bVal = b.Nat?.toLowerCase() || '';
          break;
        case 'lap1':
          aVal = timeToSeconds(a.LapTime1);
          bVal = timeToSeconds(b.LapTime1);
          break;
        case 'lap2':
          aVal = timeToSeconds(a.LapTime2);
          bVal = timeToSeconds(b.LapTime2);
          break;
        case 'lap3':
          aVal = timeToSeconds(a.LapTime3);
          bVal = timeToSeconds(b.LapTime3);
          break;
        case 'lap4':
          aVal = timeToSeconds(a.LapTime4);
          bVal = timeToSeconds(b.LapTime4);
          break;
        case 'lap5':
          aVal = timeToSeconds(a.LapTime5);
          bVal = timeToSeconds(b.LapTime5);
          break;
        case 'total':
          aVal = timeToSeconds(a.CourseTotalTime);
          bVal = timeToSeconds(b.CourseTotalTime);
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const SortableHeader = ({
    onClick,
    active,
    direction,
    children,
    className = ''
  }: {
    onClick: () => void;
    active: boolean;
    direction: SortDirection;
    children: React.ReactNode;
    className?: string
  }) => (
    <th
      onClick={onClick}
      className={`border border-gray-700 px-2 py-1 cursor-pointer hover:bg-gray-700 transition-colors select-none ${className}`}
    >
      {children}
      {active && (
        <span className="ml-1 text-cyan-400">
          {direction === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </th>
  );

  return (
    <div className="overflow-x-auto p-6">
      {/* Lap Times Section */}
      <div>
        <h3 className="text-lg font-bold bg-purple-600 text-white px-4 py-2 mb-2 rounded-t">
          LAP TIME
        </h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-800 text-gray-100">
              <SortableHeader
                onClick={() => handleSort('bib')}
                active={sortColumn === 'bib'}
                direction={sortDirection}
                className="text-left"
              >
                BIB
              </SortableHeader>
              <SortableHeader
                onClick={() => handleSort('athlete')}
                active={sortColumn === 'athlete'}
                direction={sortDirection}
                className="text-left"
              >
                ATHLETE
              </SortableHeader>
              <SortableHeader
                onClick={() => handleSort('nat')}
                active={sortColumn === 'nat'}
                direction={sortDirection}
                className="text-left"
              >
                NAT
              </SortableHeader>
              <SortableHeader
                onClick={() => handleSort('lap1')}
                active={sortColumn === 'lap1'}
                direction={sortDirection}
                className="text-center"
              >
                LAP 1
              </SortableHeader>
              <SortableHeader
                onClick={() => handleSort('lap2')}
                active={sortColumn === 'lap2'}
                direction={sortDirection}
                className="text-center"
              >
                LAP 2
              </SortableHeader>
              <SortableHeader
                onClick={() => handleSort('lap3')}
                active={sortColumn === 'lap3'}
                direction={sortDirection}
                className="text-center"
              >
                LAP 3
              </SortableHeader>
              <SortableHeader
                onClick={() => handleSort('lap4')}
                active={sortColumn === 'lap4'}
                direction={sortDirection}
                className="text-center"
              >
                LAP 4
              </SortableHeader>
              <SortableHeader
                onClick={() => handleSort('lap5')}
                active={sortColumn === 'lap5'}
                direction={sortDirection}
                className="text-center"
              >
                LAP 5
              </SortableHeader>
              <SortableHeader
                onClick={() => handleSort('total')}
                active={sortColumn === 'total'}
                direction={sortDirection}
                className="text-center bg-purple-600"
              >
                TOTAL
              </SortableHeader>
            </tr>
          </thead>
          <tbody>
            {getSortedData().map((athlete, idx) => (
              <tr
                key={`lap-${athlete.IBUId}`}
                className={idx % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}
              >
                <td className="border border-gray-700 px-2 py-1 font-bold text-cyan-400">
                  {athlete.Bib}
                </td>
                <td className="border border-gray-700 px-2 py-1">
                  <div className="text-xs">
                    <div className="font-semibold text-white">{athlete.FamilyName.toUpperCase()}</div>
                    <div className="text-gray-400">{athlete.GivenName}</div>
                  </div>
                </td>
                <td className="border border-gray-700 px-2 py-1">
                  <span className="font-semibold text-gray-100">{athlete.Nat}</span>
                </td>
                <td className="border border-gray-700 px-2 py-1 text-center text-gray-100">
                  {athlete.LapTime1 || '-'}
                </td>
                <td className="border border-gray-700 px-2 py-1 text-center text-gray-100">
                  {athlete.LapTime2 || '-'}
                </td>
                <td className="border border-gray-700 px-2 py-1 text-center text-gray-100">
                  {athlete.LapTime3 || '-'}
                </td>
                <td className="border border-gray-700 px-2 py-1 text-center text-gray-100">
                  {athlete.LapTime4 || '-'}
                </td>
                <td className="border border-gray-700 px-2 py-1 text-center text-gray-100">
                  {athlete.LapTime5 || '-'}
                </td>
                <td className="border border-gray-700 px-2 py-1 text-center font-bold bg-purple-900 text-purple-200">
                  {athlete.CourseTotalTime || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
