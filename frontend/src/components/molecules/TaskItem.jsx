/**
 * Molecule: TaskItem
 * Ligne de tâche affichant :
 * - Checkbox pour marquer comme terminé
 * - Titre et description
 * - Matière et type (badges)
 * - Priorité (badge coloré)
 * - Date d'échéance
 * - Icônes d'action (éditer, supprimer)
 */
import { Calendar, Trash2, Edit } from 'lucide-react';
import PropTypes from 'prop-types';
import Checkbox from '../atoms/Checkbox';
import Badge from '../atoms/Badge';

export default function TaskItem({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  subjectName,
}) {
  // Déterminer la couleur du badge priorité
  const priorityVariants = {
    haute: 'danger',
    moyenne: 'warning',
    basse: 'success',
  };


  // Formater la date d'échéance
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isComplete = task.status === 'termine';

  return (
    <div
      className={`card p-4 flex items-start gap-4 hover:shadow-md transition-shadow ${
        isComplete ? 'bg-gray-50' : ''
      }`}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0 pt-1">
        <Checkbox
          checked={isComplete}
          onChange={() => onToggleStatus(task.id)}
        />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 min-w-0">
        {/* Titre avec strike-through si terminé */}
        <div className="flex items-start gap-3 flex-wrap">
          <h3
            className={`font-semibold text-gray-900 ${
              isComplete ? 'line-through text-gray-500' : ''
            }`}
          >
            {task.title}
          </h3>
          <Badge
            label={task.priority}
            variant={priorityVariants[task.priority]}
            size="sm"
          />
          <Badge label={task.type} variant="secondary" size="sm" />
        </div>

        {/* Description */}
        {task.description && (
          <p className={`text-sm ${isComplete ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {task.description}
          </p>
        )}

        {/* Badges et info */}
        <div className="flex items-center gap-3 mt-3 flex-wrap text-xs text-gray-500">
          <span>{subjectName}</span>
          <span className="text-gray-300">|</span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(task.dueDate)}
          </span>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-600 hover:bg-blue-50 hover:text-primary rounded-lg transition-colors"
          title="Éditer"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => {
            onDelete(task.id);
          }}
          className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          title="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    type: PropTypes.string.isRequired,
    priority: PropTypes.oneOf(['haute', 'moyenne', 'basse']).isRequired,
    status: PropTypes.oneOf(['en_cours', 'termine']).isRequired,
    dueDate: PropTypes.string.isRequired,
    subjectId: PropTypes.number.isRequired,
  }).isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  subjectName: PropTypes.string.isRequired,
};
