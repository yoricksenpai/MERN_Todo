/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { getAllCategories } from '../api/category'; // Assurez-vous que ce chemin est correct

const FilterComponent = ({ sortBy, onSortChange, onCategoryChange, categoryFilter, statusFilter, setStatusFilter }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        setCategories([{ _id: 'all', name: 'Toutes' }, ...fetchedCategories]);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">Filtres</h2>
      
      <div className="mb-4">
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Trier par :
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="date">Date d'échéance</option>
          <option value="alphabetical">Ordre alphabétique</option>
          <option value="all">Toutes les tâches</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Catégorie :
        </label>
        <select
          id="category"
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Statut :
        </label>
        <select
          id="status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">Toutes</option>
          <option value="completed">Terminées</option>
          <option value="uncompleted">Non terminées</option>
        </select>
      </div>
    </div>
  );
};

export default FilterComponent;