/**
 * Atom: ProgressBar
 * Barre de progression simple avec pourcentage
 * Utile pour afficher la complétude des tâches par matière
 */
import PropTypes from 'prop-types';

export default function ProgressBar({ progress, color }) {
  const isHexColor = typeof color === 'string' && color.startsWith('#');

  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${isHexColor ? '' : color}`}
        style={{
          width: `${progress}%`,
          backgroundColor: isHexColor ? color : undefined,
        }}
      />
    </div>
  );
}

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired, // 0 à 100
  color: PropTypes.string.isRequired,
};

ProgressBar.defaultProps = {
  color: 'bg-primary',
};
