import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Páginas Importadas
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup'; 
import Home from '../pages/Home/Home'; 
import RegisterAnimal from '../pages/RegisterAnimal/RegisterAnimal';
import Schedule from '../pages/Schedule/Schedule';
import AppointmentList from '../pages/AppointmentList/AppointmentList';
import AnimalList from '../pages/AnimalList/AnimalList'; // << NOVO IMPORT

// Componente de Rota Privada
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
        
        {/* Rotas Públicas */}
        <Route path="/" element={signed ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={signed ? <Navigate to="/home" /> : <Signup />} /> 

        {/* Rotas Privadas */}
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/register-animal" element={<PrivateRoute element={<RegisterAnimal />} />} />
        <Route path="/schedule" element={<PrivateRoute element={<Schedule />} />} />
        <Route path="/appointments-list" element={<PrivateRoute element={<AppointmentList />} />} />
        
        {/* Rota para Listagem de Animais */}
        <Route 
          path="/animals-list" 
          element={<PrivateRoute element={<AnimalList />} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}