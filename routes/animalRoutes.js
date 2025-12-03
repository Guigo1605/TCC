const express = require('express');
const router = express.Router();
const AnimalController = require('../controllers/AnimalController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Todas as rotas abaixo requerem login

// GET /animais (Lista pets do cliente ou todos se for admin)
router.get('/', AnimalController.index);

// POST /animais (Cria um novo pet)
router.post('/', AnimalController.create);

// PUT /animais/:id (Atualiza um pet)
router.put('/:id', AnimalController.update);

// Exemplo de rota de view
// router.get('/adicionar', (req, res) => res.render('animais/create', { title: 'Adicionar Pet' }));

module.exports = router;