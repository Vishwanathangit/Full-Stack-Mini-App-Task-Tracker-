import { useEffect, useState } from 'react';
import { getTasks } from '../api/tasks';
import { getProjects } from '../api/projects';
import { TaskStatus } from '../types';
import type { Task, Project } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { TaskCard } from '../components/tasks/TaskCard';
import { ProjectCard } from '../components/projects/ProjectCard';
import { CheckSquare, ListTodo, Play, CheckCircle, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [tasksData, projectsData] = await Promise.all([
          getTasks({ size: 100 }), // Get up to 100 tasks to compute stats
          getProjects(),
        ]);
        setTasks(tasksData.content);
        setProjects(projectsData);
      } catch (err: any) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
  const recentProjects = projects.slice(0, 5);

  // Group tasks by project to calculate task counts
  const taskCounts: Record<string, number> = {};
  tasks.forEach((task) => {
    if (task.projectId) {
      taskCounts[task.projectId] = (taskCounts[task.projectId] || 0) + 1;
    }
  });

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: CheckSquare, color: 'text-primary bg-primary/10 border-primary/20' },
    { label: 'To Do', value: todoTasks, icon: ListTodo, color: 'text-warning bg-warning/10 border-warning/20' },
    { label: 'In Progress', value: doingTasks, icon: Play, color: 'text-info bg-info/10 border-info/20' },
    { label: 'Completed', value: doneTasks, icon: CheckCircle, color: 'text-success bg-success/10 border-success/20' },
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
            <Card key={stat.label} className="hover:scale-[1.02] transition-transform duration-200">
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
                  onEdit={() => {}}
                  onDelete={() => {}}
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
                  onEdit={() => {}}
                  onDelete={() => {}}
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
    </div>
  );
}
