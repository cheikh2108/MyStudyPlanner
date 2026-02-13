/**
 * Login.jsx
 * Page de connexion avec authentification simulée
 * Utilise le hook useAuth() pour envoyer les credentials au backend
 * Redirige vers /dashboard après connexion réussie
 */
import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Appel au contexte pour se connecter
      await login(email, password);

      // Redirection vers le dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center">
              <BookOpen size={20} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">MyStudyPlanner</h1>
          </div>
          <p className="text-gray-600">Connectez-vous à votre compte étudiant</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Affichage des erreurs */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@university.fr"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
              disabled={isLoading}
              required
            />
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
              disabled={isLoading}
              required
            />
          </div>

          {/* Bouton Connexion */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>

          {/* Note d'authentification simulée */}
          <div className="text-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            Mode démo : tout identifiant est accepté
          </div>
        </form>
      </div>
    </div>
  );
}
