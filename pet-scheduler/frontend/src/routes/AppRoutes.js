import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Páginas Importadas
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup'; 
import Home from '../pages/Home/Home'; 
import RegisterAnimal from '../pages/RegisterAnimal/RegisterAnimal';
import Schedule from '../pages/Schedule/Schedule';
import AppointmentList from '../pages/AppointmentList/AppointmentList'; // << Novo Import

/**
 * Componente de Rota Privada: Garante que apenas usuários logados 
 * possam acessar o componente 'Element'.
 */
function PrivateRoute({ element: Element, ...rest }) {
  const { signed, loading } = useAuth();
  
  if (loading) {
      // Exibe um carregador enquanto verifica o status de autenticação
      return <h1>Carregando...</h1>; 
  }

  // Se o usuário estiver logado (signed é true), renderiza o componente.
  // Caso contrário, redireciona para a tela de Login ('/').
  return signed ? Element : <Navigate to="/" />; 
}

export default function AppRoutes() {
  const { signed } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- Rotas Públicas (Acessíveis a todos) --- */}
        
        {/* Rota Raiz ('/'): Leva ao Login ou Home, dependendo da sessão */}
        <Route 
          path="/" 
          element={signed ? <Navigate to="/home" /> : <Login />} 
        />
        
        {/* Rota de Cadastro ('/signup'): Acessível apenas se deslogado */}
        <Route 
          path="/signup" 
          element={signed ? <Navigate to="/home" /> : <Signup />} 
        /> 

        {/* --- Rotas Privadas (Protegidas por PrivateRoute) --- */}
        
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
        <Route 
          path="/appointments-list" // << Nova Rota para Listagem de Consultas
          element={<PrivateRoute element={<AppointmentList />} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}