'use client';

import { RangeAnalysisData } from '@/lib/types/biathlon';

interface RangeAnalysisSectionProps {
  data: RangeAnalysisData | null;
}

export function RangeAnalysisSection({ data }: RangeAnalysisSectionProps) {
  if (!data || !data.Athletes || data.Athletes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Aucune analyse des tirs disponible pour cette course.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shooting Times Section */}
        <div>
          <h3 className="text-lg font-bold bg-blue-900 text-white px-4 py-2 mb-2">
            TEMPS DE TIR (SHOOTING TIME)
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="border border-gray-300 px-2 py-1 text-left">BIB</th>
                <th className="border border-gray-300 px-2 py-1 text-left">ATHLETE</th>
                <th className="border border-gray-300 px-2 py-1 text-center">1</th>
                <th className="border border-gray-300 px-2 py-1 text-center">2</th>
                <th className="border border-gray-300 px-2 py-1 text-center">3</th>
                <th className="border border-gray-300 px-2 py-1 text-center">4</th>
                <th className="border border-gray-300 px-2 py-1 text-center bg-blue-700">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.Athletes.map((athlete, idx) => (
                <tr
                  key={`shoot-${athlete.IBUId}`}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="border border-gray-300 px-2 py-1 font-bold">
                    {athlete.Bib}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <div className="text-xs">
                      <span className="font-semibold">{athlete.FamilyName}</span>
                      <span className="ml-1 text-gray-600">{athlete.Nat}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.ShootingTime1 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.ShootingTime2 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.ShootingTime3 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.ShootingTime4 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center font-bold bg-blue-50">
                    {athlete.ShootingTotalTime || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Range Times Section */}
        <div>
          <h3 className="text-lg font-bold bg-green-900 text-white px-4 py-2 mb-2">
            TEMPS AU STAND (RANGE TIME)
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-green-800 text-white">
                <th className="border border-gray-300 px-2 py-1 text-left">BIB</th>
                <th className="border border-gray-300 px-2 py-1 text-left">ATHLETE</th>
                <th className="border border-gray-300 px-2 py-1 text-center">1</th>
                <th className="border border-gray-300 px-2 py-1 text-center">2</th>
                <th className="border border-gray-300 px-2 py-1 text-center">3</th>
                <th className="border border-gray-300 px-2 py-1 text-center">4</th>
                <th className="border border-gray-300 px-2 py-1 text-center bg-green-700">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.Athletes.map((athlete, idx) => (
                <tr
                  key={`range-${athlete.IBUId}`}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="border border-gray-300 px-2 py-1 font-bold">
                    {athlete.Bib}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <div className="text-xs">
                      <span className="font-semibold">{athlete.FamilyName}</span>
                      <span className="ml-1 text-gray-600">{athlete.Nat}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.RangeTime1 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.RangeTime2 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.RangeTime3 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {athlete.RangeTime4 || '-'}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center font-bold bg-green-50">
                    {athlete.RangeTotalTime || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Shooting Results Section */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold bg-yellow-900 text-white px-4 py-2 mb-2">
            RÉSULTATS DE TIR (SHOOTING RESULTS)
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-yellow-800 text-white">
                <th className="border border-gray-300 px-2 py-1 text-left">BIB</th>
                <th className="border border-gray-300 px-2 py-1 text-left">ATHLETE</th>
                <th className="border border-gray-300 px-2 py-1 text-left">NAT</th>
                <th className="border border-gray-300 px-2 py-1 text-center">STAND 1</th>
                <th className="border border-gray-300 px-2 py-1 text-center">STAND 2</th>
                <th className="border border-gray-300 px-2 py-1 text-center">STAND 3</th>
                <th className="border border-gray-300 px-2 py-1 text-center">STAND 4</th>
                <th className="border border-gray-300 px-2 py-1 text-center bg-yellow-700">ERREURS</th>
              </tr>
            </thead>
            <tbody>
              {data.Athletes.map((athlete, idx) => {
                const totalMisses = athlete.ShootingTotal ? parseInt(athlete.ShootingTotal) : 0;
                return (
                  <tr
                    key={`shooting-${athlete.IBUId}`}
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
                      {athlete.Shooting1 || '-'}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      {athlete.Shooting2 || '-'}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      {athlete.Shooting3 || '-'}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center">
                      {athlete.Shooting4 || '-'}
                    </td>
                    <td className={`border border-gray-300 px-2 py-1 text-center font-bold ${
                      totalMisses === 0 ? 'bg-green-100' : totalMisses > 3 ? 'bg-red-100' : 'bg-yellow-50'
                    }`}>
                      {athlete.ShootingTotal || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
