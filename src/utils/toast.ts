import toast from 'react-hot-toast';

export const showSuccess = (message: string): void => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
  });
};

export const showError = (message: string): void => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
  });
};

export const showLoading = (message: string): string => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

export const dismissToast = (toastId: string): void => {
  toast.dismiss(toastId);
};