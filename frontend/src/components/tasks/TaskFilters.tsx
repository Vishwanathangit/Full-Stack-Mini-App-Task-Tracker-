import { TaskStatus, TaskPriority } from '../../types';
import type { TaskFilters as ITaskFilters } from '../../types';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { ArrowUpDown, RotateCcw, X } from 'lucide-react';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../../lib/constants';

interface TaskFiltersProps {
  filters: ITaskFilters;
  onChange: (filters: Partial<ITaskFilters>) => void;
  onReset: () => void;
}

export function TaskFilters({ filters, onChange, onReset }: TaskFiltersProps) {
  const toggleSortDir = () => {
    const nextDir = filters.sortDir === 'asc' ? 'desc' : 'asc';
    onChange({ sortDir: nextDir });
  };

  const hasActiveFilters = !!filters.status || !!filters.priority;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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

        <div className="w-full sm:w-auto">
          <label className="block text-xs font-medium text-transparent mb-1 select-none">Sort</label>
          <Button
            type="button"
            variant="outline"
            onClick={toggleSortDir}
            className="h-10 w-full sm:w-auto gap-2 px-3 justify-center cursor-pointer"
            title="Toggle Sort Direction"
          >
            <ArrowUpDown className="h-4 w-4 text-text-muted" />
            <span className="text-xs font-medium uppercase">{filters.sortDir}</span>
          </Button>
        </div>

        <div className="w-full sm:w-auto">
          <label className="block text-xs font-medium text-transparent mb-1 select-none">Reset</label>
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="h-10 w-full sm:w-auto gap-2 px-3 justify-center text-text-secondary hover:text-text-primary hover:bg-surface-raised cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-xs font-medium">Reset</span>
          </Button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/20 mt-1">
          <span className="text-xs text-text-muted">Active Filters:</span>
          {filters.status && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              <span>Status: {TASK_STATUS_LABELS[filters.status]}</span>
              <button
                type="button"
                onClick={() => onChange({ status: '', page: 0 })}
                className="text-primary hover:text-primary-hover focus:outline-none cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          {filters.priority && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium border border-warning/20">
              <span>Priority: {TASK_PRIORITY_LABELS[filters.priority]}</span>
              <button
                type="button"
                onClick={() => onChange({ priority: '', page: 0 })}
                className="text-warning hover:text-warning-hover focus:outline-none cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-primary hover:underline ml-1 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
