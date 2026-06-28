import api from './index';
import type { Project, CreateProjectRequest } from '../types';

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/api/projects');
  return response.data;
};

export const getProject = async (id: string): Promise<Project> => {
  const response = await api.get<Project>(`/api/projects/${id}`);
  return response.data;
};

export const createProject = async (data: CreateProjectRequest): Promise<Project> => {
  const response = await api.post<Project>('/api/projects', data);
  return response.data;
};

export const updateProject = async (id: string, data: CreateProjectRequest): Promise<Project> => {
  const response = await api.put<Project>(`/api/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/api/projects/${id}`);
};
