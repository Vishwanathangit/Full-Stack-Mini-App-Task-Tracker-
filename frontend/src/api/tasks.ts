import api from './index';
import type { Task, PagedResponse, TaskFilters, CreateTaskRequest, UpdateTaskRequest } from '../types';

export const getTasks = async (filters: TaskFilters): Promise<PagedResponse<Task>> => {
  const response = await api.get<PagedResponse<Task>>('/api/tasks', {
    params: {
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      sortBy: filters.sortBy || undefined,
      sortDir: filters.sortDir || undefined,
      page: filters.page !== undefined ? filters.page : undefined,
      size: filters.size !== undefined ? filters.size : undefined,
    },
  });
  return response.data;
};

export const getTask = async (id: string): Promise<Task> => {
  const response = await api.get<Task>(`/api/tasks/${id}`);
  return response.data;
};

export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await api.post<Task>('/api/tasks', data);
  return response.data;
};

export const updateTask = async (id: string, data: UpdateTaskRequest): Promise<Task> => {
  const response = await api.put<Task>(`/api/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/api/tasks/${id}`);
};
