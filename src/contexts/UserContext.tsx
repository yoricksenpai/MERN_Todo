import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { getProfile, logout as apiLogout } from '../api/auth';

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
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = useCallback(async () => {
    try {
      const user = await getProfile();
      setUserInfo(user);
      setIsAuthenticated(true);
    } catch (error) {
      setUserInfo(null);
      setIsAuthenticated(false);
    }
  }, []);

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
    setUserInfo(null);
    setIsAuthenticated(false);
    navigate('/login_register');
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