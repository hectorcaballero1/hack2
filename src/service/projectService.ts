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

    const response = await api.get(`/projects?${params.toString()}`);

    // Transformar proyectos y manejar snake_case
    const projects = response.data.projects.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      description: p.description,
      status: p.status,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    return {
      projects,
      totalPages: response.data.totalPages || response.data.total_pages || 1,
      currentPage: response.data.currentPage || response.data.current_page || 1,
    };
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
