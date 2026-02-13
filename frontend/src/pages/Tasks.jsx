/**
 * Tasks.jsx
 * Page principale "Mes tâches" avec :
 * - Récupération de toutes les tâches via GET /tasks
 * - Système de filtrage et recherche
 * - Formulaire de création/modification via modale
 * - Appels CRUD (POST, PUT, DELETE) via Axios
 * - Gestion complète du cycle de vie des tâches
 */
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TaskFilters from '../components/molecules/TaskFilters';
import TaskItem from '../components/molecules/TaskItem';
import TaskModal from '../components/organisms/TaskModal';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/client';
import Header from '../components/organisms/Header';
import ConfirmModal from '../components/organisms/ConfirmModal';

export default function Tasks() {
  // État des tâches et subjects
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // État des filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // État de la modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, taskId: null });

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Charger les tâches et les matières au montage
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksRes, subjectsRes] = await Promise.all([
          apiClient.get('/tasks'),
          apiClient.get('/subjects'),
        ]);
        setTasks(tasksRes.data);
        setSubjects(subjectsRes.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les tâches');
        // Si 401, redirection vers login
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [logout]);

  // Filtrer les tâches selon les critères
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = !selectedSubject || task.subjectId === Number(selectedSubject);
    const matchesStatus = !selectedStatus || task.status === selectedStatus;
    const matchesPriority = !selectedPriority || task.priority === selectedPriority;

    return matchesSearch && matchesSubject && matchesStatus && matchesPriority;
  });

  // Trier par plus recentes (id decroissant)
  const sortedTasks = [...filteredTasks].sort((a, b) => b.id - a.id);
  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / pageSize));
  const currentTasks = sortedTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Obtenir le nom de la matière par ID
  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject?.name || 'Sans matière';
  };

  // Créer une nouvelle tâche
  const handleCreateTask = async (formData) => {
    try {
      const response = await apiClient.post('/tasks', {
        ...formData,
        status: 'en_cours', // Par défaut, nouvelles tâches en cours
      });
      setTasks([response.data, ...tasks]);
      setCurrentPage(1);
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Erreur lors de la création de la tâche:', err);
      alert('Erreur lors de la création de la tâche');
    }
  };

  // Modifier une tâche
  const handleUpdateTask = async (formData) => {
    try {
      const response = await apiClient.put(`/tasks/${editingTask.id}`, {
        ...formData,
        status: editingTask.status, // Garder le status actuel
      });
      setTasks(tasks.map((t) => (t.id === editingTask.id ? response.data : t)));
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Erreur lors de la modification de la tâche:', err);
      alert('Erreur lors de la modification de la tâche');
    }
  };

  // Supprimer une tâche
  const handleDeleteTask = async (taskId) => {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error('Erreur lors de la suppression de la tâche:', err);
      alert('Erreur lors de la suppression de la tâche');
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmState.taskId) return;
    await handleDeleteTask(confirmState.taskId);
    setConfirmState({ open: false, taskId: null });
  };

  // Marquer une tâche comme terminée/en cours
  const handleToggleStatus = async (taskId) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      const newStatus = task.status === 'en_cours' ? 'termine' : 'en_cours';

      const response = await apiClient.put(`/tasks/${taskId}`, {
        ...task,
        status: newStatus,
      });

      setTasks(tasks.map((t) => (t.id === taskId ? response.data : t)));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Éditer une tâche
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Gérer la soumission de la modale
  const handleModalSubmit = (formData) => {
    if (editingTask) {
      handleUpdateTask(formData);
    } else {
      handleCreateTask(formData);
    }
  };

  // Fermer la modale et réinitialiser l'édition
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={handleLogout} />

      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Titre et bouton */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mes tâches</h2>
            <p className="text-sm text-gray-500 mt-1">Organisez votre travail efficacement</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-sm"
          >
            <Plus size={20} />
            Nouvelle tâche
          </button>
        </div>

        {/* Filtres */}
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          subjects={subjects}
        />

        {/* État de chargement */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement des tâches...</p>
          </div>
        )}

        {/* Erreur */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Liste des tâches */}
        {!loading && !error && (
          <div className="space-y-3">
            {sortedTasks.length > 0 ? (
              currentTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  subjectName={getSubjectName(task.subjectId)}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleEditTask}
                  onDelete={(taskId) => setConfirmState({ open: true, taskId })}
                />
              ))
            ) : (
              <div className="card p-8 text-center">
                <p className="text-gray-600">
                  {searchQuery || selectedSubject || selectedStatus || selectedPriority
                    ? 'Aucune tâche ne correspond à vos filtres'
                    : 'Aucune tâche pour le moment. Créez-en une !'}
                </p>
              </div>
            )}
          </div>
        )}

        {!loading && !error && sortedTasks.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Page {currentPage} sur {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                disabled={currentPage === 1}
              >
                Precedent
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modale de création/édition */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        subjects={subjects}
        initialTask={editingTask}
      />

      <ConfirmModal
        isOpen={confirmState.open}
        title="Supprimer la tâche"
        message="Voulez-vous vraiment supprimer cette tâche ?"
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onCancel={() => setConfirmState({ open: false, taskId: null })}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
