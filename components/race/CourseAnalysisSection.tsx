'use client';

import { CourseAnalysisData } from '@/lib/types/biathlon';

interface CourseAnalysisSectionProps {
  data: CourseAnalysisData | null;
}

export function CourseAnalysisSection({ data }: CourseAnalysisSectionProps) {
  if (!data || !data.Athletes || data.Athletes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Aucune analyse de parcours disponible pour cette course.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-1 gap-6">
        {/* Course Times Section */}
        <div>
          <h3 className="text-lg font-bold bg-indigo-900 text-white px-4 py-2 mb-2">
            TEMPS DE PARCOURS (COURSE TIME)
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-indigo-800 text-white">
                <th className="border border-gray-300 px-2 py-1 text-left">BIB</th>
                <th className="border border-gray-300 px-2 py-1 text-left">ATHLETE</th>
                <th className="border border-gray-300 px-2 py-1 text-left">NAT</th>
                <th className="border border-gray-300 px-2 py-1 text-center">COURSE 1</th>
                <th className="border border-gray-300 px-2 py-1 text-center">COURSE 2</th>
                <th className="border border-gray-300 px-2 py-1 text-center">COURSE 3</th>
                <th className="border border-gray-300 px-2 py-1 text-center">COURSE 4</th>
                <th className="border border-gray-300 px-2 py-1 text-center">COURSE 5</th>
                <th className="border border-gray-300 px-2 py-1 text-center bg-indigo-700">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.Athletes.map((athlete, idx) => (
                <tr
                  key={`course-${athlete.IBUId}`}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="border border-gray-300 px-2 py-1 font-bold">
                    {athlete.Bib}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <div className="text-xs">
                      <div className="font-semibold">{athlete.FamilyName.toUpperCase()}</div>
                      <div className="text-gray-600">{athlete.GivenName}</div>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <span className="font-semibold">{athlete.Nat}</span>
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.CourseTime1 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.CourseTime2 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.CourseTime3 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.CourseTime4 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.CourseTime5 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center font-bold bg-indigo-50">
                    {athlete.CourseTotalTime || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lap Times Section */}
        <div>
          <h3 className="text-lg font-bold bg-purple-900 text-white px-4 py-2 mb-2">
            TEMPS DE TOUR (LAP TIME)
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-purple-800 text-white">
                <th className="border border-gray-300 px-2 py-1 text-left">BIB</th>
                <th className="border border-gray-300 px-2 py-1 text-left">ATHLETE</th>
                <th className="border border-gray-300 px-2 py-1 text-left">NAT</th>
                <th className="border border-gray-300 px-2 py-1 text-center">LAP 1</th>
                <th className="border border-gray-300 px-2 py-1 text-center">LAP 2</th>
                <th className="border border-gray-300 px-2 py-1 text-center">LAP 3</th>
                <th className="border border-gray-300 px-2 py-1 text-center">LAP 4</th>
                <th className="border border-gray-300 px-2 py-1 text-center">LAP 5</th>
              </tr>
            </thead>
            <tbody>
              {data.Athletes.map((athlete, idx) => (
                <tr
                  key={`lap-${athlete.IBUId}`}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="border border-gray-300 px-2 py-1 font-bold">
                    {athlete.Bib}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <div className="text-xs">
                      <div className="font-semibold">{athlete.FamilyName.toUpperCase()}</div>
                      <div className="text-gray-600">{athlete.GivenName}</div>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <span className="font-semibold">{athlete.Nat}</span>
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.LapTime1 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.LapTime2 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.LapTime3 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.LapTime4 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.LapTime5 || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
