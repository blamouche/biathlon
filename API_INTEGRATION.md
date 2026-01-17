# Intégration API BiathlonResults.com

## Problème identifié

Les endpoints API utilisés initialement (`/Intermediates`, `/RangeAnalysis`, `/CourseAnalysis`, `/PreTimes`) étaient hypothétiques et n'existent pas dans l'API publique de biathlonresults.com.

## Solution implémentée

### Endpoint réel : `/AnalyticResults`

L'API biathlonresults.com expose un seul endpoint pour toutes les données analytiques:

```
https://biathlonresults.com/modules/sportapi/api/AnalyticResults?RaceId={raceId}&TypeId={typeId}
```

### Types d'analyse disponibles (TypeId)

Basé sur le wrapper Python officiel [prtkv/biathlonresults](https://github.com/prtkv/biathlonresults):

#### Temps de tir (Shooting Time)
- `S1TM` - Temps de tir au stand 1
- `S2TM` - Temps de tir au stand 2
- `S3TM` - Temps de tir au stand 3
- `S4TM` - Temps de tir au stand 4
- `STTM` - Temps total de tir

#### Temps au stand (Range Time)
- `RNG1` - Temps total au stand 1 (entrée + tir + sortie)
- `RNG2` - Temps total au stand 2
- `RNG3` - Temps total au stand 3
- `RNG4` - Temps total au stand 4
- `RNGT` - Temps total au stand

#### Temps de parcours (Course Time)
- `CRST1` à `CRST4` - Temps de parcours par leg
- `CRS1` à `CRS12` - Temps de parcours par tour
- `CRST` - Temps total de parcours
- `SKIT` - Temps total de ski

#### Autres
- `PURS` - Temps de poursuite
- `FI1L` à `FI4L` - Résultats par leg

## Implémentation

### 1. Méthode générique

```typescript
static async getAnalyticResults(raceId: string, typeId: string): Promise<any>
```

Cette méthode appelle l'endpoint `/AnalyticResults` avec le `typeId` spécifié.

### 2. Range Analysis

```typescript
static async getRangeAnalysis(raceId: string): Promise<RangeAnalysisData | null>
```

Cette méthode:
1. Effectue 10 appels API en parallèle pour récupérer:
   - 4 temps de tir (S1TM à S4TM)
   - 4 temps au stand (RNG1 à RNG4)
   - Temps total de tir (STTM)
   - Temps total au stand (RNGT)
2. Fusionne toutes les données par athlète (IBUId)
3. Ajoute les résultats de tir depuis `/Results`

### 3. Course Analysis

```typescript
static async getCourseAnalysis(raceId: string): Promise<CourseAnalysisData | null>
```

Cette méthode:
1. Récupère les temps de parcours (CRST1-5) et temps de tour (CRS1-5)
2. Fusionne les données par athlète
3. Inclut le temps total de parcours (CRST)

### 4. Intermediates

```typescript
static async getIntermediates(raceId: string): Promise<IntermediatesData | null>
```

Préparé pour récupérer les temps intermédiaires (CRS1-12), mais nécessite plus de travail pour formatter correctement les données.

### 5. Pre-Times

```typescript
static async getPreTimes(raceId: string): Promise<PreTimesData | null>
```

Retourne `null` car cette fonctionnalité n'est pas disponible via l'API publique.

## Format des données retournées

L'API retourne des objets avec cette structure:

```json
{
  "Results": [
    {
      "IBUId": "BTFRA11512199501",
      "Bib": 1,
      "FamilyName": "JACQUELIN",
      "GivenName": "Emilien",
      "Nat": "FRA",
      "Value": "26.4",    // ou "Result"
      "Rank": 1,
      "Behind": "0.0"
    },
    ...
  ]
}
```

## Test

Pour tester avec une course en direct:

1. Visitez une page de course live (ex: `http://localhost:3000/fr/event/BT2526SWRLCP__SWMS/race/BT2526SWRLCP05SWMS`)

2. Cliquez sur les onglets:
   - **RANGE ANALYSIS** - Devrait afficher les temps de tir et au stand
   - **COURSE ANALYSIS** - Devrait afficher les temps de parcours et de tour
   - **INTERMEDIATES** - Non implémenté (retourne "Aucune donnée")
   - **PRE-TIMES** - Non disponible (retourne "Aucune donnée")

3. Vérifiez la console du navigateur pour les éventuels messages d'erreur

## Debugging

Pour voir les données brutes de l'API, ajoutez des `console.log` dans les méthodes:

```typescript
const data = await response.json();
console.log('AnalyticResults response:', typeId, data);
return data;
```

## Prochaines étapes

1. **Tester avec une vraie course live** - Vérifier que les données remontent correctement
2. **Adapter le format des données** - Ajuster les interfaces TypeScript si le format diffère
3. **Implémenter Intermediates** - Formatter correctement les données CRS1-12 pour afficher les temps intermédiaires
4. **Optimisation** - Réduire le nombre d'appels API si possible (certains typeId peuvent retourner plusieurs valeurs)
5. **Cache** - Vérifier que le cache de 60s fonctionne correctement pour les données live

## Références

- [Wrapper Python biathlonresults](https://github.com/prtkv/biathlonresults)
- [Fichier consts.py avec les TypeId](https://github.com/prtkv/biathlonresults/blob/master/biathlonresults/consts.py)
- [Wrapper R biathlonResults](https://github.com/thieled/biathlonResults)
