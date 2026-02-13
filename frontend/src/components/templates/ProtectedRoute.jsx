/**
 * ProtectedRoute.jsx
 * Composant de route protégée
 * Redirige vers /login si l'utilisateur n'est pas connecté
 * Sinon affiche le composant demandé
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Afficher un loader pendant le chargement de l'état d'auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg animate-spin" />
            <span className="text-gray-600">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  // Redirection vers login si non connecté
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Affichage du composant protégé
  return children;
}
