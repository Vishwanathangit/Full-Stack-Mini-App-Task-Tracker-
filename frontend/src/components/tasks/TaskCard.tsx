import { Calendar, Edit, Folder, Trash } from 'lucide-react';
import { TaskStatus, TaskPriority } from '../../types';
import type { Task } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../../lib/constants';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getStatusVariant = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'warning';
      case TaskStatus.DOING:
        return 'info';
      case TaskStatus.DONE:
        return 'success';
      default:
        return 'outline';
    }
  };

  const getPriorityVariant = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'outline'; // will apply custom text-text-secondary
      case TaskPriority.MEDIUM:
        return 'warning'; // will apply custom text-warning
      case TaskPriority.HIGH:
        return 'destructive'; // will apply custom text-danger
      default:
        return 'outline';
    }
  };

  const getPriorityClass = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'text-text-secondary border-border/50 bg-transparent';
      case TaskPriority.MEDIUM:
        return 'text-warning border-warning/20 bg-warning/5';
      case TaskPriority.HIGH:
        return 'text-danger border-danger/20 bg-danger/5';
      default:
        return '';
    }
  };

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'No due date';

  return (
    <Card className="flex flex-col h-full justify-between">
      <CardHeader className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={getStatusVariant(task.status)}>
            {TASK_STATUS_LABELS[task.status]}
          </Badge>
          <Badge className={getPriorityClass(task.priority)} variant={getPriorityVariant(task.priority)}>
            {TASK_PRIORITY_LABELS[task.priority]}
          </Badge>
        </div>
        
        <CardTitle className="text-base font-semibold line-clamp-1 text-text-primary">
          {task.title}
        </CardTitle>
        
        <CardDescription className="text-sm text-text-secondary line-clamp-2 min-h-10">
          {task.description || 'No description provided.'}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex flex-col gap-3 p-5 border-t border-border/40 bg-surface-raised/35 mt-0 rounded-b-lg">
        <div className="flex w-full items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-1.5 min-w-0">
            <Folder className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate font-medium">{task.projectName}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Calendar className="h-3.5 w-3.5 text-text-muted" />
            <span>{formattedDueDate}</span>
          </div>
        </div>
        
        <div className="flex w-full items-center justify-end gap-1 border-t border-border/20 pt-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(task)}
            className="text-text-secondary hover:text-primary hover:bg-primary/10"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(task.id)}
            className="text-text-secondary hover:text-danger hover:bg-danger/10"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
