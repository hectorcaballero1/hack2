import { api } from './api';
import type {
  Task,
  TasksResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  TaskFilters,
} from '../types';

// Transformar tarea de snake_case a camelCase
const transformTask = (task: any): Task => ({
  id: String(task.id),
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  dueDate: task.due_date,
  projectId: String(task.project_id),
  assignedTo: task.assigned_to ? String(task.assigned_to) : undefined,
  createdAt: task.created_at,
  updatedAt: task.updated_at,
});

/**
 * Listar todas las tareas con filtros opcionales
 * @param filters - Filtros: projectId, status, priority, assignedTo, page, limit
 */
export const getTasks = async (filters?: TaskFilters): Promise<TasksResponse> => {
  const params = new URLSearchParams();

  if (filters?.projectId) params.append('projectId', filters.projectId);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);
  if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await api.get(`/tasks?${params.toString()}`);
  return {
    tasks: response.data.tasks.map(transformTask),
    totalPages: response.data.totalPages || 1,
  };
};

/**
 * Obtener detalles de una tarea específica
 * @param id - ID de la tarea
 */
export const getTaskById = async (id: string): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return transformTask(response.data);
};

/**
 * Crear una nueva tarea
 * @param data - Datos de la tarea a crear
 */
export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  // Transformar a snake_case para la API
  const apiData = {
    title: data.title,
    description: data.description,
    project_id: parseInt(data.projectId),
    priority: data.priority,
    due_date: data.dueDate,
    assigned_to: data.assignedTo ? parseInt(data.assignedTo) : undefined
  };
  const response = await api.post('/tasks', apiData);
  return transformTask(response.data);
};

/**
 * Actualizar una tarea existente
 * @param id - ID de la tarea
 * @param data - Datos a actualizar
 */
export const updateTask = async (id: string, data: UpdateTaskRequest): Promise<Task> => {
  // Transformar a snake_case para la API
  const apiData: any = {};
  if (data.title) apiData.title = data.title;
  if (data.description) apiData.description = data.description;
  if (data.status) apiData.status = data.status;
  if (data.priority) apiData.priority = data.priority;
  if (data.dueDate) apiData.due_date = data.dueDate;
  if (data.assignedTo) apiData.assigned_to = parseInt(data.assignedTo);

  const response = await api.put(`/tasks/${id}`, apiData);
  return transformTask(response.data);
};

/**
 * Actualizar solo el estado de una tarea
 * @param id - ID de la tarea
 * @param status - Nuevo estado
 */
export const updateTaskStatus = async (
  id: string,
  status: UpdateTaskStatusRequest
): Promise<Task> => {
  const response = await api.patch(`/tasks/${id}/status`, status);
  return transformTask(response.data);
};

/**
 * Eliminar una tarea
 * @param id - ID de la tarea
 */
export const deleteTask = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/tasks/${id}`);
  return response.data;
};
