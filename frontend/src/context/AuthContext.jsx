/**
 * AuthContext.jsx
 * Contexte global pour la gestion de l'authentification 100% client
 * Utilise useState et useEffect pour persister l'utilisateur dans localStorage
 */
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextBase';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restaurer l'utilisateur depuis localStorage au montage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  // Fonction de connexion 100% client (pas d'appel API)
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // Validation minimale
      if (!email || !password) {
        throw new Error('Email et mot de passe requis');
      }

      // Créer un utilisateur de démo
      const userData = {
        id: 1,
        name: email.split('@')[0],
        email,
      };

      // Générer un token simple
      const newToken = `token-${Date.now()}`;

      // Persistance dans localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', newToken);

      // Mise à jour du state
      setUser(userData);
      setToken(newToken);

      return userData;
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      const errorMessage = err.message || 'Erreur de connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    // Suppression du localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Réinitialisation du state
    setUser(null);
    setToken(null);
    setError(null);
  };

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = !!user && !!token;

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
