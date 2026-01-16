# Biathlon World Cup Tracker 🎿

Une application moderne pour suivre les compétitions de biathlon de la Coupe du Monde en temps réel.

## Fonctionnalités

- 📅 **Vue d'ensemble des étapes** : Consultez toutes les étapes de la Coupe du Monde de biathlon
- 🏆 **Détails des compétitions** : Accédez aux informations détaillées de chaque course
- ⏰ **Liste de départ** : Pour les courses à venir
- 🔴 **Résultats en direct** : Suivez les courses en cours en temps réel
- 🏁 **Résultats finaux** : Consultez les classements des courses terminées
- 🎨 **Interface moderne** : Design élégant et responsive avec support du mode sombre

## Technologies utilisées

- **Next.js 16** : Framework React avec App Router
- **TypeScript** : Pour un code type-safe
- **Tailwind CSS** : Pour un design moderne et responsive
- **API biathlonresults.com** : Données officielles du biathlon

## Installation

1. Clonez le repository
```bash
git clone <repository-url>
cd biathlon
```

2. Installez les dépendances
```bash
npm install
```

3. Lancez le serveur de développement
```bash
npm run dev
```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm start` : Lance l'application en mode production
- `npm run lint` : Vérifie le code avec ESLint

## Structure du projet

```
biathlon/
├── app/                          # Pages Next.js (App Router)
│   ├── event/                    # Pages des événements
│   │   └── [eventId]/           # Détails d'un événement
│   │       └── race/            # Pages des courses
│   │           └── [raceId]/    # Détails d'une course
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Page d'accueil
│   └── globals.css              # Styles globaux
├── components/                   # Composants React réutilisables
│   ├── EventCard.tsx            # Carte d'événement
│   └── CompetitionCard.tsx      # Carte de compétition
├── lib/                         # Logique métier
│   ├── api/                     # Services API
│   │   └── biathlon-api.ts     # Client API Biathlon
│   └── types/                   # Types TypeScript
│       └── biathlon.ts         # Types pour les données biathlon
└── public/                      # Fichiers statiques
```

## API

L'application utilise l'API gratuite de [biathlonresults.com](https://biathlonresults.com/) pour récupérer les données en temps réel.

## Licence

ISC
