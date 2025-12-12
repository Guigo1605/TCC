import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import EditAppointmentModal from './EditAppointmentModal'; // << Importação do NOVO componente (criaremos no próximo passo)

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState(null); // Estado para o modal de edição
  const navigate = useNavigate();

  function formatAppointmentDate(isoDate) {
    if (!isoDate) return 'Data Indefinida';
    const date = new Date(isoDate);
    
    const options = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    };
    return date.toLocaleDateString('pt-BR', options);
  }

  // Função para carregar agendamentos
  async function loadAppointments() {
    try {
      setLoading(true);
      const response = await api.get('/appointments'); 
      setAppointments(response.data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      alert('Não foi possível carregar a lista de agendamentos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  // --- Lógica de Exclusão (JÁ IMPLEMENTADA) ---
  async function handleDelete(appointmentId) {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento? Esta ação é irreversível.')) {
        try {
            await api.delete(`/appointments/${appointmentId}`);
            
            setAppointments(appointments.filter(appt => appt.id !== appointmentId));
            alert('Agendamento cancelado com sucesso!');
        } catch (error) {
            console.error("Erro ao excluir agendamento:", error.response?.data?.error || error.message);
            alert(`Erro ao cancelar: ${error.response?.data?.error || 'Tente novamente.'}`);
        }
    }
  }
  
  // --- Lógica de Edição ---
  const handleEdit = (appointment) => {
    setEditingAppointment(appointment); 
  };

  const handleUpdateSuccess = () => {
    setEditingAppointment(null); // Fecha o modal
    loadAppointments(); // Recarrega os dados atualizados
  };


  if (loading) {
    return <div style={{ padding: '20px' }}>Carregando seus agendamentos...</div>;
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Seus Próximos Agendamentos 📅</h2>
        <button onClick={() => navigate('/home')}>Voltar</button>
      </header>
      
      <main style={{ marginTop: '20px' }}>
        {appointments.length === 0 ? (
          <p>Você não possui agendamentos futuros. <a href="/schedule">Clique aqui para agendar uma consulta.</a></p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#ccc' }}>
                <th style={tableHeaderStyle}>Pet</th>
                <th style={tableHeaderStyle}>Espécie</th>
                <th style={tableHeaderStyle}>Data e Hora</th>
                <th style={tableHeaderStyle}>Motivo</th>
                <th style={tableHeaderStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => {
                // NOVO: Verifica se a data do agendamento é no passado
                const isPast = new Date(appt.date) < new Date();

                return (
                  <tr key={appt.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tableCellStyle}>{appt.pet.name}</td>
                    <td style={tableCellStyle}>{appt.pet.species}</td>
                    <td style={tableCellStyle}>{formatAppointmentDate(appt.date)}</td>
                    <td style={tableCellStyle}>{appt.description || 'N/A'}</td>
                    
                    <td style={tableCellStyle}>
                        {isPast ? (
                            <span style={{ color: 'gray' }}>Consulta Concluída/Passada</span>
                        ) : (
                            // Botões de Ação aparecem apenas se a consulta for futura
                            <>
                                <button 
                                    onClick={() => handleEdit(appt)} 
                                    style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#ffc107' }}
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleDelete(appt.id)}
                                    style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white' }}
                                >
                                    Excluir
                                </button>
                            </>
                        )}
                    </td>
                  </tr>
                )})}
            </tbody>
          </table>
        )}
      </main>
      
      {/* NOVO: MODAL DE EDIÇÃO */}
      {editingAppointment && (
          <EditAppointmentModal 
              appointment={editingAppointment}
              onClose={() => setEditingAppointment(null)}
              onUpdateSuccess={handleUpdateSuccess}
          />
      )} 
      
    </div>
  );
}

// Estilos simples para a tabela
const tableHeaderStyle = { padding: '10px', textAlign: 'left', border: '1px solid #ccc' };
const tableCellStyle = { padding: '10px', border: '1px solid #eee' };


export default AppointmentList;