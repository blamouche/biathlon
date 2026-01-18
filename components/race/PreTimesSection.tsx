'use client';

import { PreTimesData } from '@/lib/types/biathlon';

interface PreTimesSectionProps {
  data: PreTimesData | null;
}

export function PreTimesSection({ data }: PreTimesSectionProps) {
  if (!data || !data.Athletes || data.Athletes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No pre-times data available for this race.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800 text-gray-100">
            <th className="border border-gray-700 px-2 py-2 text-left sticky left-0 bg-gray-800 z-10">
              BIB
            </th>
            <th className="border border-gray-700 px-2 py-2 text-left sticky left-[60px] bg-gray-800 z-10">
              ATHLETE
            </th>
            <th className="border border-gray-700 px-2 py-2 text-left sticky left-[250px] bg-gray-800 z-10">
              NAT
            </th>
            <th className="border border-gray-700 px-2 py-2 text-center sticky left-[310px] bg-gray-800 z-10">
              POSITION
            </th>
            {data.Points.map((point, index) => (
              <th
                key={index}
                className={`border border-gray-700 px-3 py-2 text-center whitespace-nowrap ${
                  point.Type === 'shooting'
                    ? 'bg-teal-600'
                    : point.Type === 'finish'
                    ? 'bg-green-600'
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
