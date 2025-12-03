const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas /usuarios

// Middleware para verificar se o usuário é ADMIN (para listar todos)
const checkAdmin = (req, res, next) => {
  if (req.usuario.perfil !== 'admin') {
    return res.status(403).json({ msg: 'Acesso negado. Requer perfil de administrador.' });
  }
  next();
};

// GET /usuarios (Lista todos - APENAS ADMIN)
router.get('/', authMiddleware, checkAdmin, UsuarioController.index);

// GET /usuarios/:id (Detalhes de um usuário - ADMIN ou Dono do perfil)
router.get('/:id', authMiddleware, UsuarioController.show);

// PUT /usuarios/:id (Atualiza um usuário - ADMIN ou Dono do perfil)
router.put('/:id', authMiddleware, UsuarioController.update);

// DELETE /usuarios/:id (Implementar com cuidado!)

module.exports = router;