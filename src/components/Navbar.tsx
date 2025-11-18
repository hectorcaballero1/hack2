import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-lg font-bold">
          TechFlow
        </Link>

        <div className="space-x-2">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/projects">Proyectos</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/tasks">Tareas</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/team">Equipo</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/profile">{user?.name || 'Perfil'}</Link>
              </Button>
              <Button variant="secondary" onClick={logout}>
                Salir
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
