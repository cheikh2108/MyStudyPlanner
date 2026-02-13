# Spécifications Techniques : MyStudyPlanner 

## 1. Vision Générale
Application de gestion académique pour piloter devoirs, TP et projets.
- **Objectif :** CRUD complet des tâches organisé par matière.
- **Architecture :** Frontend React / Backend Node.js séparés.
- **Date de remise :** 28 Février 2026.

---

## 2. Stack Technique & Méthodologie
### Frontend
- **Framework :** React avec Hooks (`useState`, `useEffect`, `useContext`).
- **Stylisation :** Tailwind CSS (Design épuré & Responsive).
- **Architecture UI :** **Atomic Design** (Atoms, Molecules, Organisms, Templates, Pages).
- **Routage :** `react-router-dom` avec routes protégées.
- **Client API :** Axios ou Fetch.

### Backend
- **Environnement :** Node.js avec Express.js.
- **Stockage :** Fichier JSON (`db.json`) pour simuler une base de données.

---

## 3. Modèle de Données (Tâches)
Chaque tâche doit respecter cette structure:
- `id`: Identifiant unique.
- `title`: Nom du devoir/projet.
- `type`: "Devoir", "TP" ou "Projet".
- `subject`: Matière associée.
- `status`: "en cours" ou "terminé".
- `priority`: "haute", "moyenne", "basse".
- `dueDate`: Date d'échéance.

---

## 4. Protocole de Communication (CONSIGNES STRICTES)
1. **PAS DE FICHIERS MARKDOWN :** Ne crée pas de fichiers `.md` de rapport ou de statut. Communique via le chat.
2. **Atomic Design :** Découpe chaque composant dans son dossier : `src/components/atoms/`, `molecules/`, etc.
3. **Pédagogie :** Commente le code en français (logique métier et choix techniques).
4. **Validation :** Utilise des types simples ou PropTypes pour sécuriser les props.

---

## 5. Roadmap & Sprints

### Sprint 1 : Fondations & API
- Setup Backend Express + Route `GET/POST/PUT/DELETE` pour les tâches.
- Setup Frontend + Tailwind + Configuration de base.

### Sprint 2 : Logique & Authentification
- Mise en place du `useContext` pour l'auth simulée (Login/Logout).
- Création des composants "Atoms" et "Molecules" (Boutons, Inputs, Cartes).

### Sprint 3 : Dashboard & UI Finale
- Tableau de bord avec vue globale.
- Système de filtres (matière, état, priorité).
- Finalisation du design responsive.

---

## 6. Livrables Attendus 
- Code source complet (Front + Back).
- Rapport technique expliquant l'architecture.