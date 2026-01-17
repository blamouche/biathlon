'use client';

import { IntermediatesData } from '@/lib/types/biathlon';

interface IntermediatesSectionProps {
  data: IntermediatesData | null;
}

export function IntermediatesSection({ data }: IntermediatesSectionProps) {
  if (!data || !data.Athletes || data.Athletes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Aucune donnée intermédiaire disponible pour cette course.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-900 text-white">
            <th className="border border-gray-300 px-2 py-2 text-left sticky left-0 bg-blue-900 z-10">
              BIB
            </th>
            <th className="border border-gray-300 px-2 py-2 text-left sticky left-[60px] bg-blue-900 z-10">
              ATHLETE
            </th>
            <th className="border border-gray-300 px-2 py-2 text-left sticky left-[250px] bg-blue-900 z-10">
              NAT
            </th>
            {data.Points.map((point, index) => (
              <th
                key={index}
                className={`border border-gray-300 px-3 py-2 text-center whitespace-nowrap ${
                  point.Type === 'shooting'
                    ? 'bg-blue-800'
                    : point.Type === 'finish'
                    ? 'bg-green-800'
                    : ''
                }`}
              >
                {point.Distance}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.Athletes.map((athlete, idx) => (
            <tr
              key={athlete.IBUId}
              className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="border border-gray-300 px-2 py-2 font-bold sticky left-0 bg-inherit z-10">
                {athlete.Bib}
              </td>
              <td className="border border-gray-300 px-2 py-2 sticky left-[60px] bg-inherit z-10">
                <div className="text-sm">
                  <div className="font-semibold">
                    {athlete.FamilyName.toUpperCase()}
                  </div>
                  <div className="text-gray-600">{athlete.GivenName}</div>
                </div>
              </td>
              <td className="border border-gray-300 px-2 py-2 sticky left-[250px] bg-inherit z-10">
                <span className="font-semibold">{athlete.Nat}</span>
              </td>
              {data.Points.map((point, index) => (
                <td
                  key={index}
                  className="border border-gray-300 px-3 py-2 text-center"
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
