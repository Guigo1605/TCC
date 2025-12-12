import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Efeito para carregar a sessão do localStorage ao iniciar
  useEffect(() => {
    async function loadStoragedData() {
      // O token e o usuário devem ser armazenados
      const storagedUser = localStorage.getItem('@PetScheduler:user');
      const storagedToken = localStorage.getItem('@PetScheduler:token');

      if (storagedToken && storagedUser) {
        // Configura o cabeçalho 'Authorization' padrão para todas as requisições
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        
        setUser(JSON.parse(storagedUser));
      }
      setLoading(false);
    }

    loadStoragedData();
  }, []);

  // 2. Função de Login
  async function signIn(email, password) {
    try {
      const response = await api.post('sessions', { email, password });

      const { user, token } = response.data;

      // Armazena no estado
      setUser(user); 

      // Armazena no localStorage
      localStorage.setItem('@PetScheduler:user', JSON.stringify(user));
      localStorage.setItem('@PetScheduler:token', token);

      // Define o token no cabeçalho do Axios para futuras requisições
      api.defaults.headers.Authorization = `Bearer ${token}`;
      
      return true; // Sucesso no login
      
    } catch (error) {
      console.error("Erro de login:", error.response ? error.response.data.error : error.message);
      return false; // Falha no login
    }
  }

  // 3. Função de Logout
  function signOut() {
    localStorage.clear(); // Limpa token e usuário do localStorage
    setUser(null); // Limpa o estado
    api.defaults.headers.Authorization = null; // Remove o token do Axios
  }

  return (
    <AuthContext.Provider 
      value={{ 
        signed: !!user, // true se user for diferente de null
        user, 
        loading,
        signIn, 
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook Customizado para facilitar o uso do contexto
function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }

  return context;
}

export { AuthProvider, useAuth };