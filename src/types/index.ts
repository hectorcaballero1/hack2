/* Types para Auth */

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

/* Types para Proyectos */

export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt?: string;
  updatedAt?: string;
  tasks?: Task[];
}

export interface ProjectsResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  status: ProjectStatus;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

/* Types para Tareas */

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
  project?: Project;
  assignee?: User;
}

export interface TasksResponse {
  tasks: Task[];
  totalPages: number;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  projectId: string;
  priority: TaskPriority;
  dueDate: string;
  assignedTo?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

/* Types para Equipo */

export interface TeamMember {
  id: string;
  name: string;
  email: string;
}

export interface TeamMembersResponse {
  members: TeamMember[];
}

export interface MemberTasksResponse {
  tasks: Task[];
}

/* Types para Dashboard/Stats */

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

/* Types para paginación y filtros */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProjectFilters extends PaginationParams {
  search?: string;
}

export interface TaskFilters extends PaginationParams {
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
}
