/**
 * Organism: Sidebar
 * Affiche la liste des matières avec barres de progression
 * Récupère les données de GET /subjects et les associe avec les tâches
 * Utilise un système de couleurs prédéfinies pour chaque matière
 */
import { useEffect, useState } from 'react';
import SubjectItem from '../molecules/SubjectItem';
import apiClient from '../../api/client';

export default function Sidebar({ subjects: subjectsProp, tasks: tasksProp }) {
  const [subjects, setSubjects] = useState(subjectsProp || []);
  const [tasks, setTasks] = useState(tasksProp || []);
  const [loading, setLoading] = useState(!subjectsProp || !tasksProp);
  const [error, setError] = useState(null);

  // Palette de couleurs pour différencier les matières
  const colorPalette = [
    '#4F46E5',
    '#22C55E',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
  ];

  useEffect(() => {
    if (subjectsProp && tasksProp) {
      setSubjects(subjectsProp);
      setTasks(tasksProp);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [subjectsRes, tasksRes] = await Promise.all([
          apiClient.get('/subjects'),
          apiClient.get('/tasks'),
        ]);
        setSubjects(subjectsRes.data);
        setTasks(tasksRes.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les matières');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectsProp, tasksProp]);

  // Calculer le nombre de tâches complétées pour une matière
  const getCompletedTasksForSubject = (subjectId) => {
    return tasks.filter(
      (task) => task.subjectId === subjectId && task.status === 'termine'
    ).length;
  };

  // Calculer le nombre total de tâches pour une matière
  const getTotalTasksForSubject = (subjectId) => {
    return tasks.filter((task) => task.subjectId === subjectId).length;
  };

  if (loading) {
    return <div className="animate-pulse text-gray-400">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="card p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Progression par matière</h2>

      {subjects.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucune matière disponible</p>
      ) : (
        <div className="space-y-3">
          {subjects.map((subject, index) => (
            <SubjectItem
              key={subject.id}
              name={subject.name}
              totalTasks={getTotalTasksForSubject(subject.id)}
              completedTasks={getCompletedTasksForSubject(subject.id)}
              color={subject.color || colorPalette[index % colorPalette.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

Sidebar.defaultProps = {
  subjects: null,
  tasks: null,
};
