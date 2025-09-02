import { useState, useCallback } from 'react';
import { showError, showLoading, dismissToast } from '../utils/toast';

interface UseAsyncReturn<T> {
  loading: boolean;
  error: string | null;
  execute: (asyncFunction: () => Promise<T>, loadingMessage?: string) => Promise<T>;
}

export const useAsync = <T = any>(): UseAsyncReturn<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (asyncFunction: () => Promise<T>, loadingMessage = 'Chargement...'): Promise<T> => {
    setLoading(true);
    setError(null);
    
    const toastId = showLoading(loadingMessage);
    
    try {
      const result = await asyncFunction();
      dismissToast(toastId);
      return result;
    } catch (err) {
      dismissToast(toastId);
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};