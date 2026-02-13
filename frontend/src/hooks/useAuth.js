/**
 * useAuth.js
 * Hook personnalisé pour accéder au contexte d'authentification
 * Simplifie l'accès à AuthContext dans tous les composants
 * 
 * Utilisation: const { user, login, logout, isAuthenticated } = useAuth();
 */
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextBase';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth doit être utilisé à l\'intérieur d\'un AuthProvider'
    );
  }

  return context;
}
