import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { taskService } from "../services/taskService";
import { projectService } from "../services/projectService";
import { Task, Project } from "../types";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, projectsResponse] = await Promise.all([
          taskService.getTasks({ limit: 100 }),
          projectService.getProjects(1, 5),
        ]);
        setTasks(tasksResponse.tasks);
        setProjects(projectsResponse.projects);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task.status !== "COMPLETED"
  ).length;
  const overdueTasks = tasks.filter(
    (task) => task.status !== "COMPLETED" && new Date(task.dueDate) < new Date()
  ).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Cargando...</div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bienvenido de vuelta</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Tareas</h3>
          <p className="text-3xl font-bold text-blue-600">{totalTasks}</p>
        </Card>
        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Completadas</h3>
          <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
        </Card>
        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pendientes</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingTasks}</p>
        </Card>
        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Vencidas</h3>
          <p className="text-3xl font-bold text-red-600">{overdueTasks}</p>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Acciones Rápidas</h2>
          </div>
          <div className="space-y-4">
            <Link to="/tasks/new">
              <Button className="w-full">Crear Nueva Tarea</Button>
            </Link>
            <Link to="/projects">
              <Button variant="secondary" className="w-full">
                Ver Todos los Proyectos
              </Button>
            </Link>
          </div>
        </Card>

        {/* Proyectos recientes */}
        <Card className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Proyectos Recientes</h2>
            <Link to="/projects" className="text-blue-600 hover:text-blue-500">
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="flex justify-between items-center p-3 border rounded"
              >
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.status}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    project.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : project.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
