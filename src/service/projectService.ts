import { api } from './api';
import type {
  Project,
  ProjectsResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectFilters
} from '../types';

export const projectService = {
  async getProjects(filters?: ProjectFilters): Promise<ProjectsResponse> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<ProjectsResponse>(`/projects?${params.toString()}`);
    return response.data;
  },

  async getProject(id: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  async updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
