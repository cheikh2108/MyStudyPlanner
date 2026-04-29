/**
 * Organism: Sidebar
 * Affiche la liste des matières avec barres de progression
 * Utilise les données fournies en props (pas d'appel API)
 */
import SubjectItem from '../molecules/SubjectItem';

export default function Sidebar({ subjects = [], tasks = [] }) {
  // Palette de couleurs pour différencier les matières
  const colorPalette = [
    '#4F46E5',
    '#22C55E',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
  ];

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
