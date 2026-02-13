/**
 * Page: Dashboard
 * Page principale affichant le tableau de bord avec les stats et la sidebar
 * Structure responsif : stats au haut, sidebar à gauche en bas
 * Intégré avec AuthContext pour afficher les infos utilisateur
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Plus, Trash2 } from 'lucide-react';
import DashboardStats from '../components/organisms/DashboardStats';
import Sidebar from '../components/organisms/Sidebar';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/client';
import Badge from '../components/atoms/Badge';
import Checkbox from '../components/atoms/Checkbox';
import Header from '../components/organisms/Header';
import TaskModal from '../components/organisms/TaskModal';
import ConfirmModal from '../components/organisms/ConfirmModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, taskId: null });

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, subjectsRes] = await Promise.all([
          apiClient.get('/tasks'),
          apiClient.get('/subjects'),
        ]);
        setTasks(tasksRes.data);
        setSubjects(subjectsRes.data);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject?.name || 'Sans matière';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const upcomingTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => task.status !== 'termine')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3);
  }, [tasks]);

  const handleDeleteTask = async (taskId) => {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
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

  const handleCreateTask = async (formData) => {
    try {
      const response = await apiClient.post('/tasks', {
        ...formData,
        status: 'en_cours',
      });
      setTasks([...tasks, response.data]);
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Erreur lors de la création de la tâche:', err);
      alert('Erreur lors de la création de la tâche');
    }
  };

  const handleUpdateTask = async (formData) => {
    try {
      if (!editingTask) return;
      const response = await apiClient.put(`/tasks/${editingTask.id}`, {
        ...formData,
        status: editingTask.status,
      });
      setTasks(tasks.map((task) => (task.id === editingTask.id ? response.data : task)));
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Erreur lors de la modification de la tâche:', err);
      alert('Erreur lors de la modification de la tâche');
    }
  };

  const handleModalSubmit = (formData) => {
    if (editingTask) {
      handleUpdateTask(formData);
    } else {
      handleCreateTask(formData);
    }
  };

  const handleToggleStatus = async (taskId) => {
    try {
      const task = tasks.find((item) => item.id === taskId);
      if (!task) return;

      const newStatus = task.status === 'en_cours' ? 'termine' : 'en_cours';
      const response = await apiClient.put(`/tasks/${taskId}`, {
        ...task,
        status: newStatus,
      });

      setTasks(tasks.map((item) => (item.id === taskId ? response.data : item)));
    } catch (err) {
      console.error('Erreur lors de la mise a jour du statut:', err);
      alert('Erreur lors de la mise a jour du statut');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={handleLogout} />

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Section Stats */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
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

        <DashboardStats />

        {/* Section progression + prochaines deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Sidebar subjects={subjects} tasks={tasks} />

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Prochaines deadlines</h3>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500">Chargement...</p>
            ) : upcomingTasks.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune tâche à venir</p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.status === 'termine'}
                        onChange={() => handleToggleStatus(task.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900 truncate">
                            {task.title}
                          </p>
                          <Badge
                            label={task.priority}
                            variant={
                              task.priority === 'haute'
                                ? 'danger'
                                : task.priority === 'moyenne'
                                  ? 'warning'
                                  : 'success'
                            }
                            size="sm"
                          />
                          <Badge label={task.type} variant="secondary" size="sm" />
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {task.description}
                          </p>
                        )}

                        <div className="text-xs text-gray-500 mt-2">
                          {getSubjectName(task.subjectId)} · {formatDate(task.dueDate)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setIsModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                          title="Editer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setConfirmState({ open: true, taskId: task.id });
                          }}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
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
