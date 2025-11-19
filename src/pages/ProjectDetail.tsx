import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService } from '../service/projectService';
import { handleApiError } from '../lib/apiError';
import type { Project, ProjectStatus } from '../types';

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

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<ProjectStatus>('ACTIVE');

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProject(id!);
      setProject(data);
      setFormName(data.name);
      setFormDescription(data.description);
      setFormStatus(data.status);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!project) return;
    try {
      setSaving(true);
      const updated = await projectService.updateProject(project.id, {
        name: formName,
        description: formDescription,
        status: formStatus
      });
      setProject(updated);
      setIsEditing(false);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!project || !confirm('¿Estás seguro de eliminar este proyecto? Se eliminarán también todas sus tareas.')) return;
    try {
      await projectService.deleteProject(project.id);
      navigate('/projects');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Cargando proyecto...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error || 'Proyecto no encontrado'}</p>
        <Button variant="outline" onClick={() => navigate('/projects')} className="mt-4">
          Volver a Proyectos
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/projects')}>
          ← Volver
        </Button>
        <div className="flex gap-2">
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          )}
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </div>

      {/* Detalles del proyecto */}
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Proyecto' : project.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <textarea
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
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
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-muted-foreground">Descripción</p>
                <p className="mt-1">{project.description || 'Sin descripción'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <span className={`inline-block mt-1 text-xs px-2 py-1 rounded ${
                  project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
              {project.createdAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Creado</p>
                  <p className="mt-1 text-sm">
                    {new Date(project.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Tareas del proyecto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Tareas del Proyecto ({project.tasks?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!project.tasks || project.tasks.length === 0 ? (
            <p className="text-muted-foreground">Este proyecto no tiene tareas</p>
          ) : (
            <div className="space-y-3">
              {project.tasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="block p-3 border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.description?.substring(0, 80)}
                        {task.description?.length > 80 ? '...' : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                        task.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetail;
