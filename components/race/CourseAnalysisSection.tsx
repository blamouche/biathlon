'use client';

import { CourseAnalysisData } from '@/lib/types/biathlon';

interface CourseAnalysisSectionProps {
  data: CourseAnalysisData | null;
}

export function CourseAnalysisSection({ data }: CourseAnalysisSectionProps) {
  if (!data || !data.Athletes || data.Athletes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No course analysis available for this race.</p>
      </div>
    );
  }

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
              <th className="border border-gray-700 px-2 py-1 text-left">BIB</th>
              <th className="border border-gray-700 px-2 py-1 text-left">ATHLETE</th>
              <th className="border border-gray-700 px-2 py-1 text-left">NAT</th>
              <th className="border border-gray-700 px-2 py-1 text-center">LAP 1</th>
              <th className="border border-gray-700 px-2 py-1 text-center">LAP 2</th>
              <th className="border border-gray-700 px-2 py-1 text-center">LAP 3</th>
              <th className="border border-gray-700 px-2 py-1 text-center">LAP 4</th>
              <th className="border border-gray-700 px-2 py-1 text-center">LAP 5</th>
              <th className="border border-gray-700 px-2 py-1 text-center bg-purple-600">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {data.Athletes.map((athlete, idx) => (
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
