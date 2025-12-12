import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Schedule() {
  const [animals, setAnimals] = useState([]); // Lista de pets do usuário
  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // Efeito para carregar os animais do usuário
  useEffect(() => {
    async function loadAnimals() {
      try {
        setLoading(true);
        // Usa a rota GET /animals, que retorna apenas os pets do usuário logado
        const response = await api.get('/animals'); 
        setAnimals(response.data);
      } catch (error) {
        console.error("Erro ao carregar animais:", error);
        alert('Não foi possível carregar a lista de pets. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    loadAnimals();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    if (!selectedAnimalId || !appointmentDate) {
        alert('Por favor, selecione um animal e a data/hora da consulta.');
        setSubmitting(false);
        return;
    }

    try {
      const scheduleData = {
        animal_id: selectedAnimalId,
        // O backend espera a data no formato datetime (YYYY-MM-DDTHH:MM:SSZ)
        date: new Date(appointmentDate).toISOString(), 
        description,
      };

      await api.post('/appointments', scheduleData);

      alert('Consulta agendada com sucesso!');
      navigate('/home'); 

    } catch (error) {
      console.error("Erro no agendamento:", error.response ? error.response.data.error : error.message);
      // Exibe a mensagem de erro do backend (ex: conflito de horário)
      alert(`Falha no agendamento: ${error.response?.data?.error || 'Erro desconhecido.'}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '20px' }}>Carregando animais...</div>;
  }
  
  if (animals.length === 0) {
      return (
          <div style={{ padding: '20px' }}>
              <h2>Agendamento de Consultas</h2>
              <p>Você não possui animais cadastrados. Por favor, <a href="/register-animal">registre um pet</a> antes de agendar uma consulta.</p>
              <button onClick={() => navigate('/home')}>Voltar</button>
          </div>
      );
  }

  return (
    <div style={{ padding: '20px' }}>
      <header>
        <h2>Agendar Novo Horário 🏥</h2>
        <button onClick={() => navigate('/home')}>Voltar</button>
      </header>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '20px', maxWidth: '400px', margin: 'auto' }}>
        
        {/* Campo 1: Seleção do Animal */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="animal">Selecione o Pet:</label>
          <select
            id="animal"
            value={selectedAnimalId}
            onChange={(e) => setSelectedAnimalId(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">-- Escolha um pet --</option>
            {animals.map(animal => (
              <option key={animal.id} value={animal.id}>
                {animal.name} ({animal.species})
              </option>
            ))}
          </select>
        </div>

        {/* Campo 2: Data e Hora */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="date">Data e Hora da Consulta:</label>
          <input
            id="date"
            type="datetime-local" // Permite selecionar data e hora
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Campo 3: Descrição */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description">Motivo da Consulta (Opcional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={submitting}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          {submitting ? 'Agendando...' : 'Confirmar Agendamento'}
        </button>
      </form>
    </div>
  );
}

export default Schedule;