/**
 * Molecule: TaskFilters
 * Barre de recherche et filtres par :
 * - Matière
 * - État (en cours / terminé)
 * - Priorité
 * Basée sur la maquette Lovable
 */
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

export default function TaskFilters({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  subjects,
}) {
  return (
    <div className="card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-900">Filtres</p>
        <span className="text-xs text-gray-500">Affinez votre recherche</span>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher une tâche..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Filtre Matière */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Matière
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-primary"
          >
            <option value="">Toutes les matières</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre État */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            État
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-primary"
          >
            <option value="">Tous les états</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminées</option>
          </select>
        </div>

        {/* Filtre Priorité */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Priorité
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-primary"
          >
            <option value="">Toutes les priorités</option>
            <option value="haute">Haute</option>
            <option value="moyenne">Moyenne</option>
            <option value="basse">Basse</option>
          </select>
        </div>

        {/* Tri par date */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Tri
          </label>
          <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-primary">
            <option>Date d'échéance</option>
            <option>Plus récent</option>
            <option>Priorité</option>
          </select>
        </div>
      </div>
    </div>
  );
}

TaskFilters.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selectedSubject: PropTypes.string.isRequired,
  onSubjectChange: PropTypes.func.isRequired,
  selectedStatus: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  selectedPriority: PropTypes.string.isRequired,
  onPriorityChange: PropTypes.func.isRequired,
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
