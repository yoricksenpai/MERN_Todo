// UserContext.tsx

import React, { createContext, useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
}

interface UserContextType {
  userInfo: User | null;
  setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType>({
  userInfo: null,
  setUserInfo: () => {}
});

export const UserContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement de l'application
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/profile', {
          credentials: 'include'
        });
        if (response.ok) {
          const user = await response.json();
          setUserInfo(user);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
      }
    };
    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte utilisateur
export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};