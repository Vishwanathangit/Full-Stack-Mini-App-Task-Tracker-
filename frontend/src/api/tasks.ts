import api from './index';
import type { Task, PagedResponse, TaskFilters, CreateTaskRequest, UpdateTaskRequest } from '../types';

export const getTasks = async (filters: TaskFilters): Promise<PagedResponse<Task>> => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortDir) params.append('sortDir', filters.sortDir);
  if (filters.page !== undefined) params.append('page', filters.page.toString());
  if (filters.size !== undefined) params.append('size', filters.size.toString());

  const response = await api.get<PagedResponse<Task>>('/api/tasks', { params });
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
