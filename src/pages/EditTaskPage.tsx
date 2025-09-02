import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask, updateTask } from '../api/task';
import { showSuccess, showError } from '../utils/toast';
import { Task } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Save, Calendar, FileText } from 'lucide-react';

const EditTaskPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) {
        setError('ID de tâche manquant');
        setIsLoading(false);
        return;
      }
      
      try {
        const fetchedTask = await getTask(id);
        setTask(fetchedTask);
        setTitle(fetchedTask.title || '');
        setDescription(fetchedTask.description || '');
        // Formater en YYYY-MM-DDTHH:mm (datetime-local)
        if (fetchedTask.deadline) {
          const d = new Date(fetchedTask.deadline);
          const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
          setDeadline(local);
        } else {
          setDeadline('');
        }
        setCategory(fetchedTask.category || '');
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch task:', err);
        setError('Échec de la récupération de la tâche. Veuillez réessayer.');
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Convertir en ISO avant l'envoi si une date est définie
      const payloadDeadline = deadline ? new Date(deadline).toISOString() : undefined;
      await updateTask(id!, { title, description, deadline: payloadDeadline as any, category });
      showSuccess('Tâche mise à jour avec succès!');
      navigate('/');
    } catch (err) {
      console.error('Failed to update task:', err);
      showError('Échec de la mise à jour de la tâche');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 text-center">
        <p className="text-xl mb-4">{error}</p>
        <Button onClick={() => navigate('/')} variant="secondary">
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-4 lg:py-8">
      <div className="w-full px-2 lg:px-4 xl:px-8 2xl:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                Modifier la Tâche
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Modifiez les détails de votre tâche
              </p>
            </div>
          </div>

          <Card className="p-6 lg:p-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Chargement...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Titre */}
                <div className="lg:col-span-2">
                  <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <FileText className="h-4 w-4 mr-2" />
                    Titre de la tâche
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Date d'échéance */}
                <div>
                  <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date d'échéance
                  </label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Boutons */}
                <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isLoading}
                    className="flex-1 flex items-center justify-center"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Mettre à jour
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/')}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditTaskPage;