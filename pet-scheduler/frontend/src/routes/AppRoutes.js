import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Páginas Importadas
import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home'; 
import RegisterAnimal from '../pages/RegisterAnimal/RegisterAnimal'; // << NOVO
import Schedule from '../pages/Schedule/Schedule'; // << NOVO

// Componente para rotas privadas
function PrivateRoute({ element: Element, ...rest }) {
  const { signed, loading } = useAuth();
  
  if (loading) {
      return <h1>Carregando...</h1>; 
  }

  return signed ? Element : <Navigate to="/" />; 
}

export default function AppRoutes() {
  const { signed } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login */}
        <Route path="/" element={signed ? <Navigate to="/home" /> : <Login />} />
        
        {/* Rotas Privadas (Protegidas) */}
        <Route 
          path="/home" 
          element={<PrivateRoute element={<Home />} />} 
        />
        <Route 
          path="/register-animal" 
          element={<PrivateRoute element={<RegisterAnimal />} />} 
        />
        <Route 
          path="/schedule" 
          element={<PrivateRoute element={<Schedule />} />} 
        />
        {/* Adicionar rota de registro de novo usuário se necessário */}
        {/* <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </BrowserRouter>
  );
}