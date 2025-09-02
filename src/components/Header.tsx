import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logout as apiLogout } from '../api/auth';
import { useNavigate } from 'react-router-dom';

/**
 * Renders the header of the application with a link to the home page, a
 * dropdown menu with links to create a task, edit categories, and add a
 * task list, and a logout button if the user is connected.
 *
 * @returns {JSX.Element} The rendered header component.
 */
const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiLogout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };
  useEffect(() => {
    /**
     * Handles a click outside of the dropdown menu, and closes it
     * if the click was outside of the menu.
     *
     * @param {Event} event - The event to handle.
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  /**
   * Logs out the current user and redirects to the home page.
   *
   * @async
   * @throws {Error} If the logout fails
   */

  /**
   * Redirects to the authentication page.
   */
  const handleAuthClick = () => {
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md border-b border-slate-200 dark:border-slate-700">
      <div className="w-full px-3 sm:px-4">
        <div className="flex flex-wrap justify-between items-center py-3 sm:py-4 lg:py-6 gap-2">
          <div className="flex-shrink-0">
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 dark:text-white">
              <a href='/' className="hover:text-emerald-600 transition-colors">TodoApp</a>
            </h1>
          </div>
          
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative inline-block text-left" ref={dropdownRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isDropdownOpen}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm px-3 py-2 sm:px-4 sm:py-2 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  onClick={toggleDropdown}
                >
                  Actions
                  <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
                </button>
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 sm:w-64 rounded-lg shadow-lg bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 z-50">
                    <div className="py-2">
                      <a href="/create_task" className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Créer une tâche</a>
                      <a href="/manage_categories" className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Éditer catégories</a>
                      <a href="/add_list" className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Ajouter liste</a>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleLogout} 
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 sm:px-4 lg:px-6 rounded-lg flex items-center transition-colors"
              >
                <LogOut className="mr-2" size={18} />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAuthClick} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-3 sm:px-4 lg:px-6 rounded-lg flex items-center transition-colors"
            >
              <LogIn className="mr-2" size={18} />
              <span className="hidden sm:inline">Connexion</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;