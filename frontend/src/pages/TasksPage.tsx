import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import type { Task, CreateTaskRequest } from '../types';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { Dialog, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Button } from '../components/ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tasks, filters, isLoading, error, setFilters, resetFilters } = useTaskStore();
  const { fetchTasks, createTask, updateTask, deleteTask, isActionLoading } = useTasks();
  const { projects, fetchProjects } = useProjects();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // 1. Sync URL parameters to Zustand store on initial load
  useEffect(() => {
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDir = (searchParams.get('sortDir') as 'asc' | 'desc') || 'desc';
    const page = parseInt(searchParams.get('page') || '0', 10);
    const size = parseInt(searchParams.get('size') || '10', 10);

    setFilters({
      status: status as any,
      priority: priority as any,
      sortBy,
      sortDir,
      page,
      size,
    });
  }, [setFilters]);

  // 2. Fetch tasks and sync Zustand store back to URL parameters whenever filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.sortBy && filters.sortBy !== 'createdAt') params.sortBy = filters.sortBy;
    if (filters.sortDir && filters.sortDir !== 'desc') params.sortDir = filters.sortDir;
    if (filters.page) params.page = filters.page.toString();
    if (filters.size && filters.size !== 10) params.size = filters.size.toString();

    setSearchParams(params, { replace: true });
    fetchTasks(filters);
  }, [filters, fetchTasks, setSearchParams]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateOrUpdate = async (data: CreateTaskRequest) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
      } else {
        await createTask(data);
      }
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deletingTaskId) return;
    try {
      await deleteTask(deletingTaskId);
      setIsDeleteOpen(false);
      setDeletingTaskId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingTaskId(id);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Tasks</h1>
          <p className="text-sm text-text-muted mt-1">Manage and track your daily tasks</p>
        </div>
        <Button onClick={() => { setEditingTask(null); setIsFormOpen(true); }} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <TaskFilters
        filters={filters}
        onChange={(newFilters) => setFilters(newFilters)}
        onReset={resetFilters}
      />

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <>
          <TaskList
            tasks={tasks?.content || []}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onCreateClick={() => { setEditingTask(null); setIsFormOpen(true); }}
          />

          {/* Pagination */}
          {tasks && tasks.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-6">
              <div className="text-sm text-text-muted">
                Page {tasks.page + 1} of {tasks.totalPages} ({tasks.totalElements} total tasks)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ page: filters.page! - 1 })}
                  disabled={filters.page === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ page: filters.page! + 1 })}
                  disabled={filters.page! + 1 >= tasks.totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Task Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        {projects.length === 0 && !isActionLoading ? (
          <div className="py-4 text-center">
            <p className="text-sm text-text-secondary mb-4">You need to create a project before adding tasks.</p>
            <Button onClick={() => setIsFormOpen(false)}>Okay</Button>
          </div>
        ) : (
          <TaskForm
            task={editingTask}
            projects={projects}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => { setIsFormOpen(false); setEditingTask(null); }}
            isLoading={isActionLoading}
          />
        )}
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={isActionLoading}
      />
    </div>
  );
}
