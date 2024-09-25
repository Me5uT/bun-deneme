import { toast, ToastContent, ToastOptions } from 'react-toastify';

export const showToast = (content: ToastContent<unknown>, options?: ToastOptions<unknown>) => {
  toast(content, {
    ...options,
    autoClose: options?.autoClose ?? 3000,
    type: options?.type ?? 'success',
    hideProgressBar: options?.hideProgressBar ?? true,
    closeButton: options?.closeButton ?? false,
  });
};
