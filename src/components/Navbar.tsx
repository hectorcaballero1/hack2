import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-bold">
          Gighub
        </Link>
        <div className="space-x-4">
          <Button asChild variant="ghost">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
