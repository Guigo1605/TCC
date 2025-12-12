import React, { useState } from 'react';
import api from '../../services/api';

// Função auxiliar para formatar a data ISO para o formato "YYYY-MM-DDTHH:MM" (necessário pelo input datetime-local)
function formatToInputDateTime(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    
    // Formato YYYY-MM-DD
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    // Formato HH:MM
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}


function EditAppointmentModal({ appointment, onClose, onUpdateSuccess }) {
  const [date, setDate] = useState(formatToInputDateTime(appointment.date));
  const [description, setDescription] = useState(appointment.description || '');
  const [loading, setLoading] = useState(false);

  // O status é mantido como 'scheduled' no frontend do tutor para simplificação
  // Apenas o veterinário/admin mudaria para 'completed' ou 'canceled'

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Converte de volta para o formato ISO que o backend espera
    const newDate = new Date(date).toISOString(); 

    try {
      const updatedData = {
        date: newDate,
        description,
        status: 'scheduled' // Mantém o status como agendado ao editar
      };

      // Chama a rota PUT do Backend
      await api.put(`/appointments/${appointment.id}`, updatedData);
      
      alert('Agendamento atualizado com sucesso!');
      onUpdateSuccess(); // Chama a função para fechar o modal e recarregar a lista

    } catch (error) {
      console.error("Erro ao editar agendamento:", error.response?.data?.error || error.message);
      alert(`Erro ao atualizar: ${error.response?.data?.error || 'Verifique se a nova data está no futuro.'}`);
    } finally {
      setLoading(false);
    }
  }

  // Estilos simples de modal (pode ser melhorado com CSS)
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
        
        <h3>Editar Agendamento</h3>
        <p>Pet: **{appointment.pet.name}**</p>
        <p>Espécie: *{appointment.pet.species}*</p>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="edit-date">Nova Data e Hora:</label>
            <input 
              id="edit-date" 
              type="datetime-local" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label htmlFor="edit-description">Motivo (Opcional):</label>
            <textarea 
              id="edit-description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="3"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditAppointmentModal;