/**
 * Atom: Checkbox
 * Case à cocher personnalisée pour marquer les tâches comme terminées
 */
import PropTypes from 'prop-types';

export default function Checkbox({ checked, onChange, disabled = false }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="w-5 h-5 text-primary rounded-full border-gray-300 focus:ring-2 focus:ring-primary cursor-pointer accent-primary"
    />
  );
}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
