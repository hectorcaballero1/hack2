import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../service/projectService';
import { handleApiError } from '../lib/apiError';
import type { Project, ProjectStatus, CreateProjectRequest } from '../types';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal de crear/editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<ProjectStatus>('ACTIVE');

  useEffect(() => {
    fetchProjects();
  }, [currentPage, search]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects({
        page: currentPage,
        limit: 10,
        search: search
      });
      setProjects(response.projects);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProjects();
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormName('');
    setFormDescription('');
    setFormStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormName(project.name);
    setFormDescription(project.description);
    setFormStatus(project.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data: CreateProjectRequest = {
        name: formName,
        description: formDescription,
        status: formStatus
      };

      if (editingProject) {
        await projectService.updateProject(editingProject.id, data);
      } else {
        await projectService.createProject(data);
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;
    try {
      await projectService.deleteProject(id);
      fetchProjects();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Filtrar por estado localmente
  const filteredProjects = statusFilter === 'all'
    ? projects
    : projects.filter(p => p.status === statusFilter);

  if (loading && projects.length === 0) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <Button onClick={openCreateModal}>Nuevo Proyecto</Button>
      </div>

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {/* Filtros */}
      <div className="flex gap-4 flex-wrap">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button type="submit" variant="outline">Buscar</Button>
        </form>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="ACTIVE">Activo</SelectItem>
            <SelectItem value="COMPLETED">Completado</SelectItem>
            <SelectItem value="ON_HOLD">En Pausa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de proyectos */}
      {filteredProjects.length === 0 ? (
        <p className="text-muted-foreground">No hay proyectos</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-start">
                  <Link to={`/projects/${project.id}`} className="hover:underline">
                    {project.name}
                  </Link>
                  <span className={`text-xs px-2 py-1 rounded ${
                    project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {project.description?.substring(0, 100)}
                  {project.description?.length > 100 ? '...' : ''}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/projects/${project.id}`}>Ver</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEditModal(project)}>
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Modal de crear/editar */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                placeholder="Nombre del proyecto"
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <textarea
                className="w-full min-h-[100px] p-2 border rounded-md"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                required
                placeholder="Descripción del proyecto"
              />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={formStatus} onValueChange={(v) => setFormStatus(v as ProjectStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="COMPLETED">Completado</SelectItem>
                  <SelectItem value="ON_HOLD">En Pausa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Guardando...' : editingProject ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
