// src/pages/Home/Home.js (Com correção do Warning)

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Certifique-se de que o logo2.png está em src/assets/
import logo2Image from '../../assets/logo2.png'; 

function Home() {
  // CORREÇÃO: Removendo 'user' pois não está mais sendo usado no JSX
  const { signOut } = useAuth(); 

  return (
    <div className="container"> 
      
      <header className="header">
        
        <div className="headerLogo">
          <img 
            src={logo2Image} 
            alt="Logo Pata Amiga" 
            className="headerAppLogo" 
          />
        </div>
        
        <button onClick={signOut} className="signOutButton"> 
          Sair
        </button>
      </header>
      
      <main className="mainContent"> 
        <h3 className="mainTitle">O que você deseja fazer hoje?</h3> 
        
        <div className="optionsGrid"> 
          
          <Link to="/register-animal" className="optionLink option-1"> 
            <h4>🐕 Registrar Novo Animal</h4>
            <p>Adicione um novo pet.</p>
          </Link>

          <Link to="/animals-list" className="optionLink option-2">
            <h4>📝 Ver/Editar Animais</h4>
            <p>Gerencie seus pets cadastrados.</p>
          </Link>

          <Link to="/schedule" className="optionLink option-3">
            <h4>🏥 Agendar Horário</h4>
            <p>Escolha a data e hora.</p>
          </Link>

          <Link to="/appointments-list" className="optionLink option-4">
            <h4>📄 Ver Agendamentos</h4>
            <p>Visualize suas consultas futuras.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;