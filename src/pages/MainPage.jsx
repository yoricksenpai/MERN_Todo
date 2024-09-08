import { useState, useEffect, useCallback } from 'react';
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

const TodoListMainPage = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(4);
  const [selectedList, setSelectedList] = useState('Toutes les tâches');
  const [taskLists, setTaskLists] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCategoryFiltered, setIsCategoryFiltered] = useState(false);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handleCategoryChange = (categoryId) => {
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
    }
  }, [selectedList, sortBy, categoryFilter, statusFilter, taskLists]);

  useEffect(() => {
    fetchTaskLists();
  }, [fetchTaskLists]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      alert('Impossible de supprimer la tâche. Veuillez réessayer.');
    }
  };

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className="max-w-6xl mx-auto p-4 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Liste des tâches</h1>
      
      <div className="mb-4">
        <button
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isFilterVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>
      </div>

      {isFilterVisible && (
        <FilterComponent
          sortBy={sortBy}
          onSortChange={setSortBy}
          onCategoryChange={handleCategoryChange}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      )}

      <div className="mb-4">
        <label htmlFor="taskList" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Sélectionner une liste de tâches :
        </label>
        <select
          id="taskList"
          value={selectedList}
          onChange={(e) => {
            setSelectedList(e.target.value);
            setCurrentPage(1);
          }}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {taskLists.map((list) => (
            <option key={list.id} value={list.name}>
              {list.name}
            </option>
          ))}
        </select>
      </div>

      {currentTasks.map((task) => (
        <TaskComponent
          key={task._id}
          task={task}
          onUpdate={handleTaskUpdate}
          onDelete={handleDeleteTask}
        />
      ))}

      <PaginationComponent
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <BadgeComponent tasks={tasks} />
    </div>
  );
};

export default TodoListMainPage;