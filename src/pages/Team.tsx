import { useState, useEffect } from 'react';
import { teamService } from '../service/teamService';
import { handleApiError } from '../lib/apiError';
import type { TeamMember, Task } from '../types';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [memberTasks, setMemberTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await teamService.getMembers();
      setMembers(response.members);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberTasks = async (memberId: string) => {
    try {
      setLoadingTasks(true);
      setSelectedMember(memberId);
      const response = await teamService.getMemberTasks(memberId);
      setMemberTasks(response.tasks);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoadingTasks(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Cargando equipo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Equipo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card key={member.id} className={selectedMember === member.id ? 'ring-2 ring-primary' : ''}>
            <CardHeader>
              <CardTitle className="text-lg">{member.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{member.email}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchMemberTasks(member.id)}
                disabled={loadingTasks && selectedMember === member.id}
              >
                {loadingTasks && selectedMember === member.id ? 'Cargando...' : 'Ver tareas'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMember && memberTasks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Tareas de {members.find(m => m.id === selectedMember)?.name}
          </h2>
          <div className="space-y-2">
            {memberTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedMember && memberTasks.length === 0 && !loadingTasks && (
        <div className="mt-8">
          <p className="text-muted-foreground">Este miembro no tiene tareas asignadas.</p>
        </div>
      )}
    </div>
  );
};

export default Team;
