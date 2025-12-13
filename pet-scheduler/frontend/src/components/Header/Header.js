// src/components/Header/Header.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo2Image from '../../assets/logo2.png'; 
// NÃO PRECISA IMPORTAR CSS

function Header({ title, isHome = false }) {
    const navigate = useNavigate();

    const buttonAction = isHome ? 'Sair' : 'Voltar';

    const handleButtonClick = () => {
        if (isHome) {
            alert("Ação de Sair executada. Navegando para a página de Login."); 
            navigate('/'); 
        } else {
            navigate('/home');
        }
    };

    return (
        <header className="headerBase">
            
            {/* NOVO: Container para Logo e Título/Conteúdo */}
            <div className="headerContentGroup">
                
                {/* 1. O LOGO ESTÁ SEMPRE AQUI */}
                <div className="headerLogo">
                    <img 
                        src={logo2Image} 
                        alt="Logo Pata Amiga" 
                        className="headerAppLogo" 
                    />
                </div>

                {/* 2. O TÍTULO APARECE APENAS EM PÁGINAS INTERNAS */}
                {!isHome && title && (
                    <h2 className="headerTitleInternal">{title}</h2>
                )}
            </div>

            {/* BOTÃO (Sair ou Voltar) */}
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