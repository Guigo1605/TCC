// frontend/src/pages/AnimalList/EditAnimalModal.js

import React, { useState } from 'react';
import api from '../../services/api';

// Função auxiliar para formatar a data ISO para o formato "YYYY-MM-DD" (necessário pelo input date)
function formatDateToInput(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}`;
}


function EditAnimalModal({ animal, onClose, onUpdateSuccess }) {
  const [name, setName] = useState(animal.name);
  const [species, setSpecies] = useState(animal.species);
  const [breed, setBreed] = useState(animal.breed);
  const [birthDate, setBirthDate] = useState(formatDateToInput(animal.birth_date));
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedData = {
        name,
        species,
        breed,
        birth_date: new Date(birthDate).toISOString(), // Converte para o formato ISO
      };

      // Chama a rota PUT do Backend
      await api.put(`/animals/${animal.id}`, updatedData);
      
      alert(`Animal "${name}" atualizado com sucesso!`);
      onUpdateSuccess(); // Fecha o modal e recarrega a lista

    } catch (error) {
      console.error("Erro ao editar animal:", error.response?.data?.error || error.message);
      alert(`Erro ao atualizar: ${error.response?.data?.error || 'Ocorreu um erro.'}`);
    } finally {
      setLoading(false);
    }
  }

  // Estilos simples de modal
  const modalStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
  };
  const contentStyle = {
    backgroundColor: 'white', padding: '30px', borderRadius: '8px',
    maxWidth: '500px', width: '90%', position: 'relative'
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>X</button>
        
        <h3>Editar Dados do Pet: **{animal.name}**</h3>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          
          <div style={inputGroupStyle}>
            <label htmlFor="edit-name">Nome:</label>
            <input id="edit-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="edit-species">Espécie:</label>
            <input id="edit-species" type="text" value={species} onChange={(e) => setSpecies(e.target.value)} required style={inputStyle} />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="edit-breed">Raça:</label>
            <input id="edit-breed" type="text" value={breed} onChange={(e) => setBreed(e.target.value)} style={inputStyle} />
          </div>
          
          <div style={inputGroupStyle}>
            <label htmlFor="edit-birthDate">Data de Nascimento:</label>
            <input id="edit-birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} style={inputStyle} />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            {loading ? 'Salvando...' : 'Salvar Dados'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputGroupStyle = { marginBottom: '15px' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };

export default EditAnimalModal;