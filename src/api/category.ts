import { Category, ApiResponse } from '../types';
import API_BASE_URL from '../constants/Api';

const API_URL = API_BASE_URL; 



/**
 * A utility function to handle JSON responses from the server.
 * If the response is ok, it returns the JSON data.
 * If the response is not ok, it throws an error containing the error message
 * from the server, or the statusText from the response if no error message is
 * available.
 * @param {Response} response The response object from the server.
 * @return {Promise<Object>} A promise that resolves with the JSON data if the
 * response is ok, or rejects with an error if the response is not ok.
 */
const handleResponse = async <T = any>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    throw data.error || response.statusText;
  }
  return data;
};

/**
 * Creates a new category on the server.
 * @param {Object} categoryData - An object with the properties name and description.
 * @return {Promise<Object>} A promise that resolves with the new category object if the
 * response is ok, or rejects with an error if the response is not ok.
 */
export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
  const response = await fetch( `${API_URL}/cat/category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoryData),
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * Retrieves a category by its ID from the server.
 * @param {string} categoryId - The ID of the category to retrieve.
 * @return {Promise<Object>} A promise that resolves with the category object if the
 * response is ok, or rejects with an error if the response is not ok.
 */
export const getCategoryById = async (categoryId: string): Promise<Category> => {
  const response = await fetch(`${API_URL}/cat/category/${categoryId}`, {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * Retrieves all categories from the server.
 * @return {Promise<Object[]>} A promise that resolves with an array of category
 * objects if the response is ok, or rejects with an error if the response is not
 * ok.
 */
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await fetch( `${API_URL}/cat/category`, {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(response);
};

/**
 * Deletes a category by its ID from the server.
 * @param {string} categoryId - The ID of the category to delete.
 * @return {Promise<Object>} A promise that resolves with the deleted category
 * object if the response is ok, or rejects with an error if the response is not
 * ok.
 */
export const deleteCategory = async (categoryId: string): Promise<ApiResponse> => {
  if (!categoryId) {
    throw new Error("ID de catégorie invalide");
  }
  const response = await fetch(`${API_URL}/cat/category/${categoryId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(response);
};
