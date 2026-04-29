/**
 * dataStore.js
 * Gestion 100% client des données avec localStorage
 * Simule un backend avec persistance simple
 */

const STORAGE_KEYS = {
  SUBJECTS: 'mystudyplanner_subjects',
  TASKS: 'mystudyplanner_tasks',
};

// Données initiales de démo
const INITIAL_DATA = {
  subjects: [
    { id: 1, name: 'Mathématiques', color: '#3B82F6' },
    { id: 2, name: 'Physique', color: '#10B981' },
    { id: 3, name: 'Chimie', color: '#F59E0B' },
    { id: 4, name: 'Informatique', color: '#8B5CF6' },
    { id: 5, name: 'Français', color: '#EF4444' },
  ],
  tasks: [
    {
      id: 1,
      title: 'Devoir Chapitre 3',
      description: 'Exercices 1-5 page 42',
      subjectId: 1,
      type: 'Devoir',
      priority: 'haute',
      status: 'en_cours',
      dueDate: '2026-05-10',
    },
    {
      id: 2,
      title: 'TP Oscillateurs',
      description: 'Rapport à rendre',
      subjectId: 2,
      type: 'TP',
      priority: 'moyenne',
      status: 'termine',
      dueDate: '2026-05-08',
    },
    {
      id: 3,
      title: 'Dissertation Molière',
      description: 'Tartuffe - analyse',
      subjectId: 5,
      type: 'Devoir',
      priority: 'moyenne',
      status: 'termine',
      dueDate: '2026-05-15',
    },
  ],
};

// Initialiser le localStorage avec les données par défaut
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_DATA.subjects));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_DATA.tasks));
  }
}

// Sujets (matières)
export function getSubjects() {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
  return data ? JSON.parse(data) : INITIAL_DATA.subjects;
}

export function createSubject(name, color = null) {
  const subjects = getSubjects();
  const newId = subjects.length > 0 ? Math.max(...subjects.map((s) => s.id)) + 1 : 1;
  const newSubject = { id: newId, name, color };
  subjects.push(newSubject);
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  return newSubject;
}

export function deleteSubject(id) {
  const subjects = getSubjects().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  
  // Supprimer aussi les tâches associées
  const tasks = getTasks().filter((t) => t.subjectId !== id);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

// Tâches
export function getTasks() {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.TASKS);
  return data ? JSON.parse(data) : INITIAL_DATA.tasks;
}

export function createTask(task) {
  const tasks = getTasks();
  const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  const newTask = { ...task, id: newId };
  tasks.push(newTask);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  return newTask;
}

export function updateTask(id, updates) {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) return null;
  
  const updatedTask = { ...tasks[taskIndex], ...updates };
  tasks[taskIndex] = updatedTask;
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  return updatedTask;
}

export function deleteTask(id) {
  const tasks = getTasks().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

// Statistiques
export function getStats() {
  const tasks = getTasks();
  const total = tasks.length;
  const en_cours = tasks.filter((t) => t.status === 'en_cours').length;
  const termine = tasks.filter((t) => t.status === 'termine').length;

  return { total, en_cours, termine };
}
