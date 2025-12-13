// src/pages/AnimalList/AnimalList.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line
import api from '../../services/api';
import Header from '../../components/Header/Header';
import EditAnimalModal from './EditAnimalModal';

function AnimalList() {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingAnimal, setEditingAnimal] = useState(null); 
    const navigate = useNavigate();

    // eslint-disable-next-line
    async function loadAnimals() {
        try {
            // eslint-disable-next-line
            setLoading(true);
            const response = await api.get('/animals'); 
            // eslint-disable-next-line
            setAnimals(response.data);
        } catch (error) {
            console.error("Erro ao carregar animais:", error);
            // Em produção, aqui seria um toast ou log mais detalhado.
        } finally {
            // eslint-disable-next-line
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAnimals();
    }, []);

    // --- FUNÇÃO PARA EXCLUIR ANIMAL ---
    async function handleDelete(animalId) {
        if (window.confirm('Tem certeza que deseja EXCLUIR este animal? Todos os agendamentos relacionados serão perdidos.')) {
            try {
                await api.delete(`/animals/${animalId}`);
                
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
        setEditingAnimal(animal); 
    };

    const handleUpdateSuccess = () => {
        setEditingAnimal(null); 
        loadAnimals(); 
    };


    if (loading) {
        return (
            <div className="container">
                <Header title="Meus Animais Cadastrados 🐾" isHome={false} />
                <div className="mainContentInner">
                    <h3 className="loadingText">Carregando seus animais...</h3>
                </div>
            </div>
        );
    }
    
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    return (
        <div className="container">
            
            <Header title="Meus Animais Cadastrados 🐾" isHome={false} />
            
            <div className="mainContentInner">
                
                <div className="listHeader">
                    <button onClick={() => navigate('/register-animal')} className="primaryButton" style={{ width: 'auto' }}>
                        + Novo Cadastro
                    </button>
                </div>

                {animals.length === 0 ? (
                    
                    // ESTADO VAZIO
                    <div className="emptyState">
                        <p className="emptyStateText">Você não possui animais cadastrados.</p>
                        <button onClick={() => navigate('/register-animal')} className="primaryButton" style={{ width: 'auto' }}>
                            Cadastrar Pet Agora
                        </button>
                    </div>

                ) : (
                    
                    // TABELA DE ANIMAIS
                    <div className="tableContainer">
                        <table className="dataTable">
                            <thead>
                                <tr>
                                    <th className="tableHeader">Nome</th>
                                    <th className="tableHeader">Espécie</th>
                                    <th className="tableHeader isHiddenMobile">Raça</th>
                                    <th className="tableHeader isHiddenMobile">Nascimento</th>
                                    <th className="tableHeader actionColumn"></th> 
                                </tr>
                            </thead>
                            <tbody>
                                {animals.map((animal) => (
                                    <tr key={animal.id} className="tableRow">
                                        <td className="tableCell primaryText">{animal.name}</td>
                                        <td className="tableCell">{animal.species}</td>
                                        <td className="tableCell isHiddenMobile">{animal.breed || '-'}</td>
                                        <td className="tableCell isHiddenMobile">{formatDate(animal.birth_date)}</td>
                                        
                                        <td className="tableCell actionColumn">
                                            <button 
                                                onClick={() => handleEdit(animal)} 
                                                className="tableActionButton editButton" 
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(animal.id)}
                                                className="tableActionButton deleteButton"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
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

export default AnimalList;