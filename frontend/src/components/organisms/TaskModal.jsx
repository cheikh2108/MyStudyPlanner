/**
 * Organism: TaskModal
 * Modale pour créer ou éditer une tâche
 * Formulaire complet avec tous les champs de la maquette
 */
import { X } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  subjects,
  initialTask = null,
}) {
  const [formData, setFormData] = useState(() => {
    if (initialTask) {
      return {
        title: initialTask.title,
        description: initialTask.description || '',
        subjectId: initialTask.subjectId,
        type: initialTask.type,
        priority: initialTask.priority,
        dueDate: initialTask.dueDate,
      };
    }

    return {
      title: '',
      description: '',
      subjectId: '',
      type: 'Devoir',
      priority: 'moyenne',
      dueDate: '',
    };
  });

  const [errors, setErrors] = useState({});

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'La matière est obligatoire';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'La date d\'échéance est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de la soumission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      ...formData,
      subjectId: Number(formData.subjectId),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* En-tête */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {initialTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre de la tâche"
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-red-300 focus:ring-red-100'
                  : 'border-gray-300 focus:ring-primary-100'
              }`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description..."
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Matière et Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matière
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.subjectId
                    ? 'border-red-300 focus:ring-red-100'
                    : 'border-gray-300 focus:ring-primary-100'
                }`}
              >
                <option value="">Sélectionner...</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {errors.subjectId && <p className="text-red-500 text-xs mt-1">{errors.subjectId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option>Devoir</option>
                <option>TP</option>
                <option>Projet</option>
              </select>
            </div>
          </div>

          {/* Priorité et Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="haute">Haute</option>
                <option value="moyenne">Moyenne</option>
                <option value="basse">Basse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'échéance
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.dueDate
                    ? 'border-red-300 focus:ring-red-100'
                    : 'border-gray-300 focus:ring-primary-100'
                }`}
              />
              {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              {initialTask ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

TaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  initialTask: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    subjectId: PropTypes.number,
    type: PropTypes.string,
    priority: PropTypes.string,
    dueDate: PropTypes.string,
  }),
};
