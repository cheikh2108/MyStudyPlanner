/**
 * AuthContext.jsx
 * Contexte global pour la gestion de l'authentification simulée
 * Utilise useState et useEffect pour persister l'utilisateur dans localStorage
 * 
 * Fonctionnalités :
 * - login(email, password) : Appelle POST /login sur le backend
 * - logout() : Vide l'état et le localStorage
 * - User automatiquement restauré au rechargement de la page
 */
import { useState, useEffect } from 'react';
import apiClient from '../api/client';
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

  // Fonction de connexion simulée
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // Appel au backend pour authentification simulée
      const response = await apiClient.post('/login', {
        email,
        password,
      });

      // Extraction des données utilisateur et token
      const { user: userData, token: newToken } = response.data;

      // Persistance dans localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', newToken);

      // Mise à jour du state
      setUser(userData);
      setToken(newToken);

      return userData;
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      const errorMessage = err.response?.data?.message || 'Erreur de connexion';
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
