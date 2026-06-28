import type { Project } from '../../types';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  taskCounts: Record<string, number>;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onCreateClick: () => void;
}

export function ProjectList({ projects, taskCounts, onEdit, onDelete, onCreateClick }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects found"
        description="Get started by creating your first project to organize your tasks."
        action={
          <Button onClick={onCreateClick} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          taskCount={taskCounts[project.id] || 0}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
