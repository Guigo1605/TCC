import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

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
    // Se for bem-sucedido, o AppRoutes fará o redirecionamento automático
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login - Pet Scheduler</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <div style={{ marginBottom: '25px' }}>
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Entrar</button>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Ainda não tem conta? <a href="/signup">Cadastre-se aqui</a>
        </p>
      </form>
    </div>
  );
}

export default Login;