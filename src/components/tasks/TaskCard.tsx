import type { Task, TaskPriority, TaskStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2, Edit, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onClick?: (task: Task) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  LOW: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  HIGH: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  URGENT: 'bg-red-100 text-red-800 hover:bg-red-200',
};

const statusColors: Record<TaskStatus, string> = {
  TODO: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  COMPLETED: 'bg-green-100 text-green-800 hover:bg-green-200',
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'Por Hacer',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completada',
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange, onClick }: TaskCardProps) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const statusOrder: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onStatusChange?.(task.id, nextStatus);
  };

  return (
    <Card
      className={`hover:shadow-md transition-shadow cursor-pointer ${
        isOverdue ? 'border-red-300' : ''
      }`}
      onClick={() => onClick?.(task)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{task.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            className={`${statusColors[task.status]} cursor-pointer`}
            onClick={handleStatusClick}
          >
            {statusLabels[task.status]}
          </Badge>
          <Badge className={priorityColors[task.priority]}>{priorityLabels[task.priority]}</Badge>
          {isOverdue && (
            <Badge variant="destructive" className="animate-pulse">
              Vencida
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {task.assignee && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{task.assignee.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className={isOverdue ? 'text-red-500 font-semibold' : ''}>
              {format(new Date(task.dueDate), "d 'de' MMMM, yyyy", { locale: es })}
            </span>
          </div>
          {task.project && (
            <div className="text-xs bg-gray-100 rounded px-2 py-1 inline-block w-fit">
              {task.project.name}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
