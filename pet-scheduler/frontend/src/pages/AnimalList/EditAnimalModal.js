// src/pages/AnimalList/EditAnimalModal.js

import React, { useState, useEffect } from 'react';
// eslint-disable-next-line
import api from '../../services/api';

// Função auxiliar para formatar a data ISO para o formato "YYYY-MM-DD"
function formatDateToInput(isoDate) {
    if (!isoDate) return '';
    
    const datePart = isoDate.split('T')[0];
    if (datePart.length === 10) return datePart;

    try {
        const dateObj = new Date(isoDate);
        if (isNaN(dateObj.getTime())) return ''; 

        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        
        return `${yyyy}-${mm}-${dd}`;
    } catch (e) {
        return '';
    }
}


function EditAnimalModal({ animal, onClose, onUpdateSuccess }) {
    
    // Os Hooks são chamados no topo, incondicionalmente.
    const [name, setName] = useState(animal.name);
    const [species, setSpecies] = useState(animal.species);
    const [breed, setBreed] = useState(animal.breed || '');
    const [birthDate, setBirthDate] = useState(formatDateToInput(animal.birth_date));
    const [loading, setLoading] = useState(false);
    
    // Lógica para resetar os estados se o animal de edição mudar
    useEffect(() => {
        setName(animal.name);
        setSpecies(animal.species);
        setBreed(animal.breed || '');
        setBirthDate(formatDateToInput(animal.birth_date));
    }, [animal]); 


    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        if (!name || !species) {
            alert('Nome e Espécie são obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            const updatedData = {
                name,
                species,
                breed,
                birth_date: birthDate ? new Date(birthDate).toISOString() : null,
            };

            // eslint-disable-next-line
            await api.put(`/animals/${animal.id}`, updatedData);

            alert(`Animal "${name}" atualizado com sucesso!`);
            onUpdateSuccess(); 
        } catch (error) {
            console.error("Erro ao atualizar animal:", error.response?.data?.error || error.message);
            alert('Erro ao atualizar o animal. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                
                {/* CORREÇÃO APLICADA AQUI: usando a tag <strong> */}
                <h3 className="modalTitle">Editar Dados do Pet: <strong>{animal.name}</strong></h3>
                
                <button className="modalCloseButton" onClick={onClose}>&times;</button>
                
                <form onSubmit={handleSubmit} className="formCard formModal">
                    
                    <div className="inputGroup">
                        <label htmlFor="edit-name" className="inputLabel">Nome do Pet:</label>
                        <input
                            id="edit-name" type="text" value={name} 
                            onChange={(e) => setName(e.target.value)} required className="inputField"
                        />
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="edit-species" className="inputLabel">Espécie:</label>
                        <select id="edit-species" value={species} onChange={(e) => setSpecies(e.target.value)} required className="inputField">
                            <option value="">Selecione a Espécie</option>
                            <option value="Cachorro">Cachorro</option>
                            <option value="Gato">Gato</option>
                            <option value="Pássaro">Pássaro</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="edit-breed" className="inputLabel">Raça (Opcional):</label>
                        <input id="edit-breed" type="text" value={breed} 
                            onChange={(e) => setBreed(e.target.value)} className="inputField"
                        />
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="edit-birthDate" className="inputLabel">Data de Nascimento:</label>
                        <input id="edit-birthDate" type="date" value={birthDate} 
                            onChange={(e) => setBirthDate(e.target.value)} className="inputField"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="primaryButton"
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                    
                    <button 
                        type="button" 
                        className="secondaryButton" 
                        onClick={onClose}
                        style={{marginTop: '10px'}}
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditAnimalModal;