import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  // Ajoutez d'autres champs si nécessaire
}

interface UserContextType {
  userInfo: User | null;
  setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  userInfo: null,
  setUserInfo: () => {},
  isAuthenticated: false,
  checkAuth: async () => {},
  logout: () => {}
});

export const UserContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User | null>(() => {
    // Initialise l'état avec la valeur stockée dans localStorage, si elle existe
    const storedUser = localStorage.getItem('userInfo');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        credentials: 'include'
      });
      if (response.ok) {
        const user = await response.json();
        setUserInfo(user);
        setIsAuthenticated(true);
        localStorage.setItem('userInfo', JSON.stringify(user)); // Persiste l'utilisateur
      } else {
        setUserInfo(null);
        setIsAuthenticated(false);
        localStorage.removeItem('userInfo'); // Efface les données utilisateur
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      setUserInfo(null);
      setIsAuthenticated(false);
      localStorage.removeItem('userInfo'); // Efface les données utilisateur
    }
  }, []);

  const logout = () => {
    setUserInfo(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userInfo');
    // Ici, vous pourriez aussi appeler une API pour déconnecter l'utilisateur côté serveur
    navigate('/login_register'); // Redirection après déconnexion
  };

  useEffect(() => {
    // Vérifie l'authentification au chargement initial de l'application
    checkAuth();
  }, [checkAuth]);

  // Utiliser useLocation pour surveiller les changements de route
  useEffect(() => {
    // On vérifie l'authentification à chaque changement de route
    checkAuth();
  }, [location, checkAuth]);

  const value = { userInfo, setUserInfo, isAuthenticated, checkAuth, logout };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};