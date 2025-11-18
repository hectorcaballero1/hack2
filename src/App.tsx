import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login';
import Register from './pages/Register';
import Hola from './pages/Hola';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Toaster/>

          {/* Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          


          {/* Protegidas */}
          <Route path="/hola" element={
            <PrivateRoute>
              <Hola/>
            </PrivateRoute>
          }/>



          
          



          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;