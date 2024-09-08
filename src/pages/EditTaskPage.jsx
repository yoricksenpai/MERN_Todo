import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form from '../components/FormComponent';
import Input from '../components/InputComponent';
import { getTask, updateTask } from '../api/task';

const EditTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTask = await getTask(id);
        setTask(fetchedTask);
        setTitle(fetchedTask.title);
        setDescription(fetchedTask.description);
        setDeadline(fetchedTask.deadline ? new Date(fetchedTask.deadline).toISOString().split('T')[0] : '');
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch task:', err);
        setError('Échec de la récupération de la tâche. Veuillez réessayer.');
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(id, { title, description, deadline });
      navigate('/'); // Redirection vers la liste des tâches après la mise à jour
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Échec de la mise à jour de la tâche. Veuillez réessayer.');
    }
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Modifier la tâche</h2>
      <Form onSubmit={handleSubmit} submitButtonText="Mettre à jour la tâche">
        <Input
          id="title"
          label="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          id="deadline"
          type="date"
          label="Date d'échéance"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>
      </Form>
    </div>
  );
};

export default EditTaskPage;