// src/pages/Login/Login.js

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom'; 

// Importa a imagem de fundo e o NOVO LOGO
import planoDeFundo from '../../assets/planoDeFundo.png'; 
import logoImage from '../../assets/logo1.png'; // <--- CAMINHO CORRIGIDO

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await signIn(email, password);
    if (!success) {
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  }

  const backgroundStyle = {
    backgroundImage: `url(${planoDeFundo})`,
    backgroundColor: 'var(--color-primary)', 
    backgroundSize: '100%', 
    backgroundRepeat: 'repeat',
    backgroundPosition: '0 0', 
  };

  return (
    <div className="loginPageContainer" style={backgroundStyle}>
      
      <div className="loginCard">
        
        {/* NOVO LOGO: Substituição do ícone e texto pela imagem */}
        <div className="logoContainer">
          <img 
            src={logoImage} 
            alt="Logo Pata Amiga" 
            className="appLogo" 
          />
        </div>
        
        <form onSubmit={handleSubmit} className="loginForm">
          
          <div className="inputGroup">
            <label htmlFor="email" className="inputLabel">E-mail</label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="inputField"
              placeholder="seuemail@exemplo.com"
            />
          </div>
          
          <div className="inputGroup">
            <label htmlFor="password" className="inputLabel">Senha</label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="inputField"
            />
            <Link to="/forgot-password" className="forgotPasswordLink">Esqueci minha senha</Link>
          </div>
          
          <button type="submit" className="loginButton primaryButton">Entrar</button>
          
          <p className="signupText">
            <Link to="/signup" className="signupLink">Criar conta</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;