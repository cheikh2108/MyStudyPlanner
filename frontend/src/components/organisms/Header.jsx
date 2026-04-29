/**
 * Organism: Header
 * En-tete commun pour toutes les pages principales
 */
 import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BookOpen, LogOut, Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-900 min-w-0">
            <div className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center">
              <BookOpen size={18} className="text-primary" />
            </div>
            <span className="font-semibold truncate">MyStudyPlanner</span>
          </div>

          <nav className="hidden lg:flex items-center justify-center gap-2">
            <button
              onClick={() => handleNavigate('/dashboard')}
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
              onClick={() => handleNavigate('/subjects')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                isActive('/subjects')
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Matières
            </button>
          </nav>

          <div className="hidden lg:flex items-center justify-end gap-4 text-sm text-gray-500">
            <span className="truncate max-w-[180px]">{user?.email}</span>
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              title="Deconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-[1px] lg:hidden"
          />
        )}

        <div className={`relative z-40 lg:hidden overflow-hidden transition-all duration-200 ${mobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-lg space-y-2">
            <button
              onClick={() => handleNavigate('/dashboard')}
              className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                isActive('/dashboard')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => handleNavigate('/tasks')}
              className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                isActive('/tasks')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tâches
            </button>
            <button
              onClick={() => handleNavigate('/subjects')}
              className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                isActive('/subjects')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Matières
            </button>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3 text-sm text-gray-500">
              <span className="truncate">{user?.email}</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
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
