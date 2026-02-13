/**
 * Page: Subjects
 * Gestion des matieres avec ajout, suppression et vue des progres
 */
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/client';
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
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [formError, setFormError] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, subjectId: null });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, tasksRes] = await Promise.all([
          apiClient.get('/subjects'),
          apiClient.get('/tasks'),
        ]);
        setSubjects(subjectsRes.data);
        setTasks(tasksRes.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des matieres:', err);
        setError('Impossible de charger les matieres');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddSubject = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError('Le nom de la matiere est obligatoire');
      return;
    }

    try {
      const response = await apiClient.post('/subjects', {
        name: trimmedName,
        color: selectedColor,
      });
      setSubjects([...subjects, response.data]);
      setName('');
      setFormError(null);
    } catch (err) {
      console.error('Erreur lors de la creation de la matiere:', err);
      setFormError('Impossible de creer la matiere');
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      await apiClient.delete(`/subjects/${subjectId}`);
      setSubjects(subjects.filter((subject) => subject.id !== subjectId));
      setTasks(tasks.filter((task) => task.subjectId !== subjectId));
    } catch (err) {
      console.error('Erreur lors de la suppression de la matiere:', err);
      alert('Erreur lors de la suppression de la matiere');
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmState.subjectId) return;
    await handleDeleteSubject(confirmState.subjectId);
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
                    aria-label={`Choisir la couleur ${color}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleAddSubject}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-sm"
            >
              <Plus size={18} />
              Ajouter
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Chargement...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : subjects.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune matière disponible</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, index) => {
              const totalTasks = getTotalTasks(subject.id);
              const completedTasks = getCompletedTasks(subject.id);
              const progressPercent = totalTasks
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0;
              const displayColor = subject.color || COLOR_OPTIONS[index % COLOR_OPTIONS.length];

              return (
                <div key={subject.id} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: displayColor }}
                      />
                      <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                    </div>
                    <button
                      onClick={() => {
                        setConfirmState({ open: true, subjectId: subject.id });
                      }}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                    <span className="px-2 py-1 rounded-full bg-gray-100">{totalTasks} taches</span>
                    <span className="px-2 py-1 rounded-full bg-gray-100">
                      {completedTasks} terminees
                    </span>
                  </div>

                  <ProgressBar progress={progressPercent} color={displayColor} />
                </div>
              );
            })}
          </div>
        )}
      </main>

      <ConfirmModal
        isOpen={confirmState.open}
        title="Supprimer la matière"
        message="Supprimer cette matière supprimera aussi ses tâches associées. Continuer ?"
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onCancel={() => setConfirmState({ open: false, subjectId: null })}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
