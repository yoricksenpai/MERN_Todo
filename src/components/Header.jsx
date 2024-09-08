import { useState, useRef, useEffect } from 'react';
import {  ChevronDown, LogIn, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

/**
 * Renders the header of the application with a link to the home page, a
 * dropdown menu with links to create a task, edit categories, and add a
 * task list, and a logout button if the user is connected.
 *
 * @returns {JSX.Element} The rendered header component.
 */
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { userInfo, setUserInfo } = useUser();  // Utilisez userInfo au lieu de user
  const navigate = useNavigate();

const handleLogout = async () => {
    try {
      // Implémentez ici la logique de déconnexion
      // Par exemple :
      // await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      setUserInfo(null);  // Mettez à jour le contexte utilisateur
      navigate('/');
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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
    navigate('/login_register');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900"><a href='/'>TodoList</a></h1>
          </div>
          
          {userInfo ? (
            <div className="flex items-center">
              <div className="relative inline-block text-left mr-2" ref={dropdownRef}>
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                  onClick={toggleDropdown}
                >
                  Actions
                  <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </button>
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <a href="/create_task" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Create Task</a>
                      <a href="/manage_categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Edit Categories</a>
                      <a href="/add_list" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Add Task List</a>
                    </div>
                  </div>
                )}
              </div>
<button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <LogOut className="mr-2" size={16} />
            Logout
          </button>
            </div>
          ) : (
            <div className="flex items-center">
 <button onClick={handleAuthClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <LogIn className="mr-2" size={16} />
            Login / Register
          </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;