import { create } from 'zustand';
import type { Task, PagedResponse, TaskFilters } from '../types';
import { DEFAULT_TASK_FILTERS } from '../lib/constants';

interface TaskState {
  tasks: PagedResponse<Task> | null;
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;
  setTasks: (tasks: PagedResponse<Task>) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetFilters: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: null,
  filters: DEFAULT_TASK_FILTERS,
  isLoading: false,
  error: null,
  setTasks: (tasks) => set({ tasks }),
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  resetFilters: () => set({ filters: DEFAULT_TASK_FILTERS }),
}));
