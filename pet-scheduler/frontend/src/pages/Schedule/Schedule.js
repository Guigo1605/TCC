import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line
import api from '../../services/api';
import Header from '../../components/Header/Header'; // Importando o Header

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
        // eslint-disable-next-line
        async function loadAnimals() {
            try {
                // eslint-disable-next-line
                setLoading(true);
                // eslint-disable-next-line
                const response = await api.get('/animals'); 
                setAnimals(response.data);
            } catch (error) {
                console.error("Erro ao carregar animais:", error);
                // eslint-disable-next-line
                alert('Não foi possível carregar a lista de pets. Tente novamente.');
            } finally {
                // eslint-disable-next-line
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
                // Converte a data do input (datetime-local) para ISOstring (esperado pelo backend)
                date: new Date(appointmentDate).toISOString(), 
                description,
            };

            // eslint-disable-next-line
            await api.post('/appointments', scheduleData);

            alert('Consulta agendada com sucesso!');
            navigate('/appointments-list'); // Redireciona para a lista de agendamentos

        } catch (error) {
            console.error("Erro no agendamento:", error.response ? error.response.data.error : error.message);
            // Exibe a mensagem de erro do backend (ex: conflito de horário)
            alert(`Falha no agendamento: ${error.response?.data?.error || 'Erro desconhecido.'}`);
        } finally {
            setSubmitting(false);
        }
    }

    // --- RENDERIZAÇÃO CONDICIONAL ---

    if (loading) {
        return (
            <div className="container">
                <Header title="Agendar Consulta 🏥" isHome={false} />
                <div className="mainContentInner">
                    <h3 className="loadingText">Carregando seus animais...</h3>
                </div>
            </div>
        );
    }
    
    // ESTADO VAZIO: Usuário não tem pets cadastrados
    if (animals.length === 0) {
        return (
            <div className="container">
                <Header title="Agendar Consulta 🏥" isHome={false} />
                <div className="mainContentInner">
                    <div className="emptyState">
                        <p className="emptyStateText">Você precisa cadastrar um pet para agendar uma consulta.</p>
                        <button onClick={() => navigate('/register-animal')} className="primaryButton" style={{ width: 'auto' }}>
                            Cadastrar Pet Agora
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // FORMULÁRIO PRINCIPAL
    return (
        <div className="container">
            <Header title="Agendar Consulta 🏥" isHome={false} />
            
            <div className="mainContentInner">
                <div className="formCard"> 
                    <h3 className="modalTitle">Detalhes da Consulta</h3>
                    
                    <form onSubmit={handleSubmit}>
                        
                        {/* Campo 1: Seleção do Animal (SELECT) */}
                        <div className="inputGroup">
                            <label htmlFor="animal" className="inputLabel">Selecione o Pet:</label>
                            <select
                                id="animal"
                                value={selectedAnimalId}
                                onChange={(e) => setSelectedAnimalId(e.target.value)}
                                required
                                className="inputField"
                            >
                                <option value="">-- Escolha um pet --</option>
                                {animals.map(animal => (
                                    <option key={animal.id} value={animal.id}>
                                        {animal.name} ({animal.species})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Campo 2: Data e Hora (DATETIME-LOCAL) */}
                        <div className="inputGroup">
                            <label htmlFor="date" className="inputLabel">Data e Hora da Consulta:</label>
                            <input
                                id="date"
                                type="datetime-local" // Permite selecionar data e hora
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                required
                                className="inputField"
                            />
                        </div>

                        {/* Campo 3: Descrição (TEXTAREA) */}
                        <div className="inputGroup">
                            <label htmlFor="description" className="inputLabel">Motivo da Consulta (Opcional):</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                                className="inputField"
                            />
                        </div>
                        
                        {/* Botão de Submissão */}
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="primaryButton"
                        >
                            {submitting ? 'Agendando...' : 'Confirmar Agendamento'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Schedule;