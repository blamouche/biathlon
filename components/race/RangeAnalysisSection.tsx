'use client';

import { useState } from 'react';
import { RangeAnalysisData } from '@/lib/types/biathlon';

interface RangeAnalysisSectionProps {
  data: RangeAnalysisData | null;
}

type SortDirection = 'asc' | 'desc';
type ShootingSortColumn = 'bib' | 'athlete' | 'shoot1' | 'shoot2' | 'shoot3' | 'shoot4' | 'total' | null;
type RangeSortColumn = 'bib' | 'athlete' | 'range1' | 'range2' | 'range3' | 'range4' | 'total' | null;
type ResultsSortColumn = 'bib' | 'athlete' | 'nat' | 'shots' | 'misses' | null;

export function RangeAnalysisSection({ data }: RangeAnalysisSectionProps) {
  const [shootingSortColumn, setShootingSortColumn] = useState<ShootingSortColumn>(null);
  const [shootingSortDirection, setShootingSortDirection] = useState<SortDirection>('asc');
  const [rangeSortColumn, setRangeSortColumn] = useState<RangeSortColumn>(null);
  const [rangeSortDirection, setRangeSortDirection] = useState<SortDirection>('asc');
  const [resultsSortColumn, setResultsSortColumn] = useState<ResultsSortColumn>(null);
  const [resultsSortDirection, setResultsSortDirection] = useState<SortDirection>('asc');

  if (!data || !data.Athletes || data.Athletes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No shooting analysis available for this race.</p>
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

  const handleShootingSort = (column: ShootingSortColumn) => {
    if (shootingSortColumn === column) {
      setShootingSortDirection(shootingSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setShootingSortColumn(column);
      setShootingSortDirection('asc');
    }
  };

  const handleRangeSort = (column: RangeSortColumn) => {
    if (rangeSortColumn === column) {
      setRangeSortDirection(rangeSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setRangeSortColumn(column);
      setRangeSortDirection('asc');
    }
  };

  const handleResultsSort = (column: ResultsSortColumn) => {
    if (resultsSortColumn === column) {
      setResultsSortDirection(resultsSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setResultsSortColumn(column);
      setResultsSortDirection('asc');
    }
  };

  const getSortedShootingData = () => {
    if (!shootingSortColumn) return data.Athletes;

    return [...data.Athletes].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (shootingSortColumn) {
        case 'bib':
          aVal = Number(a.Bib) || 0;
          bVal = Number(b.Bib) || 0;
          break;
        case 'athlete':
          aVal = a.FamilyName?.toLowerCase() || '';
          bVal = b.FamilyName?.toLowerCase() || '';
          break;
        case 'shoot1':
          aVal = timeToSeconds(a.ShootingTime1);
          bVal = timeToSeconds(b.ShootingTime1);
          break;
        case 'shoot2':
          aVal = timeToSeconds(a.ShootingTime2);
          bVal = timeToSeconds(b.ShootingTime2);
          break;
        case 'shoot3':
          aVal = timeToSeconds(a.ShootingTime3);
          bVal = timeToSeconds(b.ShootingTime3);
          break;
        case 'shoot4':
          aVal = timeToSeconds(a.ShootingTime4);
          bVal = timeToSeconds(b.ShootingTime4);
          break;
        case 'total':
          aVal = timeToSeconds(a.ShootingTotalTime);
          bVal = timeToSeconds(b.ShootingTotalTime);
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return shootingSortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return shootingSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getSortedRangeData = () => {
    if (!rangeSortColumn) return data.Athletes;

    return [...data.Athletes].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (rangeSortColumn) {
        case 'bib':
          aVal = Number(a.Bib) || 0;
          bVal = Number(b.Bib) || 0;
          break;
        case 'athlete':
          aVal = a.FamilyName?.toLowerCase() || '';
          bVal = b.FamilyName?.toLowerCase() || '';
          break;
        case 'range1':
          aVal = timeToSeconds(a.RangeTime1);
          bVal = timeToSeconds(b.RangeTime1);
          break;
        case 'range2':
          aVal = timeToSeconds(a.RangeTime2);
          bVal = timeToSeconds(b.RangeTime2);
          break;
        case 'range3':
          aVal = timeToSeconds(a.RangeTime3);
          bVal = timeToSeconds(b.RangeTime3);
          break;
        case 'range4':
          aVal = timeToSeconds(a.RangeTime4);
          bVal = timeToSeconds(b.RangeTime4);
          break;
        case 'total':
          aVal = timeToSeconds(a.RangeTotalTime);
          bVal = timeToSeconds(b.RangeTotalTime);
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return rangeSortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return rangeSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getSortedResultsData = () => {
    if (!resultsSortColumn) return data.Athletes;

    return [...data.Athletes].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (resultsSortColumn) {
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
        case 'shots':
          aVal = a.Shootings || '';
          bVal = b.Shootings || '';
          break;
        case 'misses':
          aVal = parseInt(a.ShootingTotal || '99');
          bVal = parseInt(b.ShootingTotal || '99');
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return resultsSortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return resultsSortDirection === 'asc' ? 1 : -1;
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shooting Times Section */}
        <div>
          <h3 className="text-lg font-bold bg-blue-600 text-white px-4 py-2 mb-2 rounded-t">
            SHOOTING TIME
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-gray-100">
                <SortableHeader
                  onClick={() => handleShootingSort('bib')}
                  active={shootingSortColumn === 'bib'}
                  direction={shootingSortDirection}
                  className="text-left"
                >
                  BIB
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleShootingSort('athlete')}
                  active={shootingSortColumn === 'athlete'}
                  direction={shootingSortDirection}
                  className="text-left"
                >
                  ATHLETE
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleShootingSort('shoot1')}
                  active={shootingSortColumn === 'shoot1'}
                  direction={shootingSortDirection}
                  className="text-center"
                >
                  1
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleShootingSort('shoot2')}
                  active={shootingSortColumn === 'shoot2'}
                  direction={shootingSortDirection}
                  className="text-center"
                >
                  2
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleShootingSort('shoot3')}
                  active={shootingSortColumn === 'shoot3'}
                  direction={shootingSortDirection}
                  className="text-center"
                >
                  3
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleShootingSort('shoot4')}
                  active={shootingSortColumn === 'shoot4'}
                  direction={shootingSortDirection}
                  className="text-center"
                >
                  4
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleShootingSort('total')}
                  active={shootingSortColumn === 'total'}
                  direction={shootingSortDirection}
                  className="text-center bg-blue-600"
                >
                  TOTAL
                </SortableHeader>
              </tr>
            </thead>
            <tbody>
              {getSortedShootingData().map((athlete, idx) => (
                <tr
                  key={`shoot-${athlete.IBUId}`}
                  className={idx % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}
                >
                  <td className="border border-gray-700 px-2 py-1 font-bold text-cyan-400">
                    {athlete.Bib}
                  </td>
                  <td className="border border-gray-700 px-2 py-1">
                    <div className="text-xs">
                      <span className="font-semibold text-white">{athlete.FamilyName}</span>
                      <span className="ml-1 text-gray-400">{athlete.Nat}</span>
                    </div>
                  </td>
                  <td className="border border-gray-700 px-2 py-1 text-center text-gray-100">
                    {athlete.ShootingTime1 || '-'}
                  </td>
                  <td className="border border-gray-700 px-2 py-1 text-center text-gray-100">
                    {athlete.ShootingTime2 || '-'}
                  </td>
                  <td className="border border-gray-700 px-2 py-1 text-center text-gray-100">
                    {athlete.ShootingTime3 || '-'}
                  </td>
                  <td className="border border-gray-700 px-2 py-1 text-center text-gray-100">
                    {athlete.ShootingTime4 || '-'}
                  </td>
                  <td className="border border-gray-700 px-2 py-1 text-center font-bold bg-blue-900 text-blue-200">
                    {athlete.ShootingTotalTime || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Range Times Section */}
        <div>
          <h3 className="text-lg font-bold bg-green-600 text-white px-4 py-2 mb-2 rounded-t">
            RANGE TIME
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-gray-100">
                <SortableHeader
                  onClick={() => handleRangeSort('bib')}
                  active={rangeSortColumn === 'bib'}
                  direction={rangeSortDirection}
                  className="text-left"
                >
                  BIB
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleRangeSort('athlete')}
                  active={rangeSortColumn === 'athlete'}
                  direction={rangeSortDirection}
                  className="text-left"
                >
                  ATHLETE
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleRangeSort('range1')}
                  active={rangeSortColumn === 'range1'}
                  direction={rangeSortDirection}
                  className="text-center"
                >
                  1
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleRangeSort('range2')}
                  active={rangeSortColumn === 'range2'}
                  direction={rangeSortDirection}
                  className="text-center"
                >
                  2
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleRangeSort('range3')}
                  active={rangeSortColumn === 'range3'}
                  direction={rangeSortDirection}
                  className="text-center"
                >
                  3
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleRangeSort('range4')}
                  active={rangeSortColumn === 'range4'}
                  direction={rangeSortDirection}
                  className="text-center"
                >
                  4
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleRangeSort('total')}
                  active={rangeSortColumn === 'total'}
                  direction={rangeSortDirection}
                  className="text-center bg-green-600"
                >
                  TOTAL
                </SortableHeader>
              </tr>
            </thead>
            <tbody>
              {getSortedRangeData().map((athlete, idx) => (
                <tr
                  key={`range-${athlete.IBUId}`}
                  className={idx % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}
                >
                  <td className="border border-gray-700 px-2 py-1 font-bold text-cyan-400">
                    {athlete.Bib}
                  </td>
                  <td className="border border-gray-700 px-2 py-1">
                    <div className="text-xs">
                      <span className="font-semibold text-white">{athlete.FamilyName}</span>
                      <span className="ml-1 text-gray-400">{athlete.Nat}</span>
                    </div>
                  </td>
                  <td className="border border-gray-700 px-2 py-1 text-center text-gray-100">
                    {athlete.RangeTime1 || '-'}
                  </td>
                  <td className="border border-gray-700 px-2 py-1 text-center text-gray-100">
                    {athlete.RangeTime2 || '-'}
                  </td>
                  <td className="border border-gray-700 px-2 py-1 text-center text-gray-100">
                    {athlete.RangeTime3 || '-'}
                  </td>
                  <td className="border border-gray-700 px-2 py-1 text-center text-gray-100">
                    {athlete.RangeTime4 || '-'}
                  </td>
                  <td className="border border-gray-700 px-2 py-1 text-center font-bold bg-green-900 text-green-200">
                    {athlete.RangeTotalTime || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Shooting Results Section */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold bg-yellow-600 text-white px-4 py-2 mb-2 rounded-t">
            SHOOTING RESULTS
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-gray-100">
                <SortableHeader
                  onClick={() => handleResultsSort('bib')}
                  active={resultsSortColumn === 'bib'}
                  direction={resultsSortDirection}
                  className="text-left"
                >
                  BIB
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleResultsSort('athlete')}
                  active={resultsSortColumn === 'athlete'}
                  direction={resultsSortDirection}
                  className="text-left"
                >
                  ATHLETE
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleResultsSort('nat')}
                  active={resultsSortColumn === 'nat'}
                  direction={resultsSortDirection}
                  className="text-left"
                >
                  NAT
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleResultsSort('shots')}
                  active={resultsSortColumn === 'shots'}
                  direction={resultsSortDirection}
                  className="text-center"
                >
                  SHOTS (P+S)
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleResultsSort('misses')}
                  active={resultsSortColumn === 'misses'}
                  direction={resultsSortDirection}
                  className="text-center bg-yellow-600"
                >
                  MISSES
                </SortableHeader>
              </tr>
            </thead>
            <tbody>
              {getSortedResultsData().map((athlete, idx) => {
                const totalMisses = athlete.ShootingTotal ? parseInt(athlete.ShootingTotal) : 0;
                return (
                  <tr
                    key={`shooting-${athlete.IBUId}`}
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
                      {athlete.Shootings || '-'}
                    </td>
                    <td className={`border border-gray-700 px-2 py-1 text-center font-bold ${
                      totalMisses === 0 ? 'bg-green-900 text-green-200' : totalMisses > 3 ? 'bg-red-900 text-red-200' : 'bg-yellow-900 text-yellow-200'
                    }`}>
                      {athlete.ShootingTotal || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded">
            <p className="text-sm text-gray-300">
              <strong className="text-white">SHOOTING FORMAT:</strong> Shooting results are displayed in "P+S" format
              (Prone + Standing). For example, "0+1" means 0 misses in prone position and 1 miss in standing position.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
