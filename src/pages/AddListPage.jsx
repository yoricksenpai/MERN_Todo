import  { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Edit2, Share2, Trash2 } from 'lucide-react';
import BadgeComponent from '../components/BadgeComponent';
import { createTaskList, getAllTaskLists, updateTaskList, deleteTaskList, shareTaskList, addTaskToList, removeTaskFromList } from '../api/tasklist';
import { getAllTasks } from '../api/task';
import TaskComponent from '../components/TaskComponent';
import Input from '../components/InputComponent';

const AddListPage = () => {
  const [lists, setLists] = useState([]);
    const [existingTaskIds, setExistingTaskIds] = useState(new Set());
  const [newListName, setNewListName] = useState('');
  const [sharingListId, setSharingListId] = useState(null);
  const [sharingEmail, setSharingEmail] = useState('');
  const [sharingPermission, setSharingPermission] = useState('read');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingListId, setEditingListId] = useState(null);
  const [editedListName, setEditedListName] = useState('');
  const [availableTasks, setAvailableTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');

   // Fonction utilitaire pour filtrer les tâches non existantes
  const filterExistingTasks = useCallback((tasks) => {
    return tasks.filter(task => existingTaskIds.has(task._id));
  }, [existingTaskIds]);

    const fetchLists = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllTaskLists();
      const allTasks = await getAllTasks();
      
      // Créer un Set avec les IDs des tâches existantes
      const taskIds = new Set(allTasks.map(task => task._id));
      setExistingTaskIds(taskIds);

      const ownedLists = response.ownedLists?.map(list => ({
        ...list,
        type: 'owned',
        tasks: filterExistingTasks(list.tasks || [])
      })) || [];
      const sharedLists = response.sharedLists?.map(list => ({
        ...list,
        type: 'shared',
        tasks: filterExistingTasks(list.tasks || [])
      })) || [];
      setLists([...ownedLists, ...sharedLists]);
    } catch (err) {
      setError('Failed to fetch lists');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filterExistingTasks]);

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
        setLists(prevLists => [...prevLists, { ...newList, type: 'owned', name: newListName.trim() }]);
        setNewListName('');
      } catch (err) {
        setError('Failed to add list');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };
 const handleRemoveTaskFromList = async (listId, taskId) => {
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
    if (editedListName.trim()) {
      setIsLoading(true);
      try {
        const updatedList = await updateTaskList(editingListId, editedListName.trim(), '');
        setLists(prevLists => prevLists.map(list => 
          list._id === editingListId ? { ...updatedList, type: list.type, name: editedListName.trim() } : list
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

  const handleDeleteList = async (listId) => {
    setIsLoading(true);
    try {
      await deleteTaskList(listId);
      setLists(prevLists => prevLists.filter(list => list._id !== listId));
    } catch (err) {
      setError('Failed to delete list');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareList = (listId) => {
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
    } catch (err) {
      setError('Failed to share list: ' + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
};

const handleAddTaskToList = async (listId) => {
  if (selectedTask) {
    setIsLoading(true);
    try {
      console.log('Adding task to list:', listId, selectedTask);
      const newTask = await addTaskToList(listId, selectedTask);
      console.log('Task added successfully:', newTask);
      
      // Mise à jour de l'état local
      setLists(prevLists => prevLists.map(list => {
        if (list._id === listId) {
          return {
            ...list,
            tasks: [...(list.tasks || []), newTask]
          };
        }
        return list;
      }));
      setSelectedTask('');
    } catch (err) {
      console.error('Detailed error:', err);
      setError(`Failed to add task to list: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }
};

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Manage Task Lists</h2>
      
      <div className="flex mb-6">
        <Input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Enter new list name"
        />
        <button
          onClick={handleAddList}
          className="ml-2 inline-block rounded border border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
        >
          <PlusCircle className="inline-block mr-2" size={16} />
          Add List
        </button>
      </div>

      <div className="space-y-4">
        {lists.map((list) => (
          <div key={list._id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
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
              <div>
                {editingListId === list._id ? (
                  <button
                    onClick={handleUpdateList}
                    className="mr-2 inline-block rounded border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-600 hover:text-white focus:outline-none focus:ring active:bg-green-500"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingListId(list._id)}
                    className="mr-2 inline-block rounded border border-yellow-600 px-4 py-2 text-sm font-medium text-yellow-600 hover:bg-yellow-600 hover:text-white focus:outline-none focus:ring active:bg-yellow-500"
                  >
                    <Edit2 size={16} className="inline-block mr-1" />
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleShareList(list._id)}
                  className="mr-2 inline-block rounded border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-600 hover:text-white focus:outline-none focus:ring active:bg-green-500"
                >
                  <Share2 size={16} className="inline-block mr-1" />
                  Share
                </button>
                <button
                  onClick={() => handleDeleteList(list._id)}
                  className="inline-block rounded border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus:ring active:bg-red-500"
                >
                  <Trash2 size={16} className="inline-block mr-1" />
                  Delete
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2 dark:text-white">Tasks:</h4>
              {list.tasks && list.tasks.map((task) => (
                <TaskComponent
                  key={task._id}
                  task={task}
                  onDelete={() => handleRemoveTaskFromList(list._id, task._id)}
                />
              ))}
              <div className="mt-2 flex">
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select a task to add</option>
                  {availableTasks.map((task) => (
                    <option key={task._id} value={task._id}>{task.title}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleAddTaskToList(list._id)}
                  className="ml-2 inline-block rounded border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
                >
                  Add Task
                </button>
              </div>
            </div>

            {list.sharedWith && list.sharedWith.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-1 dark:text-white">Shared with:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300">
                  {list.sharedWith.map((share, index) => (
                    <li key={index}>{share.user} ({share.permissions})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {sharingListId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Share List</h3>
            <Input
              type="email"
              value={sharingEmail}
              onChange={(e) => setSharingEmail(e.target.value)}
              placeholder="Enter email to share with"
            />
            <select
              value={sharingPermission}
              onChange={(e) => setSharingPermission(e.target.value)}
              className="w-full mb-4 shadow appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="read">Read</option>
              <option value="write">Write</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={() => setSharingListId(null)}
                className="mr-2 inline-block rounded border border-gray-600 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring active:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleShareSubmit}
                className="inline-block rounded border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddListPage;