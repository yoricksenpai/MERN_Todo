import React, { useState, useEffect, useCallback } from 'react';
import FilterComponent from '../components/FilterComponent';
import TaskComponent from '../components/TaskComponent';
import PaginationComponent from '../components/PaginationComponent';
import BadgeComponent from '../components/BadgeComponent';
import {
  getAllTasks,
  getRecentTasks,
  getTasksSortedByDeadline,
  getTasksSortedAlphabetically,
  getTasksByCategory,
  deleteTask,
  getTasksByStatus,
} from '../api/task';
import { getAllTaskLists, getTasksForList } from '../api/tasklist';
import { showSuccess, showError } from '../utils/toast';
import { Task, TaskList } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const TodoListMainPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tasksPerPage] = useState<number>(4);
  const [selectedList, setSelectedList] = useState<string>('Toutes les tâches');
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('date');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCategoryFiltered, setIsCategoryFiltered] = useState<boolean>(false);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handleCategoryChange = (categoryId: string) => {
    setCategoryFilter(categoryId);
    setIsCategoryFiltered(categoryId !== 'all');
    if (categoryId !== 'all') {
      setSortBy('all');
    }
  };

  const fetchTaskLists = useCallback(async () => {
    try {
      const response = await getAllTaskLists();
      console.log('Fetched lists:', response);

const ownedLists = response.ownedLists?.map(list => ({ ...list, type: 'owned' })) || [];
const sharedLists = response.sharedLists?.map(list => ({ ...list, type: 'shared' })) || [];
const allLists = [...ownedLists, ...sharedLists];

setTaskLists([{ name: 'Toutes les tâches', id: null }, ...allLists]);
    } catch (error) {
      console.error('Error fetching task lists:', error);
      showError('Erreur lors du chargement des listes');
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      let fetchedTasks;

      if (selectedList === 'Toutes les tâches') {
        if (categoryFilter !== 'all') {
          fetchedTasks = await getTasksByCategory(categoryFilter);
        } else {
          switch (sortBy) {
            case 'all':
              fetchedTasks = await getAllTasks();
              break;
            case 'date':
              fetchedTasks = await getTasksSortedByDeadline();
              break;
            case 'alphabetical':
              fetchedTasks = await getTasksSortedAlphabetically();
              break;
            default:
              fetchedTasks = await getRecentTasks();
          }
        }
      } else {
        const selectedTaskList = taskLists.find(list => list.name === selectedList);
if (selectedTaskList && selectedTaskList._id) {
  fetchedTasks = await getTasksForList(selectedTaskList._id);
} else {
  console.error('Selected task list not found or has no id');
  fetchedTasks = [];
}
      }

      if (statusFilter !== 'all') {
        const completed = statusFilter === 'completed';
        fetchedTasks = await getTasksByStatus(completed);
      }

      console.log('Fetched tasks:', fetchedTasks);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showError('Erreur lors du chargement des tâches');
    }
  }, [selectedList, sortBy, categoryFilter, statusFilter, taskLists]);

  useEffect(() => {
    fetchTaskLists();
  }, [fetchTaskLists]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      showSuccess('Tâche supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      showError('Impossible de supprimer la tâche');
    }
  };

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const sortLabel = sortBy === 'date' ? "Date d'échéance" : sortBy === 'alphabetical' ? 'Alphabétique' : 'Toutes';
  const statusLabel = statusFilter === 'all' ? 'Toutes' : statusFilter === 'completed' ? 'Terminées' : 'Non terminées';
  const categoryLabel = categoryFilter === 'all' ? 'Toutes' : 'Filtrée';

  return (
    <div className="w-full">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 pt-4 lg:pt-8 pb-8 lg:pb-12">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Mes Tâches
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400">
            Organisez et gérez vos tâches efficacement
          </p>
        </div>
      
        {/* Layout responsive */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Sidebar - Contrôles et filtres */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-24">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                Contrôles
              </h2>
              
              <div className="space-y-4">
                <Button
                  variant={isFilterVisible ? 'secondary' : 'primary'}
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                  className="w-full"
                >
                  {isFilterVisible ? 'Masquer filtres' : 'Afficher filtres'}
                </Button>
                
                <div>
                  <label htmlFor="taskList" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Liste de tâches
                  </label>
                  <select
                    id="taskList"
                    value={selectedList}
                    onChange={(e) => {
                      setSelectedList(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {taskLists.map((list) => (
                      <option key={(list as any)._id || (list as any).id || list.name} value={list.name}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
            
            {isFilterVisible && (
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                  Filtres
                </h2>
                <FilterComponent
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onCategoryChange={handleCategoryChange}
                  categoryFilter={categoryFilter}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                />
              </Card>
            )}
            
                      </div>

          {/* Zone principale - Tâches */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-4">
            <Card className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200">Actions rapides</div>
                <div className="flex flex-wrap gap-2">
                  <a href="/create_task"><Button size="sm" variant="primary">Créer une tâche</Button></a>
                  <a href="/manage_categories"><Button size="sm" variant="secondary">Catégories</Button></a>
                  <a href="/add_list"><Button size="sm" variant="secondary">Ajouter liste</Button></a>
                </div>
              </div>
            </Card>
            {/* Barre de résumé */}
            <Card className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total:</span>
                  <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-1 text-sm font-medium text-slate-800 dark:text-slate-200">{totalTasks}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Terminées:</span>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-3 py-1 text-sm font-medium">{completedTasks}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">En cours:</span>
                  <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1 text-sm font-medium">{totalTasks - completedTasks}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                  Liste: {selectedList} • Tri: {sortLabel} • Statut: {statusLabel} • Catégorie: {categoryLabel}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant={statusFilter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setStatusFilter('all')}>Toutes</Button>
                <Button variant={statusFilter === 'uncompleted' ? 'primary' : 'secondary'} size="sm" onClick={() => setStatusFilter('uncompleted')}>À faire</Button>
                <Button variant={statusFilter === 'completed' ? 'primary' : 'secondary'} size="sm" onClick={() => setStatusFilter('completed')}>Terminées</Button>
                <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                <Button variant={sortBy === 'date' ? 'primary' : 'secondary'} size="sm" onClick={() => setSortBy('date')}>Par date</Button>
                <Button variant={sortBy === 'alphabetical' ? 'primary' : 'secondary'} size="sm" onClick={() => setSortBy('alphabetical')}>A-Z</Button>
                <Button variant={sortBy === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setSortBy('all')}>Toutes</Button>
              </div>
            </Card>

            {/* Grid de tâches adaptatif */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-4">
              {currentTasks.length === 0 ? (
                <div className="col-span-full">
                  <Card className="p-16 text-center">
                    <div className="text-slate-400 dark:text-slate-500">
                      <svg className="mx-auto h-20 w-20 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <h3 className="text-2xl font-medium mb-3">Aucune tâche</h3>
                      <p className="text-lg">Commencez par créer votre première tâche</p>
                      <div className="mt-6">
                        <a href="/create_task"><Button variant="primary">Créer une tâche</Button></a>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                currentTasks.map((task) => (
                  <TaskComponent
                    key={task._id}
                    task={task}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleDeleteTask}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <PaginationComponent
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
            
            {/* Stats pour mobile/tablette */}
            <div className="xl:hidden">
              <BadgeComponent tasks={tasks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoListMainPage;