import { Calendar, Edit, Trash } from 'lucide-react';
import type { Project } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';

interface ProjectCardProps {
  project: Project;
  taskCount?: number;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, taskCount = 0, onEdit, onDelete }: ProjectCardProps) {
  const formattedDate = new Date(project.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="flex flex-col h-full justify-between">
      <CardHeader className="p-5">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-base font-semibold line-clamp-1 text-text-primary">
            {project.name}
          </CardTitle>
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary border border-primary/20">
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </span>
        </div>
        <CardDescription className="text-sm text-text-secondary mt-2 line-clamp-3 min-h-12">
          {project.description || 'No description provided.'}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex items-center justify-between p-5 border-t border-border/40 bg-surface-raised/35 mt-0 rounded-b-lg">
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <Calendar className="h-3.5 w-3.5" />
          <span>Created {formattedDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(project)}
            className="text-text-secondary hover:text-primary hover:bg-primary/10"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(project.id)}
            className="text-text-secondary hover:text-danger hover:bg-danger/10"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
