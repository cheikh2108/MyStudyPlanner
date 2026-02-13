/**
 * Atom: StatCard
 * Composant de base pour afficher une statistique avec icône, titre et valeur
 * Réutilisable dans plusieurs contextes (Dashboard, Stats, etc.)
 */
import PropTypes from 'prop-types';

export default function StatCard({ icon: IconComponent, title, value, bgColor, iconColor }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      {/* Icône avec couleur de fond personnalisée */}
      <div className={`${bgColor} p-3 rounded-xl flex items-center justify-center`}>
        {IconComponent && <IconComponent size={20} className={iconColor} />}
      </div>
      
      <div className="flex-1">
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  bgColor: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
};

StatCard.defaultProps = {
  icon: null,
  bgColor: 'bg-primary',
  iconColor: 'text-white',
};
