const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/AgendamentoController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Todas as rotas abaixo requerem login

// Rota para mostrar o formulário de criação (Web)
router.get('/create', AgendamentoController.showCreateForm);

// Rota para processar a criação (POST Web/API)
router.post('/', AgendamentoController.create);

// Rota para listar agendamentos (Web/API)
router.get('/', AgendamentoController.index);

// Rota para deletar agendamento (Web/API)
router.post('/:id/delete', AgendamentoController.delete); // Usando POST para simular deleção em ambiente Web

module.exports = router;