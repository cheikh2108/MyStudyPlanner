# MyStudyPlanner 

Application de gestion de taches academiques (devoirs, TP, projets) avec suivi des deadlines et progression par matiere.

## Fonctionnalites
- Authentification simulee (login/logout)
- CRUD des taches (creation, edition, suppression)
- Filtres (recherche, matiere, etat, priorite) + pagination
- Gestion des matieres (ajout, suppression, couleur)
- Tableau de bord avec statistiques et prochaines deadlines

## Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Persistance: db.json

## Lancer le projet en local

### Backend
```bash
cd backend
npm install
npm run dev
```
Serveur sur http://localhost:4000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App sur http://localhost:5173

## Déploiement

Le backend Express peut servir le build de production du frontend React. Le plus simple est donc de déployer la racine du dépôt ou le dossier backend avec le frontend déjà compilé.

Variables d'environnement utiles :
- `PORT` pour le port du backend.
- `CORS_ORIGIN` pour autoriser un ou plusieurs domaines frontend séparés, séparés par des virgules.
- `VITE_API_URL` pour pointer le frontend vers un backend distant. En production sur un même domaine, cette variable peut être vide.

Commande de build frontend :
```bash
cd frontend
npm install
npm run build
```

Commande de démarrage backend :
```bash
cd backend
npm install
npm start
```

Si le frontend a été compilé dans `frontend/dist`, le serveur Express le sert automatiquement et les routes SPA comme `/dashboard` ou `/tasks` fonctionnent au rafraîchissement.

## Routes API
- GET /tasks
- POST /tasks
- PUT /tasks/:id
- DELETE /tasks/:id
- GET /subjects
- POST /subjects
- DELETE /subjects/:id
- GET /stats
- POST /login

## Structure
```
MyStudyPlanner/
	backend/    # API Express + db.json
	frontend/   # React + Tailwind
```

## Notes
- L'authentification est simulee (tout identifiant est accepte).
- La suppression d'une matiere supprime ses taches associees.

