import { useState, useEffect } from 'react';
import { authService } from '../service/authService';
import { useAuth } from '../context/AuthContext';
import { handleApiError } from '../lib/apiError';
import type { ProfileResponse } from '../types';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await authService.getProfile();
      setProfile(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Cargando perfil...</p>
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
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>{profile?.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{profile?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ID de usuario</p>
            <p className="font-mono text-sm">{profile?.id}</p>
          </div>
          {profile?.createdAt && (
            <div>
              <p className="text-sm text-muted-foreground">Miembro desde</p>
              <p className="font-medium">
                {new Date(profile.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
          <div className="pt-4">
            <Button variant="destructive" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
