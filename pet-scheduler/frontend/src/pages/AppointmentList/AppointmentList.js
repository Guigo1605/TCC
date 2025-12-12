import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

// IMPORTAR O NOVO COMPONENTE DE EDIÇÃO A SER CRIADO (STEP 3)
// import EditAppointmentModal from './EditAppointmentModal'; 

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

  // --- FUNÇÃO PARA CARREGAR AGENDAMENTOS ---
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

  // --- NOVO: FUNÇÃO PARA EXCLUIR AGENDAMENTO ---
  async function handleDelete(appointmentId) {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento? Esta ação é irreversível.')) {
        try {
            await api.delete(`/appointments/${appointmentId}`);
            
            // Recarrega a lista ou filtra o agendamento excluído
            setAppointments(appointments.filter(appt => appt.id !== appointmentId));
            alert('Agendamento cancelado com sucesso!');
        } catch (error) {
            console.error("Erro ao excluir agendamento:", error.response?.data?.error || error.message);
            alert(`Erro ao cancelar: ${error.response?.data?.error || 'Tente novamente.'}`);
        }
    }
  }
  
  // --- NOVO: FUNÇÕES DE EDIÇÃO (Preparação para o Step 3) ---
  const handleEdit = (appointment) => {
    setEditingAppointment(appointment); // Abre o modal/formulário de edição
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
                <th style={tableHeaderStyle}>Ações</th> {/* NOVA COLUNA */}
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tableCellStyle}>{appt.pet.name}</td>
                  <td style={tableCellStyle}>{appt.pet.species}</td>
                  <td style={tableCellStyle}>{formatAppointmentDate(appt.date)}</td>
                  <td style={tableCellStyle}>{appt.description || 'N/A'}</td>
                  
                  {/* NOVA CÉLULA DE AÇÕES */}
                  <td style={tableCellStyle}>
                    <button 
                        // onClick={() => handleEdit(appt)} 
                        style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#ffc107' }}
                    >
                        Editar (Próx. passo)
                    </button>
                    <button 
                        onClick={() => handleDelete(appt.id)}
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
      
      {/* // --- NOVO: MODAL DE EDIÇÃO (Será implementado no Step 3) ---
      {editingAppointment && (
          <EditAppointmentModal 
              appointment={editingAppointment}
              onClose={() => setEditingAppointment(null)}
              onUpdateSuccess={handleUpdateSuccess}
          />
      )} 
      */}
      
    </div>
  );
}

// Estilos simples para a tabela
const tableHeaderStyle = { padding: '10px', textAlign: 'left', border: '1px solid #ccc' };
const tableCellStyle = { padding: '10px', border: '1px solid #eee' };


export default AppointmentList;