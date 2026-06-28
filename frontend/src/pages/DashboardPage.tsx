import { useEffect, useState } from 'react';
import { getTasks, updateTask as updateTaskApi, deleteTask as deleteTaskApi } from '../api/tasks';
import { getProjects, updateProject as updateProjectApi, deleteProject as deleteProjectApi } from '../api/projects';
import { TaskStatus } from '../types';
import type { Task, Project, CreateTaskRequest, CreateProjectRequest } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { TaskCard } from '../components/tasks/TaskCard';
import { ProjectCard } from '../components/projects/ProjectCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Dialog, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { CheckSquare, ListTodo, Play, CheckCircle, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Task Edit/Delete State
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTaskDeleteOpen, setIsTaskDeleteOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Project Edit/Delete State
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectDeleteOpen, setIsProjectDeleteOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      const [tasksData, projectsData] = await Promise.all([
        getTasks({ size: 100 }),
        getProjects(),
      ]);
      setTasks(tasksData.content);
      setProjects(projectsData);
    } catch (err) {
      console.error('Failed to refresh dashboard data', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await refreshData();
      } catch (err: any) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Task Handlers
  const handleTaskUpdate = async (data: CreateTaskRequest) => {
    if (!editingTask) return;
    setIsActionLoading(true);
    try {
      await updateTaskApi(editingTask.id, data);
      setIsTaskFormOpen(false);
      setEditingTask(null);
      await refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleTaskDelete = async () => {
    if (!deletingTaskId) return;
    setIsActionLoading(true);
    try {
      await deleteTaskApi(deletingTaskId);
      setIsTaskDeleteOpen(false);
      setDeletingTaskId(null);
      await refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Project Handlers
  const handleProjectUpdate = async (data: CreateProjectRequest) => {
    if (!editingProject) return;
    setIsActionLoading(true);
    try {
      await updateProjectApi(editingProject.id, data);
      setIsProjectFormOpen(false);
      setEditingProject(null);
      await refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleProjectDelete = async () => {
    if (!deletingProjectId) return;
    setIsActionLoading(true);
    try {
      await deleteProjectApi(deletingProjectId);
      setIsProjectDeleteOpen(false);
      setDeletingProjectId(null);
      await refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Compute statistics
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((t) => t.status === TaskStatus.TODO).length;
  const doingTasks = tasks.filter((t) => t.status === TaskStatus.DOING).length;
  const doneTasks = tasks.filter((t) => t.status === TaskStatus.DONE).length;

  const recentTasks = tasks.slice(0, 5);
  const recentProjects = projects.slice(0, 3); // Showing last 3 projects as requested

  // Group tasks by project to calculate task counts
  const taskCounts: Record<string, number> = {};
  tasks.forEach((task) => {
    if (task.projectId) {
      taskCounts[task.projectId] = (taskCounts[task.projectId] || 0) + 1;
    }
  });

  const stats = [
    { 
      label: 'Total Tasks', 
      value: totalTasks, 
      icon: CheckSquare, 
      color: 'text-primary bg-primary/10 border-primary/20',
      borderStyle: 'border-l-[3px] border-l-primary'
    },
    { 
      label: 'To Do', 
      value: todoTasks, 
      icon: ListTodo, 
      color: 'text-warning bg-warning/10 border-warning/20',
      borderStyle: 'border-l-[3px] border-l-warning'
    },
    { 
      label: 'In Progress', 
      value: doingTasks, 
      icon: Play, 
      color: 'text-primary bg-primary/10 border-primary/20',
      borderStyle: 'border-l-[3px] border-l-primary'
    },
    { 
      label: 'Completed', 
      value: doneTasks, 
      icon: CheckCircle, 
      color: 'text-success bg-success/10 border-success/20',
      borderStyle: 'border-l-[3px] border-l-success'
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">Overview of your productivity metrics, tasks, and projects</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`hover:scale-[1.02] transition-transform duration-200 ${stat.borderStyle}`}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-muted">{stat.label}</p>
                  <p className="text-2xl font-bold text-text-primary mt-0.5">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">Recent Tasks</h2>
            <Link to="/tasks" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentTasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(t) => {
                    setEditingTask(t);
                    setIsTaskFormOpen(true);
                  }}
                  onDelete={(id) => {
                    setDeletingTaskId(id);
                    setIsTaskDeleteOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-8 text-center bg-surface/30 border-dashed">
              <CheckSquare className="h-8 w-8 text-text-muted mb-2" />
              <p className="text-sm font-medium text-text-secondary">No tasks available</p>
              <Link to="/tasks" className="text-xs text-primary mt-2 hover:underline">
                Create a task
              </Link>
            </Card>
          )}
        </div>

        {/* Recent Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">Recent Projects</h2>
            <Link to="/projects" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {recentProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  taskCount={taskCounts[project.id] || 0}
                  onEdit={(p) => {
                    setEditingProject(p);
                    setIsProjectFormOpen(true);
                  }}
                  onDelete={(id) => {
                    setDeletingProjectId(id);
                    setIsProjectDeleteOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-8 text-center bg-surface/30 border-dashed">
              <FolderOpen className="h-8 w-8 text-text-muted mb-2" />
              <p className="text-sm font-medium text-text-secondary">No projects available</p>
              <Link to="/projects" className="text-xs text-primary mt-2 hover:underline">
                Create a project
              </Link>
            </Card>
          )}
        </div>
      </div>

      {/* Task Edit Form Dialog */}
      <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <TaskForm
          task={editingTask}
          projects={projects}
          onSubmit={handleTaskUpdate}
          onCancel={() => {
            setIsTaskFormOpen(false);
            setEditingTask(null);
          }}
          isLoading={isActionLoading}
        />
      </Dialog>

      {/* Confirm Delete Task Dialog */}
      <ConfirmDialog
        open={isTaskDeleteOpen}
        onOpenChange={setIsTaskDeleteOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleTaskDelete}
        isLoading={isActionLoading}
      />

      {/* Project Edit Form Dialog */}
      <Dialog open={isProjectFormOpen} onOpenChange={setIsProjectFormOpen}>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <ProjectForm
          project={editingProject}
          onSubmit={handleProjectUpdate}
          onCancel={() => {
            setIsProjectFormOpen(false);
            setEditingProject(null);
          }}
          isLoading={isActionLoading}
        />
      </Dialog>

      {/* Confirm Delete Project Dialog */}
      <ConfirmDialog
        open={isProjectDeleteOpen}
        onOpenChange={setIsProjectDeleteOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? All associated tasks will also be deleted."
        onConfirm={handleProjectDelete}
        isLoading={isActionLoading}
      />
    </div>
  );
}
