import { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Edit2, Share2, Trash2, Check, X } from 'lucide-react';
import BadgeComponent from '../components/BadgeComponent';
import { createTaskList, getAllTaskLists, updateTaskList, deleteTaskList, shareTaskList, addTaskToList, removeTaskFromList } from '../api/tasklist';
import { getAllTasks } from '../api/task';
import TaskComponent from '../components/TaskComponent';
import Input from '../components/InputComponent';
import { Task } from '../types';

interface TaskList {
  _id: string;
  name: string;
  tasks: Task[];
  type: 'owned' | 'shared';
}

const AddListPage = () => {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [sharingListId, setSharingListId] = useState<string | null>(null);
  const [sharingEmail, setSharingEmail] = useState('');
  const [sharingPermission, setSharingPermission] = useState<'read' | 'write'>('read');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editedListName, setEditedListName] = useState('');
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [selectedTasksByList, setSelectedTasksByList] = useState<Record<string, string>>({});
  const [deleteModalListId, setDeleteModalListId] = useState<string | null>(null);

  const fetchLists = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await getAllTaskLists();
      const allTasks = await getAllTasks();

      // Créer une map id -> tâche pour normaliser les tâches des listes
      const taskMap = new Map(allTasks.map((task: Task) => [task._id, task]));
      const normalizeTasks = (tasks: any[]) => (tasks || [])
        .map((t: any) => {
          if (!t) return null;
          if (typeof t === 'string') return taskMap.get(t) || null;
          if (t._id) return taskMap.get(t._id) || t;
          return null;
        })
        .filter(Boolean);

      const ownedLists = response.ownedLists?.map((list: any) => ({
        ...list,
        type: 'owned' as const,
        tasks: normalizeTasks(list.tasks)
      })) || [];
      const sharedLists = response.sharedLists?.map((list: any) => ({
        ...list,
        type: 'shared' as const,
        tasks: normalizeTasks(list.tasks)
      })) || [];
      setLists([...ownedLists, ...sharedLists]);
    } catch (err) {
      setError('Failed to fetch lists');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAvailableTasks = useCallback(async () => {
    try {
      const tasks = await getAllTasks();
      setAvailableTasks(tasks);
    } catch (err) {
      setError('Failed to fetch available tasks');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchLists();
    fetchAvailableTasks();
  }, [fetchLists, fetchAvailableTasks]);

  

  const handleAddList = async () => {
    if (newListName.trim()) {
      setIsLoading(true);
      try {
        const newList = await createTaskList(newListName.trim(), '');
        setLists(prevLists => [...prevLists, { 
          ...newList, 
          type: 'owned' as const, 
          name: newListName.trim(),
          tasks: [] as Task[]
        }]);
        setNewListName('');
      } catch (err) {
        setError('Failed to add list');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleRemoveTaskFromList = async (listId: string, taskId: string) => {
    setIsLoading(true);
    try {
      await removeTaskFromList(listId, taskId);
      setLists(prevLists => prevLists.map(list => {
        if (list._id === listId) {
          return {
            ...list,
            tasks: list.tasks.filter(task => task._id !== taskId)
          };
        }
        return list;
      }));
    } catch (err) {
      setError('Failed to remove task from list');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateList = async () => {
    if (editedListName.trim() && editingListId) {
      setIsLoading(true);
      try {
        const updatedList = await updateTaskList(editingListId, editedListName.trim(), '');
        setLists(prevLists => prevLists.map(list => 
          list._id === editingListId ? { ...updatedList, type: list.type, name: editedListName.trim(), tasks: list.tasks } : list
        ));
        setEditingListId(null);
        setEditedListName('');
      } catch (err) {
        setError('Failed to update list');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteList = async (listId: string, deleteTasks: boolean = false) => {
    setIsLoading(true);
    try {
      await deleteTaskList(listId, deleteTasks);
      setLists(prevLists => prevLists.filter(list => list._id !== listId));
      setDeleteModalListId(null);
    } catch (err) {
      setError('Failed to delete list');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareList = (listId: string) => {
    setSharingListId(listId);
  };

const handleShareSubmit = async () => {
  if (sharingEmail && sharingListId) {
    setIsLoading(true);
    try {
      await shareTaskList(sharingListId, sharingEmail, sharingPermission);
      await fetchLists();
      setSharingListId(null);
      setSharingEmail('');
      setSharingPermission('read');
    } catch (err: any) {
      setError('Failed to share list: ' + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
};

  const handleAddTaskToList = async (listId: string) => {
    const taskId = selectedTasksByList[listId];
    if (taskId) {
      // Éviter les doublons
      const targetList = lists.find(l => l._id === listId);
      if (targetList && (targetList.tasks || []).some(t => t._id === taskId)) {
        setError('Cette tâche est déjà dans la liste');
        return;
      }

      setIsLoading(true);
      try {
        await addTaskToList(listId, taskId);
        
        // Récupérer l'objet tâche depuis la liste des tâches disponibles
        const taskObj = availableTasks.find(t => t._id === taskId);
        
        if (!taskObj) {
          setError('Task not found');
          return;
        }

        // Mise à jour de l'état local
        setLists(prevLists => prevLists.map(list => {
          if (list._id === listId) {
            return {
              ...list,
              tasks: [...(list.tasks || []), taskObj]
            };
          }
          return list;
        }));

        // Reset la sélection pour cette liste
        setSelectedTasksByList(prev => ({ ...prev, [listId]: '' }));
      } catch (err: any) {
        setError(`Failed to add task to list: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-4 lg:py-8">
      <div className="w-full px-2 lg:px-4 xl:px-8 2xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Gestion des Listes
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Créez et organisez vos listes de tâches
            </p>
          </div>
      
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Nom de la nouvelle liste"
                className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                onClick={handleAddList}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 flex items-center justify-center"
              >
                <PlusCircle className="mr-2" size={20} />
                Ajouter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {lists.map((list) => (
              <div key={list._id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  {editingListId === list._id ? (
                    <Input
                      type="text"
                      value={editedListName}
                      onChange={(e) => setEditedListName(e.target.value)}
                      placeholder="Edit list name"
                    />
                  ) : (
                    <BadgeComponent 
                      key={list._id} 
                      listName={list.name} 
                    />
                  )}
                  <div className="flex gap-2">
                    {editingListId === list._id ? (
                      <>
                        <button
                          onClick={handleUpdateList}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingListId(null);
                            setEditedListName('');
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        {list.type === 'owned' && (
                          <>
                            <button
                              onClick={() => {
                                setEditingListId(list._id);
                                setEditedListName(list.name);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleShareList(list._id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                            >
                              <Share2 size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteModalListId(list._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Tasks in list */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tâches ({list.tasks?.length || 0})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {list.tasks?.map((task) => (
                      <div key={task._id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                        <TaskComponent 
                          task={task} 
                          onUpdate={() => {}} 
                          onDelete={() => handleRemoveTaskFromList(list._id, task._id)} 
                        />
                        {list.type === 'owned' && (
                          <button
                            onClick={() => handleRemoveTaskFromList(list._id, task._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add task to list */}
                {list.type === 'owned' && (
                  <div className="flex gap-2">
                    <select
                      value={selectedTasksByList[list._id] || ''}
                      onChange={(e) => setSelectedTasksByList(prev => ({ ...prev, [list._id]: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    >
                      <option value="">Sélectionner une tâche</option>
                      {availableTasks
                        .filter(task => !list.tasks?.some(t => t._id === task._id))
                        .map(task => (
                          <option key={task._id} value={task._id}>
                            {task.title}
                          </option>
                        ))
                      }
                    </select>
                    <button
                      onClick={() => handleAddTaskToList(list._id)}
                      disabled={!selectedTasksByList[list._id]}
                      className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <PlusCircle size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteModalListId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                  Supprimer la liste
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Que voulez-vous faire avec les tâches de cette liste ?
                </p>
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => handleDeleteList(deleteModalListId, false)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-left"
                  >
                    Supprimer seulement la liste (conserver les tâches)
                  </button>
                  <button
                    onClick={() => handleDeleteList(deleteModalListId, true)}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 text-left"
                  >
                    Supprimer la liste ET toutes ses tâches
                  </button>
                </div>
                <button
                  onClick={() => setDeleteModalListId(null)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Share Modal */}
          {sharingListId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                  Partager la liste
                </h3>
                <div className="space-y-4">
                  <input
                    type="email"
                    value={sharingEmail}
                    onChange={(e) => setSharingEmail(e.target.value)}
                    placeholder="Email de l'utilisateur"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <select
                    value={sharingPermission}
                    onChange={(e) => setSharingPermission(e.target.value as 'read' | 'write')}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="read">Lecture seule</option>
                    <option value="write">Lecture et écriture</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={handleShareSubmit}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                  >
                    Partager
                  </button>
                  <button
                    onClick={() => {
                      setSharingListId(null);
                      setSharingEmail('');
                      setSharingPermission('read');
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-2 text-white hover:text-red-200"
              >
                ×
              </button>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Chargement...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddListPage;