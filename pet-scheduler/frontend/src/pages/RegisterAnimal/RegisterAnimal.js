import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function RegisterAnimal() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Validação básica
    if (!name || !species) {
        alert('Nome e Espécie são obrigatórios.');
        setLoading(false);
        return;
    }

    try {
      const animalData = {
        name,
        species,
        breed,
        // O backend espera birth_date no formato ISO 8601 (YYYY-MM-DD)
        birth_date: birthDate, 
      };

      // A API já envia o token JWT automaticamente via AuthContext/Axios defaults
      await api.post('/animals', animalData);

      alert('Animal registrado com sucesso! Você já pode agendar consultas para ele.');
      navigate('/home'); // Volta para a tela inicial

    } catch (error) {
      console.error("Erro no registro do animal:", error);
      alert('Erro ao registrar o animal. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <header>
        <h2>Adicionar Novo Animal 🐾</h2>
        <button onClick={() => navigate('/home')}>Voltar</button>
      </header>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '20px', maxWidth: '400px', margin: 'auto' }}>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name">Nome do Pet:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="species">Espécie:</label>
          <select
            id="species"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Selecione a Espécie</option>
            <option value="Cachorro">Cachorro</option>
            <option value="Gato">Gato</option>
            <option value="Passaro">Pássaro</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="breed">Raça (Opcional):</label>
          <input
            id="breed"
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="birthDate">Data de Nascimento:</label>
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          {loading ? 'Registrando...' : 'Registrar Animal'}
        </button>
      </form>
    </div>
  );
}

export default RegisterAnimal;