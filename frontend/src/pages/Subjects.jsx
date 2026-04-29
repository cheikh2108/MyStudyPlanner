/**
 * Page: Subjects
 * Gestion des matieres avec ajout, suppression et vue des progres
 * Utilise dataStore pour la gestion 100% client
 */
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as dataStore from '../storage/dataStore';
import ProgressBar from '../components/atoms/ProgressBar';
import Header from '../components/organisms/Header';
import ConfirmModal from '../components/organisms/ConfirmModal';

const COLOR_OPTIONS = [
  '#4F46E5',
  '#22C55E',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#3B82F6',
  '#EC4899',
  '#14B8A6',
];

export default function Subjects() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [formError, setFormError] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, subjectId: null });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const subjects = dataStore.getSubjects();
    const tasks = dataStore.getTasks();
    setSubjects(subjects);
    setTasks(tasks);
    setLoading(false);
  }, []);

  const handleAddSubject = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError('Le nom de la matiere est obligatoire');
      return;
    }

    const newSubject = dataStore.createSubject(trimmedName, selectedColor);
    setSubjects([...subjects, newSubject]);
    setName('');
    setFormError(null);
  };

  const handleDeleteSubject = (subjectId) => {
    dataStore.deleteSubject(subjectId);
    setSubjects(subjects.filter((subject) => subject.id !== subjectId));
    setTasks(tasks.filter((task) => task.subjectId !== subjectId));
  };

  const handleConfirmDelete = () => {
    if (!confirmState.subjectId) return;
    handleDeleteSubject(confirmState.subjectId);
    setConfirmState({ open: false, subjectId: null });
  };

  const getTotalTasks = (subjectId) => {
    return tasks.filter((task) => task.subjectId === subjectId).length;
  };

  const getCompletedTasks = (subjectId) => {
    return tasks.filter(
      (task) => task.subjectId === subjectId && task.status === 'termine'
    ).length;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Matières</h2>

        <div className="card p-5 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_auto] gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la matière
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Intelligence Artificielle"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
              />
              {formError && (
                <p className="text-xs text-red-500 mt-2">{formError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full border border-gray-200 ${
                      selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleAddSubject}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors font-semibold shadow-sm"
            >
              <Plus size={18} />
              Ajouter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Chargement des matières...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Aucune matière créée. Créez-en une pour commencer !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const total = getTotalTasks(subject.id);
              const completed = getCompletedTasks(subject.id);

              return (
                <div key={subject.id} className="card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.color || '#6B7280' }}
                      ></div>
                      <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                    </div>
                    <button
                      onClick={() => setConfirmState({ open: true, subjectId: subject.id })}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {total === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Aucune tâche
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-xs text-gray-600">
                        {completed} / {total} complétées
                      </div>
                      <ProgressBar
                        current={completed}
                        total={total}
                        color={subject.color || '#6B7280'}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <ConfirmModal
        isOpen={confirmState.open}
        title="Supprimer la matière"
        message="Voulez-vous vraiment supprimer cette matière ? Les tâches associées seront également supprimées."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onCancel={() => setConfirmState({ open: false, subjectId: null })}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
