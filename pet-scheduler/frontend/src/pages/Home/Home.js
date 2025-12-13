// src/pages/Home/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
// Assumindo que você tem o componente Header no caminho correto:
import Header from '../../components/Header/Header'; 
// import { useAuth } from '../../context/AuthContext'; // Manter se estiver usando AuthContext

function Home() {
    // const { signOut } = useAuth(); // Descomentar se estiver usando

    return (
        <div className="container">
            
            {/* NOVO CABEÇALHO: Usa o Header modular com isHome=true */}
            <Header isHome={true} /> 

            <main className="mainContent">
                <h1 className="mainTitle">O que você deseja fazer hoje?</h1>

                <div className="optionsGrid">
                    
                    {/* Opção 1: Registrar Novo Animal */}
                    <Link to="/register-animal" className="optionLink option-1">
                        <h4>🐶 Registrar Novo Animal</h4>
                        <p>Adicione um novo pet.</p>
                    </Link>

                    {/* Opção 2: Ver/Editar Animais */}
                    <Link to="/animals-list" className="optionLink option-2">
                        <h4>📋 Ver/Editar Animais</h4>
                        <p>Gerencie seus pets cadastrados.</p>
                    </Link>

                    {/* Opção 3: Agendar Horário */}
                    <Link to="/schedule" className="optionLink option-3">
                        <h4>📅 Agendar Horário</h4>
                        <p>Escolha a data e hora.</p>
                    </Link>

                    {/* Opção 4: Ver Agendamentos */}
                    <Link to="/appointments-list" className="optionLink option-4">
                        <h4>🏥 Ver Agendamentos</h4>
                        <p>Visualize suas consultas futuras.</p>
                    </Link>

                </div>
            </main>
        </div>
    );
}

export default Home;