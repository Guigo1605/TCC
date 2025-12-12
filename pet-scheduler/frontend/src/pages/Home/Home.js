import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Home() {
  const { user, signOut } = useAuth();

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid #ccc' }}>
        <h2>Bem-vindo(a), {user.name}! 🐾</h2>
        <button onClick={signOut} style={{ padding: '8px 15px', cursor: 'pointer' }}>
          Sair
        </button>
      </header>
      
      <main style={{ padding: '40px', textAlign: 'center' }}>
        <h3>O que você deseja fazer hoje?</h3>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginTop: '30px' }}>
          
          {/* Opção 1: Registrar Novo Animal */}
          <Link to="/register-animal" style={{ textDecoration: 'none', padding: '25px', border: '2px solid #007bff', borderRadius: '8px', width: '200px', backgroundColor: '#e6f7ff' }}>
            <h4>🐕 Registrar Novo Animal</h4>
            <p>Adicione um novo pet.</p>
          </Link>

          {/* Opção 2: Ver Animais (NOVO LINK) */}
          <Link to="/animals-list" style={{ textDecoration: 'none', padding: '25px', border: '2px solid #28a745', borderRadius: '8px', width: '200px', backgroundColor: '#e6ffe6' }}>
            <h4>📝 Ver/Editar Animais</h4>
            <p>Gerencie seus pets cadastrados.</p>
          </Link>

          {/* Opção 3: Agendar Horário */}
          <Link to="/schedule" style={{ textDecoration: 'none', padding: '25px', border: '2px solid #ffc107', borderRadius: '8px', width: '200px', backgroundColor: '#fff8e1' }}>
            <h4>🏥 Agendar Horário</h4>
            <p>Escolha a data e hora.</p>
          </Link>

          {/* Opção 4: Ver Agendamentos */}
          <Link to="/appointments-list" style={{ textDecoration: 'none', padding: '25px', border: '2px solid #dc3545', borderRadius: '8px', width: '200px', backgroundColor: '#ffe6e6' }}>
            <h4>📄 Ver Agendamentos</h4>
            <p>Visualize suas consultas futuras.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;