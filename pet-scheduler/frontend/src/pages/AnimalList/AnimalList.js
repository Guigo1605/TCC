// frontend/src/pages/AnimalList/AnimalList.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import EditAnimalModal from './EditAnimalModal'; // Componente a ser criado

function AnimalList() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAnimal, setEditingAnimal] = useState(null); // Para controlar o modal
  const navigate = useNavigate();

  // Função para carregar os animais
  async function loadAnimals() {
    try {
      setLoading(true);
      const response = await api.get('/animals'); 
      setAnimals(response.data);
    } catch (error) {
      console.error("Erro ao carregar animais:", error);
      alert('Não foi possível carregar a lista de animais.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnimals();
  }, []);

  // --- FUNÇÃO PARA EXCLUIR ANIMAL ---
  async function handleDelete(animalId) {
    if (window.confirm('Tem certeza que deseja EXCLUIR este animal? Todos os agendamentos relacionados serão afetados.')) {
        try {
            await api.delete(`/animals/${animalId}`);
            
            // Filtra o animal excluído da lista
            setAnimals(animals.filter(animal => animal.id !== animalId));
            alert('Animal excluído com sucesso!');
        } catch (error) {
            console.error("Erro ao excluir animal:", error.response?.data?.error || error.message);
            alert(`Erro ao excluir: ${error.response?.data?.error || 'Tente novamente.'}`);
        }
    }
  }
  
  // --- FUNÇÕES DE EDIÇÃO ---
  const handleEdit = (animal) => {
    setEditingAnimal(animal); // Abre o modal de edição
  };

  const handleUpdateSuccess = () => {
    setEditingAnimal(null); // Fecha o modal
    loadAnimals(); // Recarrega os dados atualizados
  };


  if (loading) {
    return <div style={{ padding: '20px' }}>Carregando seus animais...</div>;
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Meus Animais Cadastrados 🐶🐱</h2>
        <button onClick={() => navigate('/home')}>Voltar</button>
      </header>
      
      <main style={{ marginTop: '20px' }}>
        {animals.length === 0 ? (
          <p>Você não possui animais cadastrados. <a href="/register-animal">Clique aqui para cadastrar um novo pet.</a></p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#ccc' }}>
                <th style={tableHeaderStyle}>Nome</th>
                <th style={tableHeaderStyle}>Espécie</th>
                <th style={tableHeaderStyle}>Raça</th>
                <th style={tableHeaderStyle}>Nascimento</th>
                <th style={tableHeaderStyle}>Ações</th> 
              </tr>
            </thead>
            <tbody>
              {animals.map((animal) => (
                <tr key={animal.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tableCellStyle}>{animal.name}</td>
                  <td style={tableCellStyle}>{animal.species}</td>
                  <td style={tableCellStyle}>{animal.breed}</td>
                  <td style={tableCellStyle}>{new Date(animal.birth_date).toLocaleDateString('pt-BR')}</td>
                  
                  <td style={tableCellStyle}>
                    <button 
                        onClick={() => handleEdit(animal)} 
                        style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#ffc107' }}
                    >
                        Editar
                    </button>
                    <button 
                        onClick={() => handleDelete(animal.id)}
                        style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white' }}
                    >
                        Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      
      {/* MODAL DE EDIÇÃO */}
      {editingAnimal && (
          <EditAnimalModal 
              animal={editingAnimal}
              onClose={() => setEditingAnimal(null)}
              onUpdateSuccess={handleUpdateSuccess}
          />
      )} 
      
    </div>
  );
}

// Estilos simples para a tabela
const tableHeaderStyle = { padding: '10px', textAlign: 'left', border: '1px solid #ccc' };
const tableCellStyle = { padding: '10px', border: '1px solid #eee' };


export default AnimalList;