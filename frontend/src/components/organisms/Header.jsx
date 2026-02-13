/**
 * Organism: Header
 * En-tete commun pour toutes les pages principales
 */
import PropTypes from 'prop-types';
import { BookOpen, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center gap-2 text-gray-900">
            <div className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center">
              <BookOpen size={18} className="text-primary" />
            </div>
            <span className="font-semibold">MyStudyPlanner</span>
          </div>

          <nav className="flex items-center justify-center gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                isActive('/dashboard')
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => navigate('/tasks')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                isActive('/tasks')
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Tâches
            </button>
            <button
              onClick={() => navigate('/subjects')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                isActive('/subjects')
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Matières
            </button>
          </nav>

          <div className="flex items-center justify-end gap-4 text-sm text-gray-500">
            <span>{user?.email}</span>
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              title="Deconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
};

Header.defaultProps = {
  user: null,
};
