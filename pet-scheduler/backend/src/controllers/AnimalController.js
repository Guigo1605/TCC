// backend/src/controllers/AnimalController.js

// O caminho correto deve ser: '../models/NOME_DO_MODELO'
const Animal = require('../models/Animal'); 
const User = require('../models/User'); 

module.exports = {

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
};