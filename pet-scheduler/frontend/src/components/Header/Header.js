// src/components/Header/Header.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
// Ajuste o caminho do logo se necessário (assumindo que assets/logo2.png exista)
import logo2Image from '../../assets/logo2.png'; 
import './Header.css'; // O arquivo de estilos do Header

// O componente Header agora é flexível
function Header({ title, isHome = false }) {
    const navigate = useNavigate();

    // Define a ação e o texto do botão
    const buttonAction = isHome ? 'Sair' : 'Voltar';

    // Conteúdo Principal: Logo na Home, Título nas outras páginas
    const content = isHome ? (
        <div className="headerLogo">
            <img 
                src={logo2Image} 
                alt="Logo Pata Amiga" 
                className="headerAppLogo" 
            />
        </div>
    ) : (
        <h2 className="headerTitleInternal">{title}</h2>
    );

    const handleButtonClick = () => {
        if (isHome) {
            // Ação de Sair: Aqui você chamaria o signOut do AuthContext
            alert("Ação de Sair executada. Navegando para a página de Login."); 
            navigate('/'); 
        } else {
            // Ação de Voltar: Navega para a Home
            navigate('/home');
        }
    };

    return (
        <header className="headerBase">
            {content}
            
            <button 
                onClick={handleButtonClick} 
                className="signOutButton"
            >
                {buttonAction}
            </button>
        </header>
    );
}

export default Header;