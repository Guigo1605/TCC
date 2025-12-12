import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Páginas Importadas
import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home'; 
import RegisterAnimal from '../pages/RegisterAnimal/RegisterAnimal';
import Schedule from '../pages/Schedule/Schedule';
import Signup from '../pages/Signup/Signup'; // << Importação da página de Cadastro

// Componente para rotas privadas
function PrivateRoute({ element: Element, ...rest }) {
  const { signed, loading } = useAuth();
  
  if (loading) {
      return <h1>Carregando...</h1>; 
  }

  // Se o usuário não estiver logado, redireciona para o login
  return signed ? Element : <Navigate to="/" />; 
}

export default function AppRoutes() {
  const { signed } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login (Se já logado, redireciona para a Home) */}
        <Route path="/" element={signed ? <Navigate to="/home" /> : <Login />} />
        
        {/* Rota de Cadastro (Acessível apenas se NÃO estiver logado) */}
        <Route path="/signup" element={signed ? <Navigate to="/home" /> : <Signup />} /> 

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
      </Routes>
    </BrowserRouter>
  );
}