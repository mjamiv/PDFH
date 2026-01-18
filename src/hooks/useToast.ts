/**
 * useToast Hook
 * Toast notification state management
 */

import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, options: ToastOptions = {}) => {
    const { type = 'info', duration = 3000 } = options;
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const toast: Toast = { id, message, type, duration };
    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    return addToast(message, { type: 'success', duration });
  }, [addToast]);

  const error = useCallback((message: string, duration?: number) => {
    return addToast(message, { type: 'error', duration });
  }, [addToast]);

  const warning = useCallback((message: string, duration?: number) => {
    return addToast(message, { type: 'warning', duration });
  }, [addToast]);

  const info = useCallback((message: string, duration?: number) => {
    return addToast(message, { type: 'info', duration });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}

export default useToast;
