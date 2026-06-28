import { useState, useCallback } from 'react';
import { getProjects, createProject as createProjectApi, updateProject as updateProjectApi, deleteProject as deleteProjectApi } from '../api/projects';
import type { Project, CreateProjectRequest } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProjects();
      setProjects(response);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to fetch projects.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = async (data: CreateProjectRequest) => {
    setIsActionLoading(true);
    try {
      await createProjectApi(data);
      await fetchProjects();
    } catch (err: any) {
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  const updateProject = async (id: string, data: CreateProjectRequest) => {
    setIsActionLoading(true);
    try {
      await updateProjectApi(id, data);
      await fetchProjects();
    } catch (err: any) {
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    setIsActionLoading(true);
    try {
      await deleteProjectApi(id);
      await fetchProjects();
    } catch (err: any) {
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    projects,
    isLoading,
    isActionLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
