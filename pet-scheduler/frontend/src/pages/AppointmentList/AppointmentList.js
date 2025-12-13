import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line
import api from '../../services/api';
import Header from '../../components/Header/Header';
import EditAppointmentModal from './EditAppointmentModal'; // Importação do componente de Modal

function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingAppointment, setEditingAppointment] = useState(null); 
    const navigate = useNavigate();

    // Função para formatar a data/hora para exibição na lista
    function formatAppointmentDate(isoDate) {
        if (!isoDate) return 'Data Indefinida';
        const date = new Date(isoDate);
        
        const options = {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        // O "long" do mês foi alterado para "short" para caber melhor na tabela
        return date.toLocaleDateString('pt-BR', options);
    }

    // Função para carregar agendamentos
    // eslint-disable-next-line
    async function loadAppointments() {
        try {
            // eslint-disable-next-line
            setLoading(true);
            // eslint-disable-next-line
            const response = await api.get('/appointments'); 
            
            // Filtra os agendamentos para mostrar apenas os futuros,
            // ou, se desejar mostrar todos, ordene-os. Vamos manter todos por enquanto
            // para mostrar o status 'Concluída'.
            setAppointments(response.data);
        } catch (error) {
            console.error("Erro ao carregar agendamentos:", error);
            alert('Não foi possível carregar a lista de agendamentos.');
        } finally {
            // eslint-disable-next-line
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAppointments();
    }, []);

    // --- Lógica de Exclusão (Cancelar) ---
    async function handleDelete(appointmentId) {
        if (window.confirm('Tem certeza que deseja cancelar este agendamento? Esta ação é irreversível.')) {
            try {
                // eslint-disable-next-line
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
        return (
            <div className="container">
                <Header title="Meus Agendamentos 📅" isHome={false} />
                <div className="mainContentInner">
                    <h3 className="loadingText">Carregando seus agendamentos...</h3>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container">
            <Header title="Meus Agendamentos 📅" isHome={false} />
            
            <div className="mainContentInner">
                
                {appointments.length === 0 ? (
                    // ESTADO VAZIO
                    <div className="emptyState">
                        <p className="emptyStateText">Você não possui agendamentos futuros.</p>
                        <button onClick={() => navigate('/schedule')} className="primaryButton" style={{ width: 'auto' }}>
                            Agendar uma Consulta Agora
                        </button>
                    </div>
                ) : (
                    // TABELA DE AGENDAMENTOS
                    <div className="tableContainer">
                        <table className="dataTable">
                            <thead>
                                <tr>
                                    <th className="tableHeader">Pet</th>
                                    <th className="tableHeader isHiddenMobile">Espécie</th>
                                    <th className="tableHeader">Data e Hora</th>
                                    <th className="tableHeader isHiddenMobile">Motivo</th>
                                    <th className="tableHeader actionColumn">Status/Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appt) => {
                                    const isPast = new Date(appt.date) < new Date();
                                    
                                    // Adiciona uma classe condicional para agendamentos passados
                                    const rowClass = isPast ? 'tableRow pastAppointment' : 'tableRow';

                                    return (
                                        <tr key={appt.id} className={rowClass}>
                                            <td className="tableCell primaryText">{appt.pet.name}</td>
                                            <td className="tableCell isHiddenMobile">{appt.pet.species}</td>
                                            <td className="tableCell">{formatAppointmentDate(appt.date)}</td>
                                            <td className="tableCell isHiddenMobile">{appt.description || 'N/A'}</td>
                                            
                                            <td className="tableCell actionColumn">
                                                {isPast ? (
                                                    // Status Concluído
                                                    <span style={{ color: 'gray', fontWeight: 'bold' }}>Concluída</span>
                                                ) : (
                                                    // Botões de Ação para agendamentos futuros
                                                    <>
                                                        <button 
                                                            onClick={() => handleEdit(appt)} 
                                                            className="tableActionButton editButton" 
                                                        >
                                                            Editar
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(appt.id)}
                                                            className="tableActionButton deleteButton"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    )})}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {/* MODAL DE EDIÇÃO */}
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

export default AppointmentList;