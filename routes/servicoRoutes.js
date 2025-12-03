const express = require('express');
const router = express.Router();
const ServicoController = require('../controllers/ServicoController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Todas as rotas abaixo requerem login

// GET /servicos (Lista todos os serviços - Acessível por todos logados)
router.get('/', ServicoController.index);

// POST /servicos (Cria novo serviço - APENAS ADMIN, checkAdmin está no controller)
router.post('/', ServicoController.create);

// DELETE /servicos/:id (Exclui serviço - APENAS ADMIN)
router.delete('/:id', ServicoController.delete);

module.exports = router;