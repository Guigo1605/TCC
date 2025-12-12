// backend/src/controllers/AnimalController.js

const Animal = require('../models/Animal'); 
const User = require('../models/User'); 

module.exports = {

  // --- STORE (JÁ EXISTENTE) ---
  async store(req, res) {
    const user_id = req.userId; 
    const { name, species, breed, birth_date } = req.body;

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ error: 'Tutor não encontrado.' });
    }

    try {
      const animal = await Animal.create({
        user_id,
        name,
        species,
        breed,
        birth_date,
      });

      return res.json(animal);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao registrar o animal.' });
    }
  },

  // --- INDEX (JÁ EXISTENTE) ---
  async index(req, res) {
    const user_id = req.userId;

    const user = await User.findByPk(user_id, {
      include: { association: 'pets' },
    });

    if (!user) {
      return res.status(404).json({ error: 'Tutor não encontrado.' });
    }

    return res.json(user.pets);
  },

  // --- NOVO: UPDATE (ATUALIZAR ANIMAL) ---
  async update(req, res) {
    const { animal_id } = req.params;
    const user_id = req.userId;
    const { name, species, breed, birth_date } = req.body;

    try {
      const animal = await Animal.findOne({ 
        where: { id: animal_id, user_id } 
      });

      if (!animal) {
        return res.status(404).json({ error: 'Animal não encontrado ou não pertence a você.' });
      }

      const updatedAnimal = await animal.update({
        name,
        species,
        breed,
        birth_date,
      });

      return res.json(updatedAnimal);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar o animal.' });
    }
  },

  // --- NOVO: DELETE (EXCLUIR ANIMAL) ---
  async delete(req, res) {
    const { animal_id } = req.params;
    const user_id = req.userId;

    try {
      const animal = await Animal.findOne({ 
        where: { id: animal_id, user_id } 
      });

      if (!animal) {
        return res.status(404).json({ error: 'Animal não encontrado ou não pertence a você.' });
      }

      await animal.destroy();

      return res.status(204).send(); // Sucesso sem conteúdo
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao excluir o animal.' });
    }
  }
};