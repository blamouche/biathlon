'use client';

import { useState } from 'react';
import { PreTimesData } from '@/lib/types/biathlon';

interface PreTimesSectionProps {
  data: PreTimesData | null;
}

type SortDirection = 'asc' | 'desc';
type SortColumn = string | null; // can be 'bib', 'athlete', 'nat', 'position', or a checkpoint distance

export function PreTimesSection({ data }: PreTimesSectionProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  if (!data || !data.Athletes || data.Athletes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No pre-times data available for this race.</p>
      </div>
    );
  }

  const distanceToNumber = (distStr: string | null | undefined): number => {
    if (!distStr) return Infinity;
    // Convert "0.5km" to 0.5
    const match = distStr.match(/([0-9.]+)km/);
    if (match) {
      return parseFloat(match[1]);
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
      } else if (sortColumn === 'position') {
        aVal = a.CurrentDistance ?? Infinity;
        bVal = b.CurrentDistance ?? Infinity;
      } else {
        // Sorting by checkpoint distance
        aVal = distanceToNumber(a.PreTimes[sortColumn] || null);
        bVal = distanceToNumber(b.PreTimes[sortColumn] || null);
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
            <SortableHeader
              onClick={() => handleSort('position')}
              active={sortColumn === 'position'}
              direction={sortDirection}
              className="text-center sticky left-[310px] bg-gray-800 z-10"
            >
              POSITION
            </SortableHeader>
            {data.Points.map((point, index) => (
              <SortableHeader
                key={index}
                onClick={() => handleSort(point.Distance)}
                active={sortColumn === point.Distance}
                direction={sortDirection}
                className={`text-center whitespace-nowrap ${
                  point.Type === 'shooting'
                    ? 'bg-teal-600'
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
              <td className="border border-gray-700 px-2 py-2 text-center text-gray-100 sticky left-[310px] bg-inherit z-10">
                {athlete.CurrentDistance ? `${athlete.CurrentDistance}km` : '-'}
              </td>
              {data.Points.map((point, index) => (
                <td
                  key={index}
                  className="border border-gray-700 px-3 py-2 text-center text-gray-100"
                >
                  {athlete.PreTimes[point.Distance] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded">
        <p className="text-sm text-gray-300">
          <strong className="text-white">Note:</strong> Pre-times indicate the remaining distance before each checkpoint.
          For example, "0.5km" means the athlete is 500 meters from the checkpoint.
        </p>
      </div>
    </div>
  );
}
