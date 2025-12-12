import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext'; 

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  // Importa signIn para autenticar o usuário após o registro bem-sucedido
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

      // 1. Envia os dados para a rota POST /users no backend
      await api.post('/users', userData);
      
      // 2. Faz o login automático usando a função signIn
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

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Crie sua Conta - Pet Scheduler</h2>
      <form onSubmit={handleSubmit}>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name">Nome Completo:</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">E-mail:</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label htmlFor="password">Senha (mín. 6 caracteres):</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
        </div>
        
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Registrando...' : 'Cadastrar'}
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Já tem conta? <a href="/">Fazer Login</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;