'use client';

import * as React from 'react';
import { type ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 4000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
};

type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string };

interface State { toasts: ToasterToast[] }

let count = 0;
const genId = () => (++count % Number.MAX_SAFE_INTEGER).toString();

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string, dispatch: React.Dispatch<Action>) => {
  if (toastTimeouts.has(toastId)) return;
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: 'REMOVE_TOAST', toastId });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case 'UPDATE_TOAST':
      return { ...state, toasts: state.toasts.map((t) => t.id === action.toast.id ? { ...t, ...action.toast } : t) };
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.map((t) => (!action.toastId || t.id === action.toastId) ? { ...t, open: false } : t) };
    case 'REMOVE_TOAST':
      return { ...state, toasts: action.toastId ? state.toasts.filter((t) => t.id !== action.toastId) : [] };
  }
};

const listeners: Array<React.Dispatch<Action>> = [];
let memoryState: State = { toasts: [] };

const dispatch = (action: Action) => {
  memoryState = reducer(memoryState, action);
  listeners.forEach((l) => l(action));
};

type Toast = Omit<ToasterToast, 'id'>;

const toast = (props: Toast) => {
  const id = genId();
  const update = (p: Partial<ToasterToast>) => dispatch({ type: 'UPDATE_TOAST', toast: { ...p, id } });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
    toast: { ...props, id, open: true, onOpenChange: (open) => { if (!open) dismiss(); } },
  });

  return { id, dismiss, update };
};

toast.success = (title: string, description?: string) =>
  toast({ title, description, variant: 'success' } as Toast);

toast.error = (title: string, description?: string) =>
  toast({ title, description, variant: 'destructive' } as Toast);

const useToast = () => {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    const listener: React.Dispatch<Action> = (action) => {
      const newState = reducer(state, action);
      setState(newState);
      newState.toasts.forEach((t) => {
        if (t.open === false) addToRemoveQueue(t.id, dispatch);
      });
    };
    listeners.push(listener);
    return () => { const i = listeners.indexOf(listener); if (i > -1) listeners.splice(i, 1); };
  }, [state]);

  return { ...state, toast, dismiss: (id?: string) => dispatch({ type: 'DISMISS_TOAST', toastId: id }) };
};

export { useToast, toast };
