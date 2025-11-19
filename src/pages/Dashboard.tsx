import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTasks } from '../service/taskService';
import { projectService } from '../service/projectService';
import { handleApiError } from '../lib/apiError';
import type { Task, Project } from '../types';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estadísticas calculadas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const pendingTasks = tasks.filter(t => t.status === 'TODO').length;
  const overdueTasks = tasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    return dueDate < new Date() && t.status !== 'COMPLETED';
  }).length;

  const urgentTasks = tasks.filter(t => t.priority === 'URGENT' && t.status !== 'COMPLETED');
  const recentTasks = tasks.slice(0, 5);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, projectsResponse] = await Promise.all([
        getTasks({ limit: 100 }),
        projectService.getProjects({ limit: 100 })
      ]);
      setTasks(tasksResponse.tasks);
      setProjects(projectsResponse.projects);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido, {user?.name || 'Usuario'}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tareas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalTasks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{inProgressTasks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{pendingTasks}</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de vencidas */}
      {overdueTasks > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800 font-medium">
              Tienes {overdueTasks} tarea{overdueTasks > 1 ? 's' : ''} vencida{overdueTasks > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Acciones rápidas */}
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/tasks">Ver Tareas</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/projects">Ver Proyectos</Link>
        </Button>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tareas urgentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tareas Urgentes</CardTitle>
          </CardHeader>
          <CardContent>
            {urgentTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hay tareas urgentes</p>
            ) : (
              <div className="space-y-3">
                {urgentTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex justify-between items-start border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Vence: {new Date(task.dueDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actividad reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tareas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hay tareas</p>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex justify-between items-start border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.description?.substring(0, 50)}{task.description?.length > 50 ? '...' : ''}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proyectos activos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Proyectos ({projects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hay proyectos</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {projects.slice(0, 6).map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <p className="font-medium text-sm">{project.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
