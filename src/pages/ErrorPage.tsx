import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorPageProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  title = "Connexion impossible", 
  message = "Impossible de se connecter au serveur. Vérifiez que le backend est démarré.",
  showRetry = true 
}) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <AlertTriangle className="h-20 w-20 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            {message}
          </p>
        </div>

        <div className="space-y-4">
          {showRetry && (
            <Button
              onClick={handleRetry}
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Réessayer
            </Button>
          )}
          
          <Button
            onClick={handleGoHome}
            variant="secondary"
            size="lg"
            className="w-full flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Button>
        </div>

        <div className="mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p>Si le problème persiste :</p>
          <ul className="mt-2 space-y-1">
            <li>• Vérifiez que le serveur backend est démarré</li>
            <li>• Vérifiez votre connexion internet</li>
            <li>• Contactez l'administrateur</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;