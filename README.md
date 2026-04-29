# MyStudyPlanner 

Application de gestion de tâches académiques (devoirs, TP, projets) avec suivi des deadlines et progression par matière.

**Application 100% client avec localStorage. Aucun serveur backend requis.**

## Fonctionnalités
- Authentification locale (login/logout)
- CRUD des tâches (création, édition, suppression)
- Filtres (recherche, matière, état, priorité) + pagination
- Gestion des matières (ajout, suppression, couleur)
- Tableau de bord avec statistiques et prochaines deadlines
- Persistance des données dans localStorage

## Stack
- Frontend: React + Vite + Tailwind CSS
- Persistance: localStorage (100% client)
- Pas de backend requis

## Lancer le projet en local

```bash
cd frontend
npm install
npm run dev
```
App sur http://localhost:5173

## Déploiement

Aucun backend à déployer ! L'application est 100% client avec localStorage.

Pour déployer sur Appwrite, Netlify, Vercel, GitHub Pages, etc. :

Commande de build :
```bash
npm run build
```

Cela crée le dossier `dist/` contenant l'application statique prête à être hébergée.

Configuration Appwrite :
- Build command: `npm run build`
- Output directory: `dist`

L'application fonctionne immédiatement après le déploiement sans configuration supplémentaire.

## Structure
```
MyStudyPlanner/
├── frontend/          # React + Vite + Tailwind (100% client)
├── dist/              # Build de production statique
├── scripts/           # Utilitaires de build
└── package.json       # Configuration racine
```

## Données de démo

L'application inclut des données initiales:
- 5 matières pré-créées
- 3 tâches de démo

Les données sont persistées dans le localStorage du navigateur.

## Notes
- L'authentification accepte tout identifiant
- Les données sont stockées dans localStorage du navigateur
- Chaque profil navigateur a sa propre instance des données
- La suppression d'une matière supprime ses tâches associées
- Les données sont conservées après fermeture/réouverture du navigateur
