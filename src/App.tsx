import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Páginas públicas
import Login from './pages/Login';
import Register from './pages/Register';

// Páginas protegidas
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import Team from './pages/Team';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Toaster />
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protegidas */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/projects" element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          } />

          <Route path="/projects/:id" element={
            <PrivateRoute>
              <ProjectDetail />
            </PrivateRoute>
          } />

          <Route path="/tasks" element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          } />

          <Route path="/tasks/:id" element={
            <PrivateRoute>
              <TaskDetail />
            </PrivateRoute>
          } />

          <Route path="/team" element={
            <PrivateRoute>
              <Team />
            </PrivateRoute>
          } />

          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
