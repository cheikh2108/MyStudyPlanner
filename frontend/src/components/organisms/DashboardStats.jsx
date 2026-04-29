/**
 * Organism: Dashboard Stats
 * Récupère les données depuis dataStore et affiche les 3 cartes principales
 * (Total des tâches, En cours, Terminées)
 */
import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import StatCard from '../atoms/StatCard';
import * as dataStore from '../../storage/dataStore';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    total: 0,
    en_cours: 0,
    termine: 0,
  });

  useEffect(() => {
    const stats = dataStore.getStats();
    setStats(stats);
  }, []);

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
