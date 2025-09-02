import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../api/task';
import { getAllCategories } from '../api/category';
import { showSuccess, showError } from '../utils/toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Calendar, Tag, FileText, Plus, ArrowLeft } from 'lucide-react';

const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      showError("Erreur lors du chargement des catégories");
      console.error("Error fetching categories:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const newTask = {
      title,
      category,
      deadline,
      description,
      completed: false
    };
    
    try {
      await createTask(newTask);
      showSuccess('Tâche créée avec succès!');
      navigate('/');
    } catch (err) {
      showError("Erreur lors de la création de la tâche");
      console.error("Error creating task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-4 lg:py-8">
      <div className="w-full px-2 lg:px-4 xl:px-8 2xl:px-16">
        {/* Header */}
        <div className="flex items-center mb-6 lg:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 dark:text-white">
              Créer une Tâche
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Ajoutez une nouvelle tâche à votre liste
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="p-4 lg:p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
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
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Entrez le titre de votre tâche"
                required
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description (optionnelle)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Décrivez votre tâche..."
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
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Tag className="h-4 w-4 mr-2" />
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Boutons */}
            <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 lg:gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="flex-1 flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Créer la tâche
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;