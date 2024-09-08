import { useState, useEffect } from 'react';
import { createCategory, getAllCategories, deleteCategory } from '../api/category';

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
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

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setError(null);
    if (newCategoryName.trim()) {
      try {
        const newCategory = await createCategory({ name: newCategoryName.trim() });
        setCategories(prev => [...prev, newCategory]);
        setNewCategoryName('');
      } catch (err) {
        setError("Erreur lors de la création de la catégorie. Veuillez réessayer.");
        console.error("Error creating category:", err);
      }
    }
  };

const handleDeleteCategory = async (categoryId) => {
  setError(null);
  try {
    await deleteCategory(categoryId);
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  } catch (err) {
    setError("Erreur lors de la suppression de la catégorie. Veuillez réessayer.");
    console.error("Error deleting category:", err);
  }
};

  return (
    <div className="max-w-2xl mx-auto p-4 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Gérer les catégories</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleCreateCategory} className="mb-6">
        <div className="flex items-center gap-x-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nouvelle catégorie"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ajouter
          </button>
        </div>
      </form>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 dark:text-white">Catégories existantes</h2>
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {category.name}
            </span>
            <button
  onClick={() => handleDeleteCategory(category._id)}
  className="bg-red-600 text-white px-2 py-1 rounded-md text-sm hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
>
  Supprimer
</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCategoriesPage;