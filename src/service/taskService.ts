import api from "./api";
import { Task, TaskFormData } from "../types";

interface GetTasksParams {
  projectId?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const taskService = {
  getTasks: async (params: GetTasksParams = {}) => {
    const response = await api.get("/tasks", { params });
    return response.data;
  },

  getTask: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: TaskFormData) => {
    const response = await api.post("/tasks", data);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<TaskFormData>) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  updateTaskStatus: async (id: string, status: string) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },
};
