// src/pages/RegisterAnimal/RegisterAnimal.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import Header from '../../components/Header/Header'; // Importação do componente modular

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
        birth_date: birthDate, 
      };

      await api.post('/animals', animalData);

      alert('Animal registrado com sucesso! Você já pode agendar consultas para ele.');
      navigate('/home'); 

    } catch (error) {
      console.error("Erro no registro do animal:", error);
      alert('Erro ao registrar o animal. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container"> 
      
      {/* CABEÇALHO MODULAR: isHome=false para mostrar o título */}
      <Header title="Adicionar Novo Animal 🐾" isHome={false} />
      
      <div className="mainContentInner"> 
        
        <form onSubmit={handleSubmit} className="formCard">
          
          <div className="inputGroup">
            <label htmlFor="name" className="inputLabel">Nome do Pet:</label>
            <input
              id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="inputField"
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="species" className="inputLabel">Espécie:</label>
            <select id="species" value={species} onChange={(e) => setSpecies(e.target.value)} required className="inputField">
              <option value="">Selecione a Espécie</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
              <option value="Passaro">Pássaro</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="inputGroup">
            <label htmlFor="breed" className="inputLabel">Raça (Opcional):</label>
            <input id="breed" type="text" value={breed} onChange={(e) => setBreed(e.target.value)} className="inputField"
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="birthDate" className="inputLabel">Data de Nascimento:</label>
            <input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="inputField"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="primaryButton"
          >
            {loading ? 'Registrando...' : 'Registrar Animal'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterAnimal;