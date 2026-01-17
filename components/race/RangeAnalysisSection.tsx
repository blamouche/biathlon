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
    <div className="overflow-x-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shooting Times Section */}
        <div>
          <h3 className="text-lg font-bold bg-blue-600 text-white px-4 py-2 mb-2 rounded-t">
            TEMPS DE TIR (SHOOTING TIME)
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-gray-100">
                <th className="border border-gray-700 px-2 py-1 text-left">BIB</th>
                <th className="border border-gray-700 px-2 py-1 text-left">ATHLETE</th>
                <th className="border border-gray-700 px-2 py-1 text-center">1</th>
                <th className="border border-gray-700 px-2 py-1 text-center">2</th>
                <th className="border border-gray-700 px-2 py-1 text-center">3</th>
                <th className="border border-gray-700 px-2 py-1 text-center">4</th>
                <th className="border border-gray-700 px-2 py-1 text-center bg-blue-600">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.Athletes.map((athlete, idx) => (
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
            TEMPS AU STAND (RANGE TIME)
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-gray-100">
                <th className="border border-gray-700 px-2 py-1 text-left">BIB</th>
                <th className="border border-gray-700 px-2 py-1 text-left">ATHLETE</th>
                <th className="border border-gray-700 px-2 py-1 text-center">1</th>
                <th className="border border-gray-700 px-2 py-1 text-center">2</th>
                <th className="border border-gray-700 px-2 py-1 text-center">3</th>
                <th className="border border-gray-700 px-2 py-1 text-center">4</th>
                <th className="border border-gray-700 px-2 py-1 text-center bg-green-600">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.Athletes.map((athlete, idx) => (
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
            RÉSULTATS DE TIR (SHOOTING RESULTS)
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-gray-100">
                <th className="border border-gray-700 px-2 py-1 text-left">BIB</th>
                <th className="border border-gray-700 px-2 py-1 text-left">ATHLETE</th>
                <th className="border border-gray-700 px-2 py-1 text-left">NAT</th>
                <th className="border border-gray-700 px-2 py-1 text-center">TIRS (P+S)</th>
                <th className="border border-gray-700 px-2 py-1 text-center bg-yellow-600">ERREURS</th>
              </tr>
            </thead>
            <tbody>
              {data.Athletes.map((athlete, idx) => {
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
              <strong className="text-white">Format TIRS:</strong> Les résultats de tir sont affichés au format "P+S"
              (Prone/Couché + Standing/Debout). Par exemple, "0+1" signifie 0 erreur en position couchée et 1 erreur en position debout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
