import { BiathlonAPI } from '@/lib/api/biathlon-api';

interface PageProps {
  params: Promise<{ locale: string; raceId: string }>;
}

export default async function CourseAnalysisDebugPage({ params }: PageProps) {
  const { raceId } = await params;

  // Tester tous les TypeIds possibles pour Course Analysis
  const typeIds = [
    'CRST1', 'CRST2', 'CRST3', 'CRST4', 'CRST5',
    'CRS1', 'CRS2', 'CRS3', 'CRS4', 'CRS5', 'CRS6', 'CRS7', 'CRS8', 'CRS9', 'CRS10', 'CRS11', 'CRS12',
    'CRST', 'SKIT'
  ];

  const results: Record<string, any> = {};

  for (const typeId of typeIds) {
    try {
      const data = await BiathlonAPI.getAnalyticResults(raceId, typeId);
      results[typeId] = data;
    } catch (error) {
      results[typeId] = { error: String(error) };
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Course Analysis Debug - Race {raceId}</h1>

      <div className="space-y-8">
        {Object.entries(results).map(([typeId, data]) => (
          <div key={typeId} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">{typeId}</h2>
            {data && data.Results && data.Results.length > 0 ? (
              <div>
                <p className="text-green-400 mb-2">✓ {data.Results.length} résultats disponibles</p>
                <details className="cursor-pointer">
                  <summary className="text-gray-400 hover:text-white">Afficher les données</summary>
                  <pre className="mt-2 text-xs bg-gray-950 p-4 rounded overflow-x-auto">
                    {JSON.stringify(data.Results.slice(0, 3), null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <p className="text-red-400">✗ Aucune donnée disponible</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-900 rounded">
        <p className="text-sm">
          Cette page liste tous les TypeIds testés pour la course analysis.
          Les TypeIds avec des données disponibles peuvent être utilisés dans getCourseAnalysis().
        </p>
      </div>
    </div>
  );
}
