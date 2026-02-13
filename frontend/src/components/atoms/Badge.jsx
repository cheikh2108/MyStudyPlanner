/**
 * Atom: Badge
 * Badge coloré pour afficher les statuts, priorités, types
 * Réutilisable dans plusieurs contextes
 */
import PropTypes from 'prop-types';

export default function Badge({ label, variant = 'primary', size = 'md' }) {
  const variants = {
    primary: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    success: 'bg-green-50 text-green-700 border border-green-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    danger: 'bg-red-50 text-red-700 border border-red-100',
    secondary: 'bg-gray-50 text-gray-700 border border-gray-200',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`${variants[variant]} ${sizes[size]} rounded-full font-medium inline-block`}>
      {label}
    </span>
  );
}

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'secondary']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};
