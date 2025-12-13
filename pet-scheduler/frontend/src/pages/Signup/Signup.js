// src/pages/Signup/Signup.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext'; 

import planoDeFundo from '../../assets/planoDeFundo.png'; 
import logoImage from '../../assets/logo1.png'; 

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signIn } = useAuth(); 

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const userData = { name, email, password };

      await api.post('/users', userData);
      
      const success = await signIn(email, password); 

      if (success) {
        alert(`Conta criada com sucesso!`);
        navigate('/home'); 
      } else {
        alert('Conta criada, mas houve falha no login automático. Tente fazer login manualmente.');
        navigate('/'); 
      }

    } catch (error) {
      console.error("Erro no registro:", error.response ? error.response.data.error : error.message);
      alert(`Erro ao registrar: ${error.response?.data?.error || 'Verifique sua conexão ou se o e-mail já está em uso.'}`);
    } finally {
      setLoading(false);
    }
  }
  
  // ESTILO DE FUNDO COM ESCALA FIXA (IGUAL AO LOGIN)
  const backgroundStyle = {
    backgroundImage: `url(${planoDeFundo})`,
    backgroundColor: 'var(--color-primary)', 
    
    backgroundSize: '100px', 
    
    backgroundRepeat: 'repeat',
    backgroundPosition: '0 0', 
    backgroundAttachment: 'fixed',
  };

  return (
    <div className="loginPageContainer" style={backgroundStyle}>
      
      <div className="loginCard">
        
        <div className="logoContainer">
          <img 
            src={logoImage} 
            alt="Logo Pata Amiga" 
            className="appLogo" 
          />
        </div>

        <h2 className="loginTitle">CADASTRO</h2> {/* TÍTULO RESTAURADO */}
        
        <form onSubmit={handleSubmit} className="loginForm">
          
          <div className="inputGroup">
            <label htmlFor="name" className="inputLabel">Nome Completo:</label>
            <input 
              id="name" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="inputField"
              placeholder="Seu nome completo"
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="email" className="inputLabel">E-mail:</label>
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
            <label htmlFor="password" className="inputLabel">Senha (mín. 6 caracteres):</label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="inputField"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="loginButton"
          >
            {loading ? 'Registrando...' : 'Cadastrar'}
          </button>
          
          <p className="signupText">
            Já tem conta? <Link to="/" className="signupLink">Fazer Login</Link>
          </p>
        </form>
      </div>
   </div>
  );
}

export default Signup;