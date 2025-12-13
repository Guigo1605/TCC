import React, { useState, useEffect } from 'react';
// eslint-disable-next-line
import api from '../../services/api';

// Função auxiliar para formatar a data ISO para o formato "YYYY-MM-DDTHH:MM" (necessário pelo input datetime-local)
function formatToInputDateTime(isoDate) {
    if (!isoDate) return '';
    
    // Converte a string ISO para um objeto Date
    const date = new Date(isoDate);
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) return '';

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
    // Garantia de que os hooks são chamados incondicionalmente
    const [date, setDate] = useState(formatToInputDateTime(appointment.date));
    const [description, setDescription] = useState(appointment.description || '');
    const [loading, setLoading] = useState(false);

    // Efeito para re-renderizar o modal caso a prop 'appointment' mude
    useEffect(() => {
        setDate(formatToInputDateTime(appointment.date));
        setDescription(appointment.description || '');
    }, [appointment]);


    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        // Converte de volta para o formato ISO que o backend espera
        const newDate = new Date(date).toISOString(); 

        try {
            const updatedData = {
                date: newDate,
                description,
                status: 'scheduled' // Mantém o status como agendado
            };

            // eslint-disable-next-line
            await api.put(`/appointments/${appointment.id}`, updatedData);
            
            alert('Agendamento atualizado com sucesso!');
            onUpdateSuccess(); 

        } catch (error) {
            console.error("Erro ao editar agendamento:", error.response?.data?.error || error.message);
            alert(`Erro ao atualizar: ${error.response?.data?.error || 'Verifique se a nova data está no futuro e tente novamente.'}`);
        } finally {
            setLoading(false);
        }
    }

    // Se o animal não veio junto com o agendamento (improvável, mas segurança), usamos 'Pet Indefinido'
    const petName = appointment.pet?.name || 'Pet Indefinido';
    const petSpecies = appointment.pet?.species || 'Espécie Desconhecida';


    return (
        // Substituindo styles por classes globais
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                
                {/* Título com negrito (strong) */}
                <h3 className="modalTitle">Reagendar Consulta</h3>
                <p>Pet: <strong>{petName}</strong> | Espécie: <span>{petSpecies}</span></p>
                
                {/* Botão de fechar */}
                <button className="modalCloseButton" onClick={onClose}>&times;</button>

                <form onSubmit={handleSubmit} className="formCard formModal" style={{marginTop: '20px'}}>
                    
                    {/* Campo 1: Data e Hora */}
                    <div className="inputGroup">
                        <label htmlFor="edit-date" className="inputLabel">Nova Data e Hora:</label>
                        <input 
                            id="edit-date" 
                            type="datetime-local" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                            className="inputField"
                        />
                    </div>

                    {/* Campo 2: Descrição */}
                    <div className="inputGroup">
                        <label htmlFor="edit-description" className="inputLabel">Motivo (Opcional):</label>
                        <textarea 
                            id="edit-description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            rows="3"
                            className="inputField"
                        />
                    </div>
                    
                    {/* Botão de Salvar */}
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="primaryButton"
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                    
                    {/* Botão de Cancelar/Fechar */}
                    <button 
                        type="button" 
                        className="secondaryButton" 
                        onClick={onClose}
                        style={{marginTop: '10px'}}
                    >
                        Cancelar Edição
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditAppointmentModal;