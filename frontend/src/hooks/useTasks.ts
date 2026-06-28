import { useState, useCallback } from 'react';
import { useTaskStore } from '../store/taskStore';
import { getTasks, createTask as createTaskApi, updateTask as updateTaskApi, deleteTask as deleteTaskApi } from '../api/tasks';
import type { CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '../types';

export function useTasks() {
  const { filters, setTasks, setLoading, setError } = useTaskStore();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchTasks = useCallback(async (customFilters?: TaskFilters) => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = customFilters || filters;
      const response = await getTasks(activeFilters);
      setTasks(response);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  }, [filters, setTasks, setLoading, setError]);

  const createTask = async (data: CreateTaskRequest) => {
    setIsActionLoading(true);
    try {
      await createTaskApi(data);
      await fetchTasks();
    } catch (err: any) {
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  const updateTask = async (id: string, data: UpdateTaskRequest) => {
    setIsActionLoading(true);
    try {
      await updateTaskApi(id, data);
      await fetchTasks();
    } catch (err: any) {
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setIsActionLoading(true);
    try {
      await deleteTaskApi(id);
      await fetchTasks();
    } catch (err: any) {
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    isActionLoading,
  };
}
