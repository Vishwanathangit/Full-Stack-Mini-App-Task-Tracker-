import { useEffect, useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { getTasks } from '../api/tasks';
import type { Project, CreateProjectRequest } from '../types';
import { ProjectList } from '../components/projects/ProjectList';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Dialog, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';

export default function ProjectsPage() {
  const { projects, isLoading, isActionLoading, error, fetchProjects, createProject, updateProject, deleteProject } = useProjects();
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const fetchTaskCounts = async () => {
    try {
      const tasksData = await getTasks({ size: 100 });
      const counts: Record<string, number> = {};
      tasksData.content.forEach((task) => {
        if (task.projectId) {
          counts[task.projectId] = (counts[task.projectId] || 0) + 1;
        }
      });
      setTaskCounts(counts);
    } catch (err) {
      console.error('Failed to compute task counts', err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTaskCounts();
  }, [fetchProjects]);

  const handleCreateOrUpdate = async (data: CreateProjectRequest) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
      } else {
        await createProject(data);
      }
      setIsFormOpen(false);
      setEditingProject(null);
      fetchTaskCounts(); // Refresh task counts
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deletingProjectId) return;
    try {
      await deleteProject(deletingProjectId);
      setIsDeleteOpen(false);
      setDeletingProjectId(null);
      fetchTaskCounts(); // Refresh task counts
    } catch (err) {
      console.error(err);
    }
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingProjectId(id);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Projects</h1>
          <p className="text-sm text-text-muted mt-1">Organize your tasks into dedicated projects</p>
        </div>
        <Button onClick={() => { setEditingProject(null); setIsFormOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <ProjectList
          projects={projects}
          taskCounts={taskCounts}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onCreateClick={() => { setEditingProject(null); setIsFormOpen(true); }}
        />
      )}

      {/* Project Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogHeader>
          <DialogTitle>{editingProject ? 'Edit Project' : 'Create Project'}</DialogTitle>
        </DialogHeader>
        <ProjectForm
          project={editingProject}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => { setIsFormOpen(false); setEditingProject(null); }}
          isLoading={isActionLoading}
        />
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? All tasks associated with this project will also be deleted."
        onConfirm={handleDelete}
        isLoading={isActionLoading}
      />
    </div>
  );
}
