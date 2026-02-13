/**
 * Molecule: SubjectItem
 * Composant affichant une matière avec le nombre de tâches et barre de progression
 * Combine Atom: ProgressBar et des éléments texte pour former une molécule
 */
import PropTypes from 'prop-types';
import ProgressBar from '../atoms/ProgressBar';

export default function SubjectItem({ name, totalTasks, completedTasks, color }) {
  // Calculer le pourcentage de complétude
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="rounded-xl border border-gray-100 p-4">
      {/* En-tête : nom de la matière et stats */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <span className="text-xs text-gray-500">
          {completedTasks}/{totalTasks}
        </span>
      </div>

      {/* Barre de progression personnalisée avec couleur */}
      <ProgressBar progress={progressPercent} color={color} />
    </div>
  );
}

SubjectItem.propTypes = {
  name: PropTypes.string.isRequired,
  totalTasks: PropTypes.number.isRequired,
  completedTasks: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

SubjectItem.defaultProps = {
  totalTasks: 0,
  completedTasks: 0,
};
