'use client';

import { useState } from 'react';
import { IntermediatesData } from '@/lib/types/biathlon';

interface IntermediatesSectionProps {
  data: IntermediatesData | null;
}

type SortDirection = 'asc' | 'desc';
type SortColumn = string | null; // can be 'bib', 'athlete', 'nat', or a checkpoint distance

export function IntermediatesSection({ data }: IntermediatesSectionProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  if (!data || !data.Athletes || data.Athletes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No intermediate data available for this race.</p>
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
    return Infinity;
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

      if (sortColumn === 'bib') {
        aVal = a.Bib || 0;
        bVal = b.Bib || 0;
      } else if (sortColumn === 'athlete') {
        aVal = a.FamilyName?.toLowerCase() || '';
        bVal = b.FamilyName?.toLowerCase() || '';
      } else if (sortColumn === 'nat') {
        aVal = a.Nat?.toLowerCase() || '';
        bVal = b.Nat?.toLowerCase() || '';
      } else {
        // Sorting by checkpoint distance
        aVal = timeToSeconds(a.Splits[sortColumn] || null);
        bVal = timeToSeconds(b.Splits[sortColumn] || null);
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
      className={`border border-gray-700 px-2 py-2 cursor-pointer hover:bg-gray-700 transition-colors select-none ${className}`}
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
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800 text-gray-100">
            <SortableHeader
              onClick={() => handleSort('bib')}
              active={sortColumn === 'bib'}
              direction={sortDirection}
              className="text-left sticky left-0 bg-gray-800 z-10"
            >
              BIB
            </SortableHeader>
            <SortableHeader
              onClick={() => handleSort('athlete')}
              active={sortColumn === 'athlete'}
              direction={sortDirection}
              className="text-left sticky left-[60px] bg-gray-800 z-10"
            >
              ATHLETE
            </SortableHeader>
            <SortableHeader
              onClick={() => handleSort('nat')}
              active={sortColumn === 'nat'}
              direction={sortDirection}
              className="text-left sticky left-[250px] bg-gray-800 z-10"
            >
              NAT
            </SortableHeader>
            {data.Points.map((point, index) => (
              <SortableHeader
                key={index}
                onClick={() => handleSort(point.Distance)}
                active={sortColumn === point.Distance}
                direction={sortDirection}
                className={`text-center whitespace-nowrap ${
                  point.Type === 'shooting'
                    ? 'bg-blue-600'
                    : point.Type === 'finish'
                    ? 'bg-green-600'
                    : ''
                }`}
              >
                {point.Distance}
              </SortableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {getSortedData().map((athlete, idx) => (
            <tr
              key={athlete.IBUId}
              className={idx % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}
            >
              <td className="border border-gray-700 px-2 py-2 font-bold text-cyan-400 sticky left-0 bg-inherit z-10">
                {athlete.Bib}
              </td>
              <td className="border border-gray-700 px-2 py-2 sticky left-[60px] bg-inherit z-10">
                <div className="text-sm">
                  <div className="font-semibold text-white">
                    {athlete.FamilyName.toUpperCase()}
                  </div>
                  <div className="text-gray-400">{athlete.GivenName}</div>
                </div>
              </td>
              <td className="border border-gray-700 px-2 py-2 sticky left-[250px] bg-inherit z-10">
                <span className="font-semibold text-gray-100">{athlete.Nat}</span>
              </td>
              {data.Points.map((point, index) => (
                <td
                  key={index}
                  className="border border-gray-700 px-3 py-2 text-center text-gray-100"
                >
                  {athlete.Splits[point.Distance] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
