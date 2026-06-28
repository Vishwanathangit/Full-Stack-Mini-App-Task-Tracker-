import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TaskStatus, TaskPriority } from '../../types';
import type { Task, Project, CreateTaskRequest } from '../../types';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { useEffect } from 'react';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.string().optional(),
  projectId: z.string().min(1, 'Project is required'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task | null;
  projects: Project[];
  onSubmit: (data: CreateTaskRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({ task, projects, onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: '',
      projectId: '',
    },
  });

  const statusValue = watch('status');
  const priorityValue = watch('priority');
  const projectIdValue = watch('projectId');

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
        projectId: task.projectId,
      });
    } else {
      reset({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: '',
        projectId: projects[0]?.id || '',
      });
    }
  }, [task, reset, projects]);

  const handleFormSubmit = async (data: TaskFormData) => {
    const submitData: CreateTaskRequest = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    };
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1.5">
          Task Title *
        </label>
        <Input
          id="title"
          placeholder="e.g. Implement Login Page"
          {...register('title')}
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-xs text-danger mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Detail the steps or goals..."
          className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary shadow-sm transition-all placeholder:text-text-muted focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus disabled:cursor-not-allowed disabled:opacity-50"
          {...register('description')}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-xs text-danger mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-secondary mb-1.5">
            Status *
          </label>
          <Select id="status" {...register('status')} value={statusValue} disabled={isLoading}>
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.DOING}>In Progress</option>
            <option value={TaskStatus.DONE}>Completed</option>
          </Select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-text-secondary mb-1.5">
            Priority *
          </label>
          <Select id="priority" {...register('priority')} value={priorityValue} disabled={isLoading}>
            <option value={TaskPriority.LOW}>Low</option>
            <option value={TaskPriority.MEDIUM}>Medium</option>
            <option value={TaskPriority.HIGH}>High</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-text-secondary mb-1.5">
            Due Date
          </label>
          <Input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-text-secondary mb-1.5">
            Project *
          </label>
          <Select id="projectId" {...register('projectId')} value={projectIdValue} disabled={isLoading}>
            <option value="" disabled>Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
          {errors.projectId && (
            <p className="text-xs text-danger mt-1">{errors.projectId.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/45 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
