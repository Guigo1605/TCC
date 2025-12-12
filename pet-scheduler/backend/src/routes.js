const { Router } = require('express');
const UserController = require('./controllers/UserController');
const AnimalController = require('./controllers/AnimalController');
const AppointmentController = require('./controllers/AppointmentController'); // << Novo Controller
const authMiddleware = require('./middlewares/auth');

const routes = new Router();

// --- Rotas de Autenticação (Acesso Público) ---
routes.post('/users', UserController.store);     // Registro de novo usuário (Signup)
routes.post('/sessions', UserController.login);  // Login (Signin)

// Aplica o Middleware de autenticação para todas as rotas abaixo
routes.use(authMiddleware); 

// --- Rotas de Animais (Protegidas) ---
routes.post('/animals', AnimalController.store);
routes.get('/animals', AnimalController.index);

// --- Rotas de Agendamentos (Protegidas) ---
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);

module.exports = routes;