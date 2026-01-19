# Consignes pour les IA travaillant sur ce repository

Ce fichier contient les règles et bonnes pratiques à suivre lors de modifications du code de ce projet.

## 1. Gestion des versions

### Règle obligatoire
**Pour chaque modification du code, vous DEVEZ incrémenter le numéro de version dans `package.json`.**

### Détails
- **Emplacement** : Le numéro de version se trouve dans `/package.json` (ligne 3)
- **Format** : Suivre le versioning sémantique (semver) : `MAJOR.MINOR.PATCH`
- **Incrémentation par défaut** : Modifier uniquement la **version MINEURE** (MINOR)
  - Exemple : `1.0.0` → `1.1.0`
  - Exemple : `1.2.0` → `1.3.0`
- **Exceptions** : Incrémenter la version MAJEURE ou PATCH uniquement si explicitement demandé
  - Version MAJEURE (MAJOR) : Changements incompatibles avec les versions précédentes
  - Version PATCH : Corrections de bugs mineurs

### Statut actuel
- Version actuelle : `1.0.0`
- Note : Le numéro de version n'est actuellement **pas affiché** dans le footer de l'application
- Le footer est présent dans 5 fichiers différents :
  - `/app/[locale]/page.tsx`
  - `/app/[locale]/dashboard/page.tsx`
  - `/app/[locale]/event/[eventId]/page.tsx`
  - `/app/[locale]/event/[eventId]/race/[raceId]/page.tsx`
  - `/app/[locale]/athlete/[ibuId]/page.tsx`

---

## Instructions générales

- Toujours lire et respecter les consignes de ce fichier avant toute modification
- En cas de doute sur l'incrémentation de version, demander une clarification
- Documenter les changements importants dans les messages de commit
