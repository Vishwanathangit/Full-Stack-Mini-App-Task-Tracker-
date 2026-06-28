import { TaskStatus, TaskPriority } from '../../types';
import type { TaskFilters as ITaskFilters } from '../../types';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';

interface TaskFiltersProps {
  filters: ITaskFilters;
  onChange: (filters: Partial<ITaskFilters>) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const toggleSortDir = () => {
    const nextDir = filters.sortDir === 'asc' ? 'desc' : 'asc';
    onChange({ sortDir: nextDir });
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center">
      <div className="w-full sm:w-48">
        <label className="block text-xs font-medium text-text-muted mb-1">Status</label>
        <Select
          value={filters.status || ''}
          onChange={(e) => onChange({ status: e.target.value as any, page: 0 })}
        >
          <option value="">All Statuses</option>
          <option value={TaskStatus.TODO}>To Do</option>
          <option value={TaskStatus.DOING}>In Progress</option>
          <option value={TaskStatus.DONE}>Completed</option>
        </Select>
      </div>

      <div className="w-full sm:w-48">
        <label className="block text-xs font-medium text-text-muted mb-1">Priority</label>
        <Select
          value={filters.priority || ''}
          onChange={(e) => onChange({ priority: e.target.value as any, page: 0 })}
        >
          <option value="">All Priorities</option>
          <option value={TaskPriority.LOW}>Low</option>
          <option value={TaskPriority.MEDIUM}>Medium</option>
          <option value={TaskPriority.HIGH}>High</option>
        </Select>
      </div>

      <div className="w-full sm:w-48">
        <label className="block text-xs font-medium text-text-muted mb-1">Sort By</label>
        <Select
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => onChange({ sortBy: e.target.value, page: 0 })}
        >
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </Select>
      </div>

      <div className="flex items-end h-10 pt-5 sm:pt-0">
        <Button
          type="button"
          variant="outline"
          onClick={toggleSortDir}
          className="h-10 w-full sm:w-auto gap-2 px-3 justify-center"
          title="Toggle Sort Direction"
        >
          <ArrowUpDown className="h-4 w-4 text-text-muted" />
          <span className="text-xs font-medium uppercase">{filters.sortDir}</span>
        </Button>
      </div>
    </div>
  );
}
