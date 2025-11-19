import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { handleApiError } from "../lib/apiError";
import { toast } from "sonner";
import type { RegisterRequest } from "../types";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast.success("Cuenta creada exitosamente");
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl text-center">Crear una cuenta</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Juan Pérez" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="tu@email.com" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
