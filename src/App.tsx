import React, { lazy, Suspense } from 'react';
import './index.css'
import './styles/globals.css'
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer'
import NotificationList from './components/Notifications';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading des pages
const LoginRegisterPage = lazy(() => import('./pages/auth/LoginAndRegister'));
const TodoListMainPage = lazy(() => import('./pages/MainPage'));
const AddListPage = lazy(() => import('./pages/AddListPage'));
const ManageCategoriesPage = lazy(() => import('./pages/ManageCategoriesPage'));
const CreateTaskPage = lazy(() => import('./pages/CreateTaskPage'));
const EditTaskPage = lazy(() => import('./pages/EditTaskPage'));

// Composant pour les routes publiques
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>
);

// Composant principal de l'app
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {isAuthenticated && <Header />}
      <main className="w-full flex-1 animate-fadeIn">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path='/login' element={
              <PublicRoute>
                <LoginRegisterPage />
              </PublicRoute>
            } />
            <Route path='/' element={
              <ProtectedRoute>
                <TodoListMainPage />
              </ProtectedRoute>
            } />
            <Route path='/add_list' element={
              <ProtectedRoute>
                <AddListPage />
              </ProtectedRoute>
            } />
            <Route path='/manage_categories' element={
              <ProtectedRoute>
                <ManageCategoriesPage />
              </ProtectedRoute>
            } />
            <Route path='/create_task' element={
              <ProtectedRoute>
                <CreateTaskPage />
              </ProtectedRoute>
            } />
            <Route path='/edit_task/:id' element={
              <ProtectedRoute>
                <EditTaskPage />
              </ProtectedRoute>
            } />
            {/* Redirection par défaut */}
            <Route path='*' element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
          </Routes>
        </Suspense>
        {isAuthenticated && <NotificationList />}
      </main>
      {isAuthenticated && <Footer />}
      <Toaster />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
