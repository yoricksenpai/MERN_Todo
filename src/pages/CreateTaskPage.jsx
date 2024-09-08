import { useState, useEffect } from 'react';
import { createTask } from '../api/task'; // Assurez-vous que le chemin d'importation est correct
import { getAllCategories } from '../api/category'; // Importez la fonction pour récupérer les catégories
import Form from '../components/FormComponent';
import Input from '../components/InputComponent';

const CreateTaskPage = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      setError("Erreur lors du chargement des catégories. Veuillez réessayer.");
      console.error("Error fetching categories:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const newTask = {
      title: taskTitle,
      category: taskCategory,
      deadline: taskDeadline,
      description: taskDescription,
      completed: false
    };
    
    try {
      await createTask(newTask);
      // Reset form
      setTaskTitle('');
      setTaskCategory('');
      setTaskDeadline('');
      setTaskDescription('');
      // Vous pouvez ajouter ici une notification de succès ou une redirection
    } catch (err) {
      setError("Erreur lors de la création de la tâche. Veuillez réessayer.");
      console.error("Error creating task:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Créer une nouvelle tâche</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <Form onSubmit={handleSubmit} submitButtonText="Créer la tâche">
        <Input
          id="taskTitle"
          label="Titre"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
        />
        <div className="mb-4">
          <label htmlFor="taskCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
<select
  id="taskCategory"
  value={taskCategory}
  onChange={(e) => setTaskCategory(e.target.value)}
  required
  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
>
  <option value="">Sélectionnez une catégorie</option>
  {categories.map((category) => (
    <option key={category._id} value={category._id}>{category.name}</option>
  ))}
</select>
        </div>
        <Input
          type="date"
          id="taskDeadline"
          label="Date d'échéance"
          value={taskDeadline}
          onChange={(e) => setTaskDeadline(e.target.value)}
        />
        <div className="mb-4">
          <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>
      </Form>
    </div>
  );
};

export default CreateTaskPage;