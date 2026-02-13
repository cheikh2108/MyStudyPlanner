/**
 * Organism: Dashboard Stats
 * Récupère les données de GET /stats et affiche les 3 cartes principales
 * (Total des tâches, En cours, Terminées)
 * Utilise useEffect pour charger les données au montage du composant
 */
import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import StatCard from '../atoms/StatCard';
import apiClient from '../../api/client';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    total: 0,
    en_cours: 0,
    termine: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fonction asynchrone pour récupérer les stats depuis le backend
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/stats');
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des stats:', err);
        setError('Impossible de charger les statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // État de chargement
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6 animate-pulse bg-gray-100 h-24" />
        ))}
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Carte Total des tâches */}
      <StatCard
        icon={FileText}
        title="Total des tâches"
        value={stats.total}
        bgColor="bg-indigo-100"
        iconColor="text-indigo-600"
      />

      {/* Carte Tâches en cours */}
      <StatCard
        icon={Clock}
        title="En cours"
        value={stats.en_cours}
        bgColor="bg-amber-100"
        iconColor="text-amber-600"
      />

      {/* Carte Tâches terminées */}
      <StatCard
        icon={CheckCircle}
        title="Terminées"
        value={stats.termine}
        bgColor="bg-emerald-100"
        iconColor="text-emerald-600"
      />
    </div>
  );
}
