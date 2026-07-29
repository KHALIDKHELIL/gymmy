import { create } from 'zustand';

export const useStore = create((set) => ({
  session: [],
  addToSession: (exercise) => set((state) => ({ 
    // Prevent adding duplicates
    session: state.session.find(ex => ex.id === exercise.id) 
      ? state.session 
      : [...state.session, exercise] 
  })),
  removeFromSession: (id) => set((state) => ({
    session: state.session.filter(ex => ex.id !== id)
  }))
}));