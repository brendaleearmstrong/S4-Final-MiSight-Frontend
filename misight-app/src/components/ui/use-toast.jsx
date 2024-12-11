import { create } from 'zustand';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST"
};

let count = 0;

function generateId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastTimeouts = new Map();

export const useToast = create((set, get) => ({
  toasts: [],
  
  addToast: (title, description, options) => {
    const { toasts } = get();

    const id = generateId();

    const newToast = {
      id,
      title,
      description,
      ...options,
      open: true,
      createdAt: Date.now(),
    };

    const timeoutId = setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(id, timeoutId);

    set({
      toasts: [newToast, ...toasts].slice(0, TOAST_LIMIT),
    });

    return id;
  },

  dismissToast: (toastId) => {
    const { toasts } = get();

    set({
      toasts: toasts.map((t) => 
        t.id === toastId ? { ...t, open: false } : t
      ),
    });
  },

  removeToast: (toastId) => {
    const { toasts } = get();
    set({ toasts: toasts.filter((t) => t.id !== toastId) });
  },
}));