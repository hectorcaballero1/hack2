import { api } from './api';
import type {
  Task,
  TasksResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  TaskFilters,
} from '../types';

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

  const response = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
  return response.data;
};

/**
 * Obtener detalles de una tarea específica
 * @param id - ID de la tarea
 */
export const getTaskById = async (id: string): Promise<Task> => {
  const response = await api.get<Task>(`/tasks/${id}`);
  return response.data;
};

/**
 * Crear una nueva tarea
 * @param data - Datos de la tarea a crear
 */
export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await api.post<Task>('/tasks', data);
  return response.data;
};

/**
 * Actualizar una tarea existente
 * @param id - ID de la tarea
 * @param data - Datos a actualizar
 */
export const updateTask = async (id: string, data: UpdateTaskRequest): Promise<Task> => {
  const response = await api.put<Task>(`/tasks/${id}`, data);
  return response.data;
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
  const response = await api.patch<Task>(`/tasks/${id}/status`, status);
  return response.data;
};

/**
 * Eliminar una tarea
 * @param id - ID de la tarea
 */
export const deleteTask = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/tasks/${id}`);
  return response.data;
};
