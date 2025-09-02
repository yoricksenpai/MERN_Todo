import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategory, getAllCategories, deleteCategory } from '../api/category';
import { showSuccess, showError } from '../utils/toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Tag, Plus, Trash2, ArrowLeft } from 'lucide-react';

const ManageCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
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

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setLoading(true);
    try {
      const newCategory = await createCategory({ name: newCategoryName.trim() });
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      showSuccess('Catégorie créée avec succès!');
    } catch (err) {
      showError("Erreur lors de la création de la catégorie");
      console.error("Error creating category:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat._id !== categoryId));
      showSuccess('Catégorie supprimée avec succès!');
    } catch (err) {
      showError("Erreur lors de la suppression de la catégorie");
      console.error("Error deleting category:", err);
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
              Gérer les Catégories
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Organisez vos tâches par catégories
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Formulaire de création */}
          <Card className="p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-4 text-slate-900 dark:text-white flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle Catégorie
            </h2>
            
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Tag className="h-4 w-4 mr-2" />
                  Nom de la catégorie
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Entrez le nom de la catégorie"
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Créer la catégorie
              </Button>
            </form>
          </Card>

          {/* Liste des catégories */}
          <Card className="p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-4 text-slate-900 dark:text-white flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Catégories Existantes ({categories.length})
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {categories.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune catégorie créée</p>
                  <p className="text-sm">Commencez par créer votre première catégorie</p>
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-3 text-emerald-600" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        {category.name}
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCategoriesPage;