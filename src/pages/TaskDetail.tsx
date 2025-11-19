import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById, updateTask, updateTaskStatus, deleteTask } from '../service/taskService';
import { teamService } from '../service/teamService';
import { handleApiError } from '../lib/apiError';
import type { Task, TaskStatus, TeamMember } from '../types';

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

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [taskData, membersData] = await Promise.all([
        getTaskById(id!),
        teamService.getMembers()
      ]);
      setTask(taskData);
      setTeamMembers(membersData.members);

      // Initialize form
      setTitle(taskData.title);
      setDescription(taskData.description);
      setPriority(taskData.priority);
      setDueDate(taskData.dueDate.split('T')[0]);
      setAssignedTo(taskData.assignedTo || '');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;
    try {
      const updated = await updateTaskStatus(task.id, { status: newStatus });
      setTask(updated);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleSave = async () => {
    if (!task) return;
    try {
      setSaving(true);
      const updated = await updateTask(task.id, {
        title,
        description,
        priority: priority as any,
        dueDate,
        assignedTo: assignedTo || undefined
      });
      setTask(updated);
      setIsEditing(false);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !confirm('¿Estás seguro de eliminar esta tarea?')) return;
    try {
      await deleteTask(task.id);
      navigate('/tasks');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Cargando tarea...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error || 'Tarea no encontrada'}</p>
        <Button variant="outline" onClick={() => navigate('/tasks')} className="mt-4">
          Volver a Tareas
        </Button>
      </div>
    );
  }

  const assigneeName = teamMembers.find(m => m.id === task.assignedTo)?.name || 'Sin asignar';

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => navigate('/tasks')}>
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

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Tarea' : task.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <textarea
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Baja</SelectItem>
                      <SelectItem value="MEDIUM">Media</SelectItem>
                      <SelectItem value="HIGH">Alta</SelectItem>
                      <SelectItem value="URGENT">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fecha límite</Label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Asignar a</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar miembro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin asignar</SelectItem>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
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
                <p className="mt-1">{task.description || 'Sin descripción'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Select value={task.status} onValueChange={(v) => handleStatusChange(v as TaskStatus)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TODO">Por Hacer</SelectItem>
                      <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                      <SelectItem value="COMPLETED">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Prioridad</p>
                  <span className={`inline-block mt-1 text-xs px-2 py-1 rounded ${
                    task.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                    task.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fecha límite</p>
                  <p className="mt-1 font-medium">
                    {new Date(task.dueDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Asignado a</p>
                  <p className="mt-1 font-medium">{assigneeName}</p>
                </div>
              </div>

              {task.createdAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Creada</p>
                  <p className="mt-1 text-sm">
                    {new Date(task.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetail;
