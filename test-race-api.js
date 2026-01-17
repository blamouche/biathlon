// Test script pour vérifier les données de l'API pour la course BT2526SWRLCP05SMSP
const API_BASE = 'https://biathlonresults.com/modules/sportapi/api';
const RACE_ID = 'BT2526SWRLCP05SMSP';

async function testAnalyticResults() {
  console.log('🏁 Test des données analytiques pour:', RACE_ID);
  console.log('='.repeat(80));

  // Test des différents types d'analyse
  const typesToTest = [
    { id: 'S1TM', name: 'Shooting Time 1' },
    { id: 'S2TM', name: 'Shooting Time 2' },
    { id: 'RNG1', name: 'Range Time 1' },
    { id: 'RNG2', name: 'Range Time 2' },
    { id: 'STTM', name: 'Total Shooting Time' },
    { id: 'RNGT', name: 'Total Range Time' },
    { id: 'CRST1', name: 'Course Time 1' },
    { id: 'CRS1', name: 'Lap Time 1' },
    { id: 'CRST', name: 'Total Course Time' },
  ];

  for (const type of typesToTest) {
    console.log(`\n📊 Test: ${type.name} (${type.id})`);
    console.log('-'.repeat(80));

    try {
      const url = `${API_BASE}/AnalyticResults?RaceId=${RACE_ID}&TypeId=${type.id}`;
      console.log(`URL: ${url}`);

      const response = await fetch(url);
      console.log(`Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();

        if (data && data.Results && data.Results.length > 0) {
          console.log(`✅ Données trouvées: ${data.Results.length} résultats`);
          console.log('\nPremier résultat:');
          console.log(JSON.stringify(data.Results[0], null, 2));

          // Afficher les clés disponibles
          console.log('\nClés disponibles dans le résultat:');
          console.log(Object.keys(data.Results[0]));
        } else if (data && data.Results && data.Results.length === 0) {
          console.log('⚠️ Aucun résultat (tableau vide)');
        } else {
          console.log('⚠️ Structure de données inattendue:');
          console.log(JSON.stringify(data, null, 2).substring(0, 500));
        }
      } else {
        console.log(`❌ Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
    }
  }

  // Test des résultats de base
  console.log('\n\n📋 Test des résultats de base (/Results)');
  console.log('='.repeat(80));
  try {
    const url = `${API_BASE}/Results?RaceId=${RACE_ID}`;
    console.log(`URL: ${url}`);

    const response = await fetch(url);
    console.log(`Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();

      if (data && data.Results && data.Results.length > 0) {
        console.log(`✅ ${data.Results.length} athlètes trouvés`);
        console.log('\nPremier athlète:');
        console.log(JSON.stringify(data.Results[0], null, 2));
      } else {
        console.log('⚠️ Aucun résultat');
      }
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

testAnalyticResults().catch(console.error);
