/**
 * Tasks.jsx
 * Page principale "Mes tâches" avec :
 * - Récupération de toutes les tâches via dataStore
 * - Système de filtrage et recherche
 * - Formulaire de création/modification via modale
 * - Gestion complète du cycle de vie des tâches
 */
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TaskFilters from '../components/molecules/TaskFilters';
import TaskItem from '../components/molecules/TaskItem';
import TaskModal from '../components/organisms/TaskModal';
import { useAuth } from '../hooks/useAuth';
import * as dataStore from '../storage/dataStore';
import Header from '../components/organisms/Header';
import ConfirmModal from '../components/organisms/ConfirmModal';

export default function Tasks() {
  // État des tâches et subjects
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const tasks = dataStore.getTasks();
    const subjects = dataStore.getSubjects();
    setTasks(tasks);
    setSubjects(subjects);
    setLoading(false);
  }, []);

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
  const handleCreateTask = (formData) => {
    const newTask = dataStore.createTask({
      ...formData,
      status: 'en_cours',
    });
    setTasks([newTask, ...tasks]);
    setCurrentPage(1);
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Modifier une tâche
  const handleUpdateTask = (formData) => {
    const updatedTask = dataStore.updateTask(editingTask.id, {
      ...formData,
      status: editingTask.status,
    });
    setTasks(tasks.map((t) => (t.id === editingTask.id ? updatedTask : t)));
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Supprimer une tâche
  const handleDeleteTask = (taskId) => {
    dataStore.deleteTask(taskId);
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleConfirmDelete = () => {
    if (!confirmState.taskId) return;
    handleDeleteTask(confirmState.taskId);
    setConfirmState({ open: false, taskId: null });
  };

  // Marquer une tâche comme terminée/en cours
  const handleToggleStatus = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    const newStatus = task.status === 'en_cours' ? 'termine' : 'en_cours';

    const updatedTask = dataStore.updateTask(taskId, { status: newStatus });
    setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
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
          <h2 className="text-2xl font-bold text-gray-900">Mes tâches</h2>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-sm"
          >
            <Plus size={18} />
            Nouvelle tâche
          </button>
        </div>

        {/* Filtres */}
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
        />

        {/* Liste des tâches */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Chargement des tâches...</p>
          </div>
        ) : currentTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {tasks.length === 0
                ? 'Aucune tâche créée. Créez-en une pour commencer !'
                : 'Aucune tâche ne correspond à vos filtres.'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mt-6">
              {currentTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  subjectName={getSubjectName(task.subjectId)}
                  onEdit={handleEditTask}
                  onDelete={() => setConfirmState({ open: true, taskId: task.id })}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </main>

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
