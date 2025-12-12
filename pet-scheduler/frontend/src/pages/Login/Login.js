import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    const success = await signIn(email, password);

    if (success) {
      alert('Login realizado com sucesso!');
      // O AppRoutes fará o redirecionamento automático para /home
    } else {
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  }

  return (
    <div>
      <h2>Login - Pet Scheduler</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
        <p>Ainda não tem conta? <a href="/signup">Cadastre-se aqui</a></p>
      </form>
    </div>
  );
}

export default Login;