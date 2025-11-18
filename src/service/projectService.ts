import api from "./api";
import { Project, ProjectFormData } from "../types";

export const projectService = {
  getProjects: async (
    page: number = 1,
    limit: number = 10,
    search: string = ""
  ) => {
    const response = await api.get(
      `/projects?page=${page}&limit=${limit}&search=${search}`
    );
    return response.data;
  },

  getProject: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: ProjectFormData) => {
    const response = await api.post("/projects", data);
    return response.data;
  },

  updateProject: async (id: string, data: Partial<ProjectFormData>) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};
