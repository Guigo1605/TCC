const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Rota de login
// Garante que AuthController.login é uma função exportada
router.post('/login', AuthController.login); 

// Rota de registro
// Garante que AuthController.register é uma função exportada
router.post('/register', AuthController.register); 

// Adicionando uma rota GET para exibir o formulário de login (Web)
router.get('/login', (req, res) => {
    res.render('usuarios/login', { title: 'Login' });
});

// Rota GET para exibir o formulário de registro (Web)
router.get('/register', (req, res) => {
    res.render('usuarios/register', { title: 'Registrar' });
});

module.exports = router;